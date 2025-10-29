# 🚀 Wokwi Quick Copy-Paste Guide

## Step-by-Step Instructions

### 1️⃣ Open Your Wokwi Project
Go to: https://wokwi.com/projects/446051268884225025

### 2️⃣ Copy These 3 Files

---

## FILE 1: sketch.ino

**Location:** Click on `sketch.ino` tab in Wokwi  
**Action:** Replace ALL content with this:

**Source:** Copy from `esp32-firmware/smart-home-wokwi.ino`

---

## FILE 2: diagram.json

**Location:** Click on `diagram.json` tab in Wokwi  
**Action:** Replace ALL content with this:

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

---

## FILE 3: libraries.txt

**Location:** Click on `libraries.txt` tab in Wokwi  
**Action:** Replace ALL content with this:

```
DHT sensor library
```

**Important:** Remove `ArduinoJson` if it's listed!

---

## 3️⃣ Run the Simulation

1. Click the green **Play** button ▶️
2. Wait 20-30 seconds for compilation
3. Open Serial Monitor (bottom panel)
4. Watch the output!

---

## 4️⃣ Test Commands

Type these in the Serial Monitor:

```
lamp on
lamp off
fan on
fan off
ac on
ac off
all on
all off
status
```

---

## ✅ Expected Output

You should see:
- ✅ System startup messages
- ✅ DHT22 sensor readings every 10 seconds
- ✅ Auto demo cycling devices
- ✅ LEDs lighting up (yellow, cyan, red)
- ✅ Response to your commands

---

## 🎯 Key Differences

**IN YOUR WOKWI CODE:**
- ❌ No `#include <WiFi.h>`
- ❌ No `#include <HTTPClient.h>`
- ❌ No `#include <ArduinoJson.h>`
- ✅ Only `#include "DHT.h"`
- ✅ Local simulation logic
- ✅ Serial command control

**FOR REAL HARDWARE:**
- Use `smart-home.ino` (original file)
- All includes enabled
- WiFi + Firebase connection
- Dashboard integration

---

## 📁 File Locations in Your Project

```
Smart Home Automation/
├── esp32-firmware/
│   ├── smart-home.ino          ← For REAL hardware
│   └── smart-home-wokwi.ino    ← For WOKWI simulation
├── WOKWI_SETUP.md              ← Detailed guide
└── WOKWI_QUICK_COPY.md         ← This file
```

---

## 🚨 Common Issues

### Issue: "Build server load"
**Fix:** Wait 30 seconds, try again

### Issue: Compilation error about ArduinoJson
**Fix:** Remove ArduinoJson from libraries.txt

### Issue: Serial Monitor empty
**Fix:** Check baud rate is 115200

### Issue: LEDs don't work
**Fix:** Type `status` to verify GPIO states

---

## 🎉 Success Criteria

Your simulation works if you see:
- ✅ "System ready!" message
- ✅ Temperature/humidity readings
- ✅ LEDs respond to commands
- ✅ Auto demo cycles devices
- ✅ No compilation errors

---

## 📞 Next Steps

1. ✅ Test in Wokwi (simulation)
2. ✅ Verify device control logic
3. ✅ Understand sensor readings
4. ➡️ Buy ESP32 hardware
5. ➡️ Use `smart-home.ino` for real hardware
6. ➡️ Connect to Firebase + Dashboard

---

**That's it!** 🎊

Your Wokwi simulation should now work perfectly. Once you verify the logic here, you'll be confident to move to real hardware!
