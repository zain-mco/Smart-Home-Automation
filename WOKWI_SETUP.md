# Wokwi Simulation Setup Guide

## 🎯 Quick Start

Your Wokwi project is at: https://wokwi.com/projects/446051268884225025

### Files You Need

1. **sketch.ino** → Use `smart-home-wokwi.ino` (simulation version)
2. **diagram.json** → Already provided (see below)
3. **libraries.txt** → Already configured

---

## 📁 Complete Wokwi Files

### 1. sketch.ino
Copy the contents of `esp32-firmware/smart-home-wokwi.ino` into your Wokwi sketch.ino tab.

### 2. diagram.json
```json
{
  "version": 1,
  "author": "Zain",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": -4.76, "attrs": {} },
    {
      "type": "wokwi-dht22",
      "id": "dht1",
      "top": -38.1,
      "left": 234.6,
      "attrs": { "temperature": "26.0", "humidity": "45.0" }
    },
    {
      "type": "wokwi-led",
      "id": "led_lamp",
      "top": 121.2,
      "left": 224.6,
      "attrs": { "color": "yellow" }
    },
    {
      "type": "wokwi-resistor",
      "id": "res_lamp",
      "top": 160,
      "left": 220,
      "attrs": { "value": "220" }
    },
    {
      "type": "wokwi-led",
      "id": "led_fan",
      "top": 121.2,
      "left": 320.6,
      "attrs": { "color": "cyan" }
    },
    {
      "type": "wokwi-resistor",
      "id": "res_fan",
      "top": 160,
      "left": 320,
      "attrs": { "value": "220" }
    },
    {
      "type": "wokwi-led",
      "id": "led_ac",
      "top": 121.2,
      "left": 416.6,
      "attrs": { "color": "red" }
    },
    {
      "type": "wokwi-resistor",
      "id": "res_ac",
      "top": 160,
      "left": 420,
      "attrs": { "value": "220" }
    }
  ],
  "connections": [
    [ "esp:VCC", "dht1:VCC", "red", [] ],
    [ "esp:GND.1", "dht1:GND", "black", [] ],
    [ "esp:4", "dht1:DATA", "green", [] ],
    [ "esp:12", "led_lamp:A", "orange", [] ],
    [ "led_lamp:C", "res_lamp:1", "black", [] ],
    [ "res_lamp:2", "esp:GND.2", "black", [] ],
    [ "esp:13", "led_fan:A", "purple", [] ],
    [ "led_fan:C", "res_fan:1", "black", [] ],
    [ "res_fan:2", "esp:GND.3", "black", [] ],
    [ "esp:14", "led_ac:A", "blue", [] ],
    [ "led_ac:C", "res_ac:1", "black", [] ],
    [ "res_ac:2", "esp:GND.4", "black", [] ],
    [ "esp:TX", "$serialMonitor:RX", "", [] ],
    [ "esp:RX", "$serialMonitor:TX", "", [] ]
  ],
  "dependencies": {}
}
```

### 3. libraries.txt
```
# Wokwi Library List
# See https://docs.wokwi.com/guides/libraries

# Automatically added based on includes:
DHT sensor library
```

**Note:** We removed ArduinoJson from libraries.txt since the Wokwi version doesn't need it.

---

## 🚀 How to Use in Wokwi

### Step 1: Upload Files
1. Go to your Wokwi project
2. Replace `sketch.ino` with contents of `smart-home-wokwi.ino`
3. Replace `diagram.json` with the JSON above
4. Update `libraries.txt` to only have `DHT sensor library`

### Step 2: Start Simulation
1. Click the green **Play** button ▶️
2. Wait for compilation (20-30 seconds)
3. Watch the Serial Monitor output

### Step 3: Interact with Devices

#### Method 1: Serial Commands
Type these commands in the Serial Monitor:

```
lamp on      → Turn lamp ON
lamp off     → Turn lamp OFF
fan on       → Turn fan ON
fan off      → Turn fan OFF
ac on        → Turn AC ON
ac off       → Turn AC OFF
all on       → Turn all devices ON
all off      → Turn all devices OFF
status       → Show system status
```

#### Method 2: Auto Demo
The simulation automatically cycles through devices every 15 seconds.

### Step 4: Monitor Sensors
- DHT22 reads temperature and humidity every 10 seconds
- Values are displayed in Serial Monitor
- You can change sensor values in diagram.json:
  ```json
  "attrs": { "temperature": "30.0", "humidity": "60.0" }
  ```

---

## 📊 What You'll See

### Serial Monitor Output
```
╔════════════════════════════════════════╗
║  Smart Home Automation - WOKWI SIM   ║
╚════════════════════════════════════════╝

✓ GPIO Pins initialized
✓ DHT22 sensor initialized
✓ System ready!

═══════════════════════════════════════
SIMULATION MODE - Testing locally
Commands available via Serial:
  'lamp on'  - Turn lamp ON
  'lamp off' - Turn lamp OFF
  ...
═══════════════════════════════════════

[SENSOR UPDATE]
  🌡️  Temperature: 26.0°C
  💧 Humidity: 45.0%
  ✓ Data logged (simulation)

[AUTO DEMO] Turning lamp ON...
  🔄 lamp1 → ON ✓
```

### Visual Feedback
- **Yellow LED (GPIO 12)** → Lamp status
- **Cyan LED (GPIO 13)** → Fan status
- **Red LED (GPIO 14)** → AC status
- **Built-in LED (GPIO 2)** → Blinks to show system is running

---

## 🔄 Differences from Real Hardware

### Wokwi Version (smart-home-wokwi.ino)
✅ Works in browser simulation  
✅ No WiFi/Firebase needed  
✅ Manual control via Serial commands  
✅ Auto-demo mode for testing  
✅ Simulated sensor readings  
❌ No actual cloud connectivity  
❌ No real-time sync with dashboard  

### Real Hardware Version (smart-home.ino)
✅ Real WiFi connection  
✅ Real Firebase integration  
✅ Syncs with web dashboard  
✅ Real sensor readings  
✅ Internet-based control  
❌ Requires physical ESP32  
❌ Needs WiFi credentials  

---

## 🎮 Testing Scenarios

### Scenario 1: Device Control
1. Type `lamp on` in Serial Monitor
2. Watch yellow LED turn ON
3. Type `lamp off`
4. Watch yellow LED turn OFF

### Scenario 2: All Devices
1. Type `all on`
2. All three LEDs should light up
3. Type `all off`
4. All LEDs should turn off

### Scenario 3: Sensor Monitoring
1. Wait for sensor update (every 10 seconds)
2. Check temperature and humidity in Serial
3. Modify values in diagram.json
4. Restart simulation to see new values

### Scenario 4: Status Check
1. Type `status`
2. See complete system status
3. Check GPIO states
4. Verify device states

---

## 🐛 Troubleshooting

### ❌ Compilation Fails
**Problem:** "Build server load" or compilation errors

**Solutions:**
1. Wait 30 seconds and try again (Wokwi server may be busy)
2. Check libraries.txt only has `DHT sensor library`
3. Remove any `#include <ArduinoJson.h>` lines
4. Verify code is copied correctly

### ❌ DHT Sensor Shows NaN
**Problem:** Sensor readings show "NaN"

**Solutions:**
1. Wait 2-3 seconds after starting simulation
2. Check DHT22 connections in diagram
3. Sensor uses simulated values if real reading fails

### ❌ LEDs Don't Light Up
**Problem:** Commands work but LEDs stay off

**Solutions:**
1. Check LED connections in diagram.json
2. Verify resistor values (220Ω)
3. Type `status` to check GPIO states
4. Restart simulation

### ❌ Serial Monitor Empty
**Problem:** No output in Serial Monitor

**Solutions:**
1. Check baud rate is 115200
2. Verify TX/RX connections to $serialMonitor
3. Click "Restart" button in Wokwi

---

## 📝 Next Steps

### After Testing in Wokwi
1. ✅ Verify GPIO logic works
2. ✅ Test sensor readings
3. ✅ Understand device control flow
4. ➡️ Move to real ESP32 hardware
5. ➡️ Use `smart-home.ino` for real Firebase integration
6. ➡️ Connect to React dashboard

### Transitioning to Real Hardware
1. Buy ESP32 board ($5-10)
2. Upload `smart-home.ino` (not the wokwi version)
3. Update WiFi credentials
4. Connect to Firebase
5. Test with web dashboard
6. Add actual relays for real appliances

---

## 🎯 Quick Commands Reference

| Command | Action |
|---------|--------|
| `lamp on` | Turn lamp ON |
| `lamp off` | Turn lamp OFF |
| `fan on` | Turn fan ON |
| `fan off` | Turn fan OFF |
| `ac on` | Turn AC ON |
| `ac off` | Turn AC OFF |
| `all on` | Turn all devices ON |
| `all off` | Turn all devices OFF |
| `status` | Show system status |

---

## ✅ Checklist

Before starting simulation:
- [ ] `sketch.ino` uses `smart-home-wokwi.ino` code
- [ ] `diagram.json` is correctly configured
- [ ] `libraries.txt` only has `DHT sensor library`
- [ ] No `#include <ArduinoJson.h>` in code
- [ ] Serial Monitor is open and set to 115200 baud

---

## 📞 Support

**For Wokwi Issues:**
- Check Wokwi documentation: https://docs.wokwi.com
- Wokwi Discord community

**For Project Issues:**
- See `TROUBLESHOOTING.md`
- Check `FAQ.md`
- Review `SETUP_GUIDE.md`

---

**Happy Simulating!** 🎉

Once you verify everything works in Wokwi, you'll be ready to move to real hardware with confidence!
