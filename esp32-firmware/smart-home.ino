/*
 * Smart Home Automation - ESP32 Firmware
 * Project: smart-home-automation-641fc
 * 
 * This firmware connects ESP32 to WiFi and Firebase Realtime Database
 * to control home appliances and send sensor data in real-time.
 * 
 * Hardware Requirements:
 * - ESP32 Development Board
 * - Relay modules for appliances (connected to GPIO pins)
 * - DHT22 Temperature/Humidity Sensor (optional)
 * - LEDs for status indication
 * 
 * Pin Configuration:
 * - GPIO 2: Built-in LED (status)
 * - GPIO 4: DHT22 Sensor
 * - GPIO 12: Relay 1 (Lamp)
 * - GPIO 13: Relay 2 (Fan)
 * - GPIO 14: Relay 3 (AC)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ===== CONFIGURATION =====
// WiFi Credentials
const char* ssid = "MCO";
const char* password = "Mco2025&6";

// Firebase Configuration
const char* firebaseHost = "https://smart-home-automation-641fc-default-rtdb.firebaseio.com";
const char* firebaseAuth = ""; // Optional: Add your Firebase secret or leave empty for open rules

// DHT Sensor Configuration
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// GPIO Pin Definitions
#define LED_PIN 2
#define RELAY_LAMP 12
#define RELAY_FAN 13
#define RELAY_AC 14

// Update intervals (milliseconds)
const unsigned long SENSOR_UPDATE_INTERVAL = 10000;  // 10 seconds
const unsigned long DEVICE_CHECK_INTERVAL = 2000;    // 2 seconds

// Global variables
unsigned long lastSensorUpdate = 0;
unsigned long lastDeviceCheck = 0;
bool wifiConnected = false;

// Device states
struct DeviceState {
  String name;
  String status;
  int pin;
};

DeviceState devices[] = {
  {"lamp1", "off", RELAY_LAMP},
  {"fan1", "off", RELAY_FAN},
  {"ac1", "off", RELAY_AC}
};

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== Smart Home Automation ESP32 ===");
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(RELAY_LAMP, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_AC, OUTPUT);
  
  // Set all relays to OFF initially
  digitalWrite(RELAY_LAMP, LOW);
  digitalWrite(RELAY_FAN, LOW);
  digitalWrite(RELAY_AC, LOW);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Connect to WiFi
  connectWiFi();
  
  // Initialize Firebase data
  if (wifiConnected) {
    initializeFirebase();
  }
  
  Serial.println("Setup complete!");
}

// ===== MAIN LOOP =====
void loop() {
  unsigned long currentMillis = millis();
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
    return;
  } else {
    wifiConnected = true;
    digitalWrite(LED_PIN, HIGH);
  }
  
  // Update sensor data periodically
  if (currentMillis - lastSensorUpdate >= SENSOR_UPDATE_INTERVAL) {
    lastSensorUpdate = currentMillis;
    updateSensorData();
  }
  
  // Check device states periodically
  if (currentMillis - lastDeviceCheck >= DEVICE_CHECK_INTERVAL) {
    lastDeviceCheck = currentMillis;
    checkDeviceStates();
  }
  
  delay(100);
}

// ===== WIFI FUNCTIONS =====
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Blink LED
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    wifiConnected = false;
    Serial.println("\nWiFi Connection Failed!");
    digitalWrite(LED_PIN, LOW);
  }
}

// ===== FIREBASE FUNCTIONS =====
void initializeFirebase() {
  Serial.println("Initializing Firebase data...");
  
  // Create initial device data
  String devicesData = "{";
  devicesData += "\"lamp1\":{\"status\":\"off\",\"name\":\"Living Room Lamp\"},";
  devicesData += "\"fan1\":{\"status\":\"off\",\"name\":\"Bedroom Fan\"},";
  devicesData += "\"ac1\":{\"status\":\"off\",\"name\":\"Air Conditioner\",\"temperature\":24}";
  devicesData += "}";
  
  // Send to Firebase
  String url = String(firebaseHost) + "/devices.json";
  if (firebaseAuth != "") {
    url += "?auth=" + String(firebaseAuth);
  }
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.PUT(devicesData);
  
  if (httpCode > 0) {
    Serial.println("Firebase initialized successfully");
  } else {
    Serial.println("Firebase initialization failed");
  }
  
  http.end();
}

void updateSensorData() {
  Serial.println("Reading sensors...");
  
  // Read DHT sensor
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  
  // Create JSON data
  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["lastUpdate"] = millis();
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  // Send to Firebase
  String url = String(firebaseHost) + "/sensors.json";
  if (firebaseAuth != "") {
    url += "?auth=" + String(firebaseAuth);
  }
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.PUT(jsonData);
  
  if (httpCode > 0) {
    Serial.println("Sensor data updated");
  } else {
    Serial.println("Failed to update sensor data");
  }
  
  http.end();
}

void checkDeviceStates() {
  // Fetch device states from Firebase
  for (int i = 0; i < 3; i++) {
    String deviceId = devices[i].name;
    String url = String(firebaseHost) + "/devices/" + deviceId + "/status.json";
    
    if (firebaseAuth != "") {
      url += "?auth=" + String(firebaseAuth);
    }
    
    HTTPClient http;
    http.begin(url);
    
    int httpCode = http.GET();
    
    if (httpCode == 200) {
      String payload = http.getString();
      payload.replace("\"", ""); // Remove quotes
      
      if (payload != devices[i].status) {
        devices[i].status = payload;
        updateDevicePin(i);
        Serial.print("Device ");
        Serial.print(deviceId);
        Serial.print(" updated to: ");
        Serial.println(payload);
      }
    }
    
    http.end();
  }
}

void updateDevicePin(int index) {
  bool state = (devices[index].status == "on");
  digitalWrite(devices[index].pin, state ? HIGH : LOW);
}

// ===== HELPER FUNCTIONS =====
void printStatus() {
  Serial.println("\n=== System Status ===");
  Serial.print("WiFi: ");
  Serial.println(wifiConnected ? "Connected" : "Disconnected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  Serial.println("\nDevices:");
  for (int i = 0; i < 3; i++) {
    Serial.print(devices[i].name);
    Serial.print(": ");
    Serial.println(devices[i].status);
  }
  Serial.println("===================\n");
}
