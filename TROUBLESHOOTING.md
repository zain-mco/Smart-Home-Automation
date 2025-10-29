# Troubleshooting Guide

Quick solutions to common problems.

## 🔍 Diagnostic Checklist

Before troubleshooting, verify:
- [ ] Node.js and npm are installed
- [ ] Firebase project is created and configured
- [ ] WiFi credentials are correct in ESP32 code
- [ ] ESP32 is powered and connected
- [ ] All hardware connections are secure
- [ ] Browser is updated to latest version

---

## Dashboard Issues

### ❌ Dashboard won't start / npm install fails

**Symptoms:**
```
npm ERR! code ENOENT
```

**Solutions:**
1. Ensure you're in the `dashboard` directory:
   ```bash
   cd dashboard
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version (needs v18+):
   ```bash
   node --version
   ```

4. Try with npm cache cleared:
   ```bash
   npm cache clean --force
   npm install
   ```

---

### ❌ Firebase connection error

**Symptoms:**
- Dashboard loads but shows no devices
- Console error: "Firebase: Error (auth/...)"
- "Permission denied" errors

**Solutions:**

1. **Check Firebase config:**
   ```javascript
   // src/config/firebase.js
   const firebaseConfig = {
     apiKey: "...",  // Must not be empty
     databaseURL: "https://your-project.firebaseio.com"  // Check URL
   };
   ```

2. **Verify database rules:**
   ```json
   {
     "rules": {
       ".read": true,   // For testing
       ".write": true
     }
   }
   ```

3. **Check Firebase services are enabled:**
   - Firebase Console → Realtime Database → Enabled ✓
   - Firebase Console → Authentication → Email/Password enabled ✓

4. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear cache
   - Firefox: Ctrl+Shift+Delete → Clear cache

---

### ❌ Can't login to dashboard

**Symptoms:**
- "Wrong email or password" error
- Login button does nothing
- Redirected back to login page

**Solutions:**

1. **Verify user exists:**
   - Firebase Console → Authentication → Users tab
   - Ensure user `demo@smarthome.com` exists

2. **Create new user:**
   - Firebase Console → Authentication → Add User
   - Email: `demo@smarthome.com`
   - Password: `demo123` (or your choice)

3. **Check Authentication is enabled:**
   - Firebase Console → Authentication → Sign-in method
   - Email/Password should show "Enabled"

4. **Try in incognito/private mode:**
   - May be browser extension blocking

5. **Check browser console:**
   - F12 → Console tab
   - Look for Firebase Auth errors

---

### ❌ Devices not showing up

**Symptoms:**
- Dashboard shows "No devices found"
- Empty device list

**Solutions:**

1. **Add devices to Firebase:**
   ```json
   {
     "devices": {
       "lamp1": {
         "name": "Living Room Lamp",
         "status": "off"
       }
     }
   }
   ```

2. **Check database path:**
   - Should be at root level: `/devices`
   - Not nested inside other nodes

3. **Verify database rules:**
   - Must allow read access

4. **Refresh dashboard:**
   - Hard refresh: Ctrl+Shift+R

---

### ❌ Device buttons don't work

**Symptoms:**
- Clicking "Turn ON" does nothing
- Status doesn't change
- No error messages

**Solutions:**

1. **Check write permissions:**
   ```json
   {
     "rules": {
       ".write": true  // Or "auth != null"
     }
   }
   ```

2. **Check browser console:**
   - F12 → Console
   - Look for Firebase write errors

3. **Verify you're logged in:**
   - Should see user email in header

4. **Test Firebase directly:**
   - Firebase Console → Realtime Database
   - Manually change status to "on"
   - Should update in dashboard

---

## ESP32 Issues

### ❌ ESP32 won't connect to WiFi

**Symptoms:**
```
Connecting to WiFi: .....................
WiFi Connection Failed!
```

**Solutions:**

1. **Verify WiFi credentials:**
   ```cpp
   const char* ssid = "YourWiFi";      // Exact name
   const char* password = "password";   // Exact password
   ```

2. **Check WiFi frequency:**
   - ESP32 only supports **2.4GHz**
   - Not compatible with 5GHz networks
   - Check router settings

3. **Check WiFi signal:**
   - Move ESP32 closer to router
   - Ensure no interference
   - Try line of sight

4. **Try different network:**
   - Mobile hotspot (2.4GHz)
   - Different WiFi network

5. **Check Serial Monitor settings:**
   - Baud rate: 115200
   - Should see connection attempts

6. **Restart ESP32:**
   - Unplug and replug USB
   - Press reset button

---

### ❌ ESP32 uploads fail

**Symptoms:**
```
Failed to connect to ESP32
A fatal error occurred
```

**Solutions:**

1. **Check USB connection:**
   - Try different USB cable
   - Try different USB port
   - Ensure cable supports data (not just power)

2. **Select correct port:**
   - Tools → Port → COM3 (or your port)
   - Port should appear when ESP32 connected

3. **Hold BOOT button:**
   - Hold BOOT button on ESP32
   - Click Upload
   - Release after "Connecting..." appears

4. **Install USB drivers:**
   - CP2102: [Download](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
   - CH340: [Download](http://www.wch-ic.com/downloads/CH341SER_ZIP.html)

5. **Check board settings:**
   - Board: ESP32 Dev Module
   - Upload Speed: 115200
   - Flash Frequency: 80MHz

---

### ❌ Firebase updates not working on ESP32

**Symptoms:**
```
Firebase initialized successfully
Failed to update sensor data
```

**Solutions:**

1. **Check Firebase URL:**
   ```cpp
   const char* firebaseHost = 
     "https://your-project.firebaseio.com";  // Must match your project
   ```

2. **Check database rules:**
   - Must allow write without auth (test mode)
   - Or add Firebase secret to code

3. **Check internet connection:**
   - ESP32 connected to WiFi ✓
   - WiFi has internet access ✓

4. **Test with curl:**
   ```bash
   curl https://your-project.firebaseio.com/devices.json
   ```

5. **Check Serial Monitor:**
   - HTTP response codes
   - Error messages

---

### ❌ Sensor shows NaN (Not a Number)

**Symptoms:**
```
Reading sensors...
Temperature: nanĀ°C, Humidity: nan%
Failed to read from DHT sensor!
```

**Solutions:**

1. **Check DHT22 connections:**
   ```
   DHT22 Pin 1 (VCC)  → ESP32 5V
   DHT22 Pin 2 (Data) → ESP32 GPIO 4
   DHT22 Pin 4 (GND)  → ESP32 GND
   ```

2. **Add pull-up resistor:**
   - 10kΩ resistor between Data and VCC
   - Some DHT22 modules have built-in

3. **Wait after power-on:**
   - DHT22 needs 2 seconds to initialize
   - Add delay in setup():
   ```cpp
   delay(2000);
   ```

4. **Try different GPIO pin:**
   ```cpp
   #define DHTPIN 5  // Try GPIO 5
   ```

5. **Test DHT22 separately:**
   - Use DHT example sketch
   - File → Examples → DHT sensor library

6. **Replace sensor:**
   - DHT22 may be faulty
   - Try different sensor

---

### ❌ Relays not switching

**Symptoms:**
- No click sound from relay
- LED on relay doesn't change
- Device doesn't turn on

**Solutions:**

1. **Check relay connections:**
   ```
   Relay VCC → ESP32 5V
   Relay GND → ESP32 GND
   Relay IN  → ESP32 GPIO 12/13/14
   ```

2. **Check relay power:**
   - 5V relays need good power source
   - USB may not provide enough current
   - Use external 5V/2A adapter

3. **Test relay manually:**
   ```cpp
   void setup() {
     pinMode(12, OUTPUT);
     digitalWrite(12, HIGH);  // Should click
     delay(2000);
     digitalWrite(12, LOW);   // Should click
   }
   ```

4. **Check relay type:**
   - Active HIGH or Active LOW?
   - Try inverting signal:
   ```cpp
   digitalWrite(pin, !state);
   ```

5. **Check GPIO pin:**
   - Some pins have restrictions
   - Avoid: GPIO 0, 2, 15 (boot pins)
   - Safe: GPIO 12, 13, 14, 16, 17

6. **Verify relay is working:**
   - LED should light up
   - Should hear click sound
   - Test with multimeter

---

## Deployment Issues

### ❌ Vercel deployment fails

**Solutions:**

1. **Build locally first:**
   ```bash
   npm run build
   ```
   Fix any build errors

2. **Check vercel.json:**
   - Should be in dashboard directory
   - Check JSON syntax

3. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   ```

4. **Check build command:**
   - Should be `npm run build`
   - Output directory: `dist`

---

### ❌ Firebase deployment fails

**Solutions:**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

3. **Check firebase.json:**
   - Public directory: `dashboard/dist`
   - Build first: `npm run build`

---

## Performance Issues

### ❌ Dashboard is slow

**Solutions:**

1. **Check network:**
   - Firebase console → Realtime Database → Connection
   - Test internet speed

2. **Reduce data size:**
   - Remove old logs
   - Limit sensor history

3. **Optimize images:**
   - Compress images
   - Use appropriate formats

4. **Check browser:**
   - Close other tabs
   - Clear cache
   - Try different browser

---

### ❌ ESP32 is slow to respond

**Solutions:**

1. **Reduce polling interval:**
   ```cpp
   const unsigned long DEVICE_CHECK_INTERVAL = 1000;  // Faster
   ```

2. **Check WiFi signal:**
   - Move closer to router
   - Reduce interference

3. **Optimize code:**
   - Remove unnecessary Serial.print()
   - Reduce delays

---

## Still Stuck?

### Debugging Steps

1. **Check Serial Monitor (ESP32):**
   - Enable Serial.print() everywhere
   - Note HTTP response codes
   - Log all variables

2. **Check Browser Console (Dashboard):**
   - F12 → Console
   - Look for red errors
   - Check Network tab

3. **Check Firebase Console:**
   - Manually test read/write
   - Check current data
   - Review security rules

4. **Test Each Component:**
   - Dashboard alone (without ESP32)
   - ESP32 alone (check Serial output)
   - Firebase directly (web interface)

### Get Help

1. **Check documentation:**
   - README.md
   - SETUP_GUIDE.md
   - FAQ.md

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow
   - Arduino forums

3. **Create detailed issue:**
   - Describe problem clearly
   - Include error messages
   - Share relevant code
   - Mention what you've tried

---

## Diagnostic Commands

```bash
# Check Node.js
node --version
npm --version

# Check Firebase CLI
firebase --version

# Test Firebase connection
curl https://your-project.firebaseio.com/.json

# Check ESP32 port (Windows)
mode

# Check ESP32 port (Mac/Linux)
ls /dev/tty.*

# Build dashboard
cd dashboard
npm run build

# Check for errors
npm run lint
```

---

**Remember:** Most issues are configuration-related. Double-check all settings! 🔧
