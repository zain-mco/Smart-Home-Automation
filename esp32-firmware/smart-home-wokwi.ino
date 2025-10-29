/*
 * Smart Home Automation - ESP32 Firmware (WOKWI SIMULATION VERSION)
 * Project: smart-home-automation-641fc
 * 
 * This version simulates Firebase for Wokwi testing
 * For real hardware, use smart-home.ino instead
 * 
 * Pin Configuration:
 * - GPIO 2: Built-in LED (status)
 * - GPIO 4: DHT22 Sensor
 * - GPIO 12: LED Lamp (Yellow)
 * - GPIO 13: LED Fan (Cyan)
 * - GPIO 14: LED AC (Red)
 */

#include "DHT.h"

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
const unsigned long DEVICE_CHECK_INTERVAL = 5000;    // 5 seconds for demo

// Global variables
unsigned long lastSensorUpdate = 0;
unsigned long lastDeviceCheck = 0;

// Device states (simulated Firebase)
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

// Simulated Firebase data
float simulatedTemp = 26.0;
float simulatedHumidity = 45.0;

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n╔════════════════════════════════════════╗");
  Serial.println("║  Smart Home Automation - WOKWI SIM   ║");
  Serial.println("╚════════════════════════════════════════╝");
  Serial.println();
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(RELAY_LAMP, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_AC, OUTPUT);
  
  // Set all devices to OFF initially
  digitalWrite(RELAY_LAMP, LOW);
  digitalWrite(RELAY_FAN, LOW);
  digitalWrite(RELAY_AC, LOW);
  digitalWrite(LED_PIN, HIGH); // System ready
  
  // Initialize DHT sensor
  dht.begin();
  delay(2000); // DHT sensor needs time to stabilize
  
  Serial.println("✓ GPIO Pins initialized");
  Serial.println("✓ DHT22 sensor initialized");
  Serial.println("✓ System ready!");
  Serial.println();
  Serial.println("═══════════════════════════════════════");
  Serial.println("SIMULATION MODE - Testing locally");
  Serial.println("Commands available via Serial:");
  Serial.println("  'lamp on'  - Turn lamp ON");
  Serial.println("  'lamp off' - Turn lamp OFF");
  Serial.println("  'fan on'   - Turn fan ON");
  Serial.println("  'fan off'  - Turn fan OFF");
  Serial.println("  'ac on'    - Turn AC ON");
  Serial.println("  'ac off'   - Turn AC OFF");
  Serial.println("  'status'   - Show system status");
  Serial.println("═══════════════════════════════════════");
  Serial.println();
  
  printStatus();
}

// ===== MAIN LOOP =====
void loop() {
  unsigned long currentMillis = millis();
  
  // Blink status LED
  digitalWrite(LED_PIN, (millis() / 1000) % 2);
  
  // Update sensor data periodically
  if (currentMillis - lastSensorUpdate >= SENSOR_UPDATE_INTERVAL) {
    lastSensorUpdate = currentMillis;
    updateSensorData();
  }
  
  // Simulate device state changes (demo mode)
  if (currentMillis - lastDeviceCheck >= DEVICE_CHECK_INTERVAL) {
    lastDeviceCheck = currentMillis;
    simulateDeviceChanges();
  }
  
  // Check for serial commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    command.toLowerCase();
    handleSerialCommand(command);
  }
  
  delay(100);
}

// ===== SENSOR FUNCTIONS =====
void updateSensorData() {
  Serial.println("\n[SENSOR UPDATE]");
  
  // Read DHT sensor
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("⚠ Failed to read from DHT sensor!");
    Serial.println("  Using simulated values...");
    humidity = simulatedHumidity;
    temperature = simulatedTemp;
  }
  
  Serial.print("  🌡️  Temperature: ");
  Serial.print(temperature, 1);
  Serial.println("°C");
  
  Serial.print("  💧 Humidity: ");
  Serial.print(humidity, 1);
  Serial.println("%");
  
  // In real version, this data would be sent to Firebase
  Serial.println("  ✓ Data logged (simulation)");
}

// ===== DEVICE CONTROL =====
void simulateDeviceChanges() {
  // This simulates Firebase checking for device state changes
  // In Wokwi, you can manually trigger changes via Serial commands
  
  // Demo: Automatically cycle through states every 15 seconds
  static int demoCounter = 0;
  demoCounter++;
  
  if (demoCounter % 3 == 1) {
    Serial.println("\n[AUTO DEMO] Turning lamp ON...");
    setDeviceState(0, "on");
  } else if (demoCounter % 3 == 2) {
    Serial.println("\n[AUTO DEMO] Turning fan ON...");
    setDeviceState(1, "on");
  } else {
    Serial.println("\n[AUTO DEMO] Turning all OFF...");
    setDeviceState(0, "off");
    setDeviceState(1, "off");
    setDeviceState(2, "off");
  }
}

void setDeviceState(int index, String newStatus) {
  if (index < 0 || index >= 3) return;
  
  if (devices[index].status != newStatus) {
    devices[index].status = newStatus;
    updateDevicePin(index);
    
    Serial.print("  🔄 ");
    Serial.print(devices[index].name);
    Serial.print(" → ");
    Serial.println(newStatus.equals("on") ? "ON ✓" : "OFF");
  }
}

void updateDevicePin(int index) {
  bool state = (devices[index].status == "on");
  digitalWrite(devices[index].pin, state ? HIGH : LOW);
}

// ===== SERIAL COMMAND HANDLER =====
void handleSerialCommand(String command) {
  Serial.println("\n[COMMAND RECEIVED]: " + command);
  
  if (command == "status") {
    printStatus();
  }
  else if (command == "lamp on") {
    setDeviceState(0, "on");
    Serial.println("  ✓ Lamp turned ON");
  }
  else if (command == "lamp off") {
    setDeviceState(0, "off");
    Serial.println("  ✓ Lamp turned OFF");
  }
  else if (command == "fan on") {
    setDeviceState(1, "on");
    Serial.println("  ✓ Fan turned ON");
  }
  else if (command == "fan off") {
    setDeviceState(1, "off");
    Serial.println("  ✓ Fan turned OFF");
  }
  else if (command == "ac on") {
    setDeviceState(2, "on");
    Serial.println("  ✓ AC turned ON");
  }
  else if (command == "ac off") {
    setDeviceState(2, "off");
    Serial.println("  ✓ AC turned OFF");
  }
  else if (command == "all on") {
    setDeviceState(0, "on");
    setDeviceState(1, "on");
    setDeviceState(2, "on");
    Serial.println("  ✓ All devices turned ON");
  }
  else if (command == "all off") {
    setDeviceState(0, "off");
    setDeviceState(1, "off");
    setDeviceState(2, "off");
    Serial.println("  ✓ All devices turned OFF");
  }
  else {
    Serial.println("  ⚠ Unknown command!");
    Serial.println("  Type 'status' for help");
  }
}

// ===== STATUS DISPLAY =====
void printStatus() {
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║         SYSTEM STATUS                 ║");
  Serial.println("╚════════════════════════════════════════╝");
  
  Serial.println("\n📊 Device States:");
  for (int i = 0; i < 3; i++) {
    Serial.print("  ");
    
    // Icon
    if (i == 0) Serial.print("💡 ");
    else if (i == 1) Serial.print("🌀 ");
    else Serial.print("❄️  ");
    
    Serial.print(devices[i].name);
    Serial.print(": ");
    
    if (devices[i].status == "on") {
      Serial.println("ON ✓ (GPIO " + String(devices[i].pin) + " HIGH)");
    } else {
      Serial.println("OFF (GPIO " + String(devices[i].pin) + " LOW)");
    }
  }
  
  Serial.println("\n🔌 GPIO Pins:");
  Serial.println("  LED Status:  GPIO 2  → " + String(digitalRead(LED_PIN) ? "HIGH" : "LOW"));
  Serial.println("  DHT22 Data:  GPIO 4");
  Serial.println("  Lamp:        GPIO 12 → " + String(digitalRead(RELAY_LAMP) ? "HIGH" : "LOW"));
  Serial.println("  Fan:         GPIO 13 → " + String(digitalRead(RELAY_FAN) ? "HIGH" : "LOW"));
  Serial.println("  AC:          GPIO 14 → " + String(digitalRead(RELAY_AC) ? "HIGH" : "LOW"));
  
  Serial.println("\n⏱️  Runtime: " + String(millis() / 1000) + " seconds");
  Serial.println("════════════════════════════════════════\n");
}
