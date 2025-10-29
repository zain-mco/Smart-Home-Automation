# Smart Home Automation - Complete Setup Guide

This guide will walk you through setting up the entire Smart Home Automation system from scratch.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Dashboard Setup](#dashboard-setup)
4. [ESP32 Setup](#esp32-setup)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- ✅ Node.js (v18 or later) - [Download](https://nodejs.org/)
- ✅ Arduino IDE or PlatformIO - [Download](https://www.arduino.cc/en/software)
- ✅ Git (optional) - [Download](https://git-scm.com/)
- ✅ Vercel CLI (optional) - `npm install -g vercel`

### Required Hardware
- ✅ ESP32 Development Board
- ✅ USB Cable (for programming ESP32)
- ✅ 3x Relay Modules (5V)
- ✅ DHT22 Temperature/Humidity Sensor
- ✅ Jumper Wires
- ✅ Power Supply (5V/2A)
- ✅ Breadboard (optional, for prototyping)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `Smart Home Automation`
4. Project ID will auto-generate (or use: `smart-home-automation-641fc`)
5. Disable Google Analytics (optional for this project)
6. Click **"Create Project"**

### Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build → Realtime Database**
2. Click **"Create Database"**
3. Choose location closest to you
4. Start in **"Test Mode"** (we'll secure it later)
5. Click **"Enable"**

### Step 3: Initialize Database Structure

In the Realtime Database page:
1. Click on the **"Data"** tab
2. Click the **"+"** icon next to your database URL
3. Add this structure:

```json
{
  "devices": {
    "lamp1": {
      "name": "Living Room Lamp",
      "status": "off"
    },
    "fan1": {
      "name": "Bedroom Fan",
      "status": "off"
    },
    "ac1": {
      "name": "Air Conditioner",
      "status": "off",
      "temperature": 24
    }
  },
  "sensors": {
    "temperature": 0,
    "humidity": 0,
    "lastUpdate": 0
  }
}
```

### Step 4: Enable Authentication

1. Go to **Build → Authentication**
2. Click **"Get Started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Save"**
5. Go to **"Users"** tab
6. Click **"Add User"**
7. Add a user:
   - Email: `demo@smarthome.com`
   - Password: `demo123`

### Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`)
4. Register app name: `Smart Home Dashboard`
5. Copy the `firebaseConfig` object

---

## Dashboard Setup

### Step 1: Install Dependencies

```bash
cd dashboard
npm install
```

### Step 2: Configure Firebase

1. Open `dashboard/src/config/firebase.js`
2. Replace with your Firebase config from above:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "smart-home-automation-641fc.firebaseapp.com",
  databaseURL: "https://smart-home-automation-641fc-default-rtdb.firebaseio.com",
  projectId: "smart-home-automation-641fc",
  storageBucket: "smart-home-automation-641fc.appspot.com",
  messagingSenderId: "991060932691",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open browser at `http://localhost:3000`

### Step 4: Test Login

- Email: `demo@smarthome.com`
- Password: `demo123`

You should see the dashboard with your devices!

---

## ESP32 Setup

### Step 1: Install Arduino IDE & Libraries

1. Open Arduino IDE
2. Install ESP32 Board Support:
   - File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager
   - Search "ESP32" and install

3. Install Libraries (Tools → Manage Libraries):
   - ArduinoJson by Benoit Blanchon
   - DHT sensor library by Adafruit
   - Adafruit Unified Sensor

### Step 2: Hardware Connections

Connect according to this diagram:

```
ESP32          Component
-----          ---------
GPIO 4    →    DHT22 Data Pin
GPIO 12   →    Relay 1 (Lamp) IN
GPIO 13   →    Relay 2 (Fan) IN
GPIO 14   →    Relay 3 (AC) IN
5V        →    Relay VCC, DHT22 VCC
GND       →    Relay GND, DHT22 GND
```

### Step 3: Configure Firmware

1. Open `esp32-firmware/smart-home.ino`
2. Update WiFi credentials:

```cpp
const char* ssid = "Your_WiFi_Name";
const char* password = "Your_WiFi_Password";
```

3. Firebase URL is already configured:
```cpp
const char* firebaseHost = "https://smart-home-automation-641fc-default-rtdb.firebaseio.com";
```

### Step 4: Upload to ESP32

1. Connect ESP32 to computer via USB
2. Select board: **Tools → Board → ESP32 Dev Module**
3. Select port: **Tools → Port → (your COM port)**
4. Click **Upload** button (→)
5. Wait for "Done uploading"

### Step 5: Monitor Serial Output

1. Open Serial Monitor: **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   ```
   === Smart Home Automation ESP32 ===
   Connecting to WiFi: YourNetwork
   WiFi Connected!
   IP Address: 192.168.1.xxx
   ```

---

## Testing

### Test 1: Device Control from Dashboard

1. Open dashboard in browser
2. Log in with your credentials
3. Click a device card (e.g., "Living Room Lamp")
4. Click **"Turn ON"** button
5. Watch Serial Monitor - you should see:
   ```
   Device lamp1 updated to: on
   ```
6. The relay should click and LED should light up

### Test 2: Sensor Data

1. In Serial Monitor, check for sensor readings:
   ```
   Reading sensors...
   Temperature: 26.5°C, Humidity: 45%
   Sensor data updated
   ```
2. Dashboard should show real-time temperature and humidity
3. Data updates every 10 seconds

### Test 3: Real-time Sync

1. Open Firebase Console → Realtime Database
2. Manually change `devices/lamp1/status` to `"off"`
3. ESP32 should respond within 2 seconds
4. Dashboard should update automatically

---

## Deployment

### Deploy to Vercel

```bash
cd dashboard
npm run build
vercel --prod
```

Follow prompts to deploy. You'll get a URL like:
```
https://smart-home-dashboard.vercel.app
```

### Deploy to Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select existing project
# Public directory: dashboard/dist
# Single-page app: Yes
firebase deploy
```

---

## Security Setup (Production)

### 1. Update Firebase Database Rules

Go to Realtime Database → Rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 2. Enable Firebase Auth in ESP32

Get Firebase secret:
1. Project Settings → Service Accounts
2. Database Secrets → Show

Update ESP32 code:
```cpp
const char* firebaseAuth = "YOUR_DATABASE_SECRET";
```

### 3. Environment Variables

Create `dashboard/.env`:
```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_APP_ID=your_actual_app_id
```

Update `firebase.js` to use environment variables.

---

## Troubleshooting

### Dashboard Issues

**Problem:** Firebase connection error
- ✅ Check Firebase config in `firebase.js`
- ✅ Verify database rules allow access
- ✅ Check browser console for errors

**Problem:** Can't log in
- ✅ Verify user exists in Firebase Authentication
- ✅ Check email/password are correct
- ✅ Ensure Authentication is enabled

### ESP32 Issues

**Problem:** WiFi won't connect
- ✅ Check SSID and password
- ✅ Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- ✅ Move closer to router

**Problem:** Firebase updates not working
- ✅ Check Firebase URL is correct
- ✅ Verify database rules allow write access
- ✅ Check Serial Monitor for error messages

**Problem:** Sensor showing NaN
- ✅ Check DHT22 connections (Data, VCC, GND)
- ✅ Wait 2 seconds after power-on
- ✅ Try different GPIO pin
- ✅ Replace sensor if faulty

**Problem:** Relay not switching
- ✅ Check GPIO pin connections
- ✅ Verify relay gets sufficient power (5V, 2A)
- ✅ Test relay with manual digitalWrite
- ✅ Check relay module is working (LED indicators)

### General Tips

1. **Always check Serial Monitor** - it shows all errors and status
2. **Firebase Rules** - Start with test mode, secure later
3. **Power Supply** - Relays need good power, USB may not be enough
4. **Delays** - Give ESP32 time to initialize (2-3 seconds)
5. **Restart** - When in doubt, restart ESP32 and refresh dashboard

---

## Next Steps

✨ **Enhancements to Try:**
- Add more devices (lights, curtains, locks)
- Implement scheduling (turn on at specific times)
- Add mobile app (React Native)
- Implement voice control (Google Assistant, Alexa)
- Add motion sensors for automation
- Create energy monitoring dashboard
- Set up email/SMS alerts
- Implement OTA (Over-The-Air) updates

---

## Support

If you encounter issues:
1. Check Serial Monitor output
2. Verify all connections
3. Review Firebase Console for data
4. Check browser console for errors
5. Read component READMEs for detailed info

Happy automating! 🏠✨
