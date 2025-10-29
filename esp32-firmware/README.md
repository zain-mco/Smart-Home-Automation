# ESP32 Firmware - Smart Home Automation

## Hardware Requirements

### Components
- **ESP32 Development Board** (ESP32-DevKitC or similar)
- **3x Relay Modules** (5V, for controlling AC appliances)
- **DHT22 Temperature/Humidity Sensor** (optional)
- **Jumper Wires**
- **Power Supply** (5V/2A USB or external power)

### Pin Connections

| Component | ESP32 GPIO Pin |
|-----------|----------------|
| Built-in LED | GPIO 2 (status indicator) |
| DHT22 Sensor Data | GPIO 4 |
| Relay 1 (Lamp) | GPIO 12 |
| Relay 2 (Fan) | GPIO 13 |
| Relay 3 (AC) | GPIO 14 |

### Relay Module Connections
```
ESP32 GPIO -> Relay IN
ESP32 GND -> Relay GND
ESP32 5V -> Relay VCC

Relay COM -> AC Live Wire
Relay NO -> Appliance Live Wire
```

⚠️ **WARNING**: Working with AC power is dangerous. If you're not experienced, use DC appliances or LED bulbs for testing.

## Software Requirements

### Arduino IDE Setup
1. Install Arduino IDE (v2.0 or later)
2. Add ESP32 board support:
   - Go to File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to Tools → Board → Boards Manager
   - Search for "ESP32" and install

### Required Libraries
Install via Arduino Library Manager (Tools → Manage Libraries):
- **WiFi** (built-in with ESP32)
- **HTTPClient** (built-in with ESP32)
- **ArduinoJson** by Benoit Blanchon
- **DHT sensor library** by Adafruit
- **Adafruit Unified Sensor** (dependency for DHT)

## Configuration

### 1. Update WiFi Credentials
Edit `smart-home.ino` and replace:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 2. Firebase Configuration
The firmware uses your Firebase Realtime Database URL:
```cpp
const char* firebaseHost = "https://smart-home-automation-641fc-default-rtdb.firebaseio.com";
```

For production, add authentication:
```cpp
const char* firebaseAuth = "YOUR_FIREBASE_SECRET";
```

### 3. Firebase Database Rules
For testing, set rules to public (⚠️ Not recommended for production):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, use authentication:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## Upload Instructions

1. Open `smart-home.ino` in Arduino IDE
2. Connect ESP32 to your computer via USB
3. Select your board:
   - Tools → Board → ESP32 Arduino → ESP32 Dev Module
4. Select the correct COM port:
   - Tools → Port → (your ESP32 port)
5. Click Upload button (→)

## Testing

### Serial Monitor
Open Serial Monitor (Tools → Serial Monitor) at 115200 baud to see:
- WiFi connection status
- Firebase communication
- Sensor readings
- Device state changes

### Expected Output
```
=== Smart Home Automation ESP32 ===
Connecting to WiFi: YourNetwork
....
WiFi Connected!
IP Address: 192.168.1.100
Initializing Firebase data...
Firebase initialized successfully
Setup complete!

Reading sensors...
Temperature: 26.5°C, Humidity: 45%
Sensor data updated
```

## Troubleshooting

### WiFi Not Connecting
- Verify SSID and password
- Check 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move closer to router

### Firebase Connection Failed
- Check Firebase URL is correct
- Verify database rules allow access
- Check internet connection

### Sensor Reading NaN
- Check DHT22 connections
- Verify correct GPIO pin
- Wait 2 seconds after power-on for sensor to stabilize

### Relay Not Switching
- Check relay connections
- Verify GPIO pins are correct
- Test relay with digitalWrite HIGH/LOW
- Check power supply (relays need sufficient current)

## Customization

### Add More Devices
1. Define new GPIO pin:
```cpp
#define RELAY_NEW_DEVICE 15
```

2. Add to devices array:
```cpp
DeviceState devices[] = {
  {"lamp1", "off", RELAY_LAMP},
  {"fan1", "off", RELAY_FAN},
  {"ac1", "off", RELAY_AC},
  {"newdevice1", "off", RELAY_NEW_DEVICE}
};
```

3. Initialize pin in setup():
```cpp
pinMode(RELAY_NEW_DEVICE, OUTPUT);
digitalWrite(RELAY_NEW_DEVICE, LOW);
```

### Adjust Update Intervals
```cpp
const unsigned long SENSOR_UPDATE_INTERVAL = 10000;  // Sensor updates
const unsigned long DEVICE_CHECK_INTERVAL = 2000;    // Device state checks
```

## Alternative: PlatformIO Setup

For advanced users, use PlatformIO:

1. Create `platformio.ini`:
```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps = 
    bblanchon/ArduinoJson@^6.21.0
    adafruit/DHT sensor library@^1.4.4
    adafruit/Adafruit Unified Sensor@^1.1.9
monitor_speed = 115200
```

2. Upload with PlatformIO CLI:
```bash
pio run --target upload
pio device monitor
```

## Security Best Practices

1. **Never hardcode credentials** in production
2. Use Firebase Authentication for secure access
3. Store secrets in environment variables
4. Enable Firebase Security Rules
5. Use HTTPS for all communications
6. Regular firmware updates for security patches

## Next Steps

- Implement OTA (Over-The-Air) updates
- Add MQTT support for faster communication
- Implement local control with web server
- Add more sensors (motion, light, gas)
- Create automation rules (time-based, sensor-triggered)
