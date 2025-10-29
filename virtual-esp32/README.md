# Virtual ESP32 Device Simulator

Test your dashboard **WITHOUT physical ESP32 hardware!**

This Node.js script simulates an ESP32 device connecting to Firebase, allowing you to test your React dashboard before buying hardware.

## 🎯 What This Does

✅ Connects to your Firebase Realtime Database  
✅ Listens for device control commands from dashboard  
✅ Updates sensor data (temperature/humidity) automatically  
✅ Simulates GPIO pin changes  
✅ Shows real-time logs  

---

## 📋 Prerequisites

- Node.js installed (v16+)
- Firebase project (already created)
- Dashboard running (`npm run dev` in dashboard folder)

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smart-home-automation-641fc`
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded file as `serviceAccountKey.json`
7. Move it to this directory: `virtual-esp32/serviceAccountKey.json`

### Step 2: Install Dependencies

```bash
cd virtual-esp32
npm install
```

### Step 3: Run the Virtual Device

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   Virtual ESP32 Device Simulator     ║
╚════════════════════════════════════════╝

🔧 Initializing Firebase...
✓ Firebase initialized

👂 Listening for device state changes from dashboard...

🌡️  Starting sensor updates (every 10 seconds)...

✅ Virtual ESP32 is running!
📱 Open your dashboard to control devices
```

---

## 🎮 How to Use

### 1. Start the Dashboard
```bash
cd dashboard
npm run dev
```
Open: http://localhost:3000

### 2. Start Virtual Device
```bash
cd virtual-esp32
npm start
```

### 3. Control Devices
- Open dashboard in browser
- Login with your Firebase credentials
- Click device ON/OFF buttons
- Watch the virtual device terminal for updates!

---

## 📊 What You'll See

### In Virtual Device Terminal:
```
🔄 [2:30:45 PM] Device Update:
   📱 Living Room Lamp (lamp1)
   🔌 GPIO 12: ON
   ✅ Turned ON

   💡 GPIO 12 → HIGH

📊 [2:30:55 PM] Sensor Update:
   🌡️  Temperature: 26.3°C
   💧 Humidity: 46.2%
```

### In Dashboard:
- Devices update instantly
- Sensor values refresh every 10 seconds
- All controls work as if real ESP32 is connected

---

## 🔍 Verification Steps

### Test Device Control:
1. ✅ Click "Turn ON" for lamp in dashboard
2. ✅ Virtual device terminal shows: `lamp1 → ON`
3. ✅ Dashboard shows lamp as ON
4. ✅ Click "Turn OFF"
5. ✅ Terminal shows: `lamp1 → OFF`

### Test Sensors:
1. ✅ Wait 10 seconds
2. ✅ Terminal shows sensor update
3. ✅ Dashboard shows new temperature/humidity
4. ✅ Values change slightly each update

---

## 🛠️ Configuration

### Change Sensor Update Interval
Edit `virtual-device.js`, line ~90:
```javascript
}, 10000);  // Change to 5000 for 5 seconds
```

### Change Temperature Range
Edit `virtual-device.js`, line ~70:
```javascript
temperature = 26.0 + (Math.random() * 4 - 2); // 24-28°C
// Change to: 20.0 + (Math.random() * 10 - 5) for 15-25°C
```

### Add More Devices
Edit `virtual-device.js`, line ~20:
```javascript
const devices = {
  lamp1: { name: "Living Room Lamp", pin: 12, status: "off" },
  fan1: { name: "Bedroom Fan", pin: 13, status: "off" },
  ac1: { name: "Air Conditioner", pin: 14, status: "off" },
  // Add new device:
  lamp2: { name: "Kitchen Lamp", pin: 15, status: "off" }
};
```

---

## 📁 File Structure

```
virtual-esp32/
├── virtual-device.js         # Main simulator script
├── package.json             # Dependencies
├── serviceAccountKey.json   # Firebase credentials (YOU ADD THIS)
└── README.md               # This file
```

---

## 🐛 Troubleshooting

### ❌ Error: Cannot find module 'firebase-admin'
**Solution:**
```bash
npm install
```

### ❌ Error: serviceAccountKey.json not found
**Solution:**
1. Download from Firebase Console (see Step 1 above)
2. Place in `virtual-esp32/` directory
3. File must be named exactly: `serviceAccountKey.json`

### ❌ Error: Permission denied
**Solution:**
1. Check Firebase Database Rules allow read/write
2. Go to Firebase Console → Realtime Database → Rules
3. Set to (for testing):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### ❌ Dashboard doesn't update
**Solution:**
1. Check virtual device is running (no errors)
2. Check dashboard is running (http://localhost:3000)
3. Check you're logged in to dashboard
4. Hard refresh browser (Ctrl+Shift+R)

---

## 🔄 Workflow

```
Dashboard (Browser)
      ↕ Firebase
Virtual ESP32 (Node.js)

1. User clicks "Turn ON" in dashboard
2. Dashboard updates Firebase: devices/lamp1/status = "on"
3. Virtual device detects change
4. Virtual device logs: "lamp1 → ON"
5. Dashboard shows updated state
```

---

## 🚀 Next Steps

### After Testing with Virtual Device:
1. ✅ Verify dashboard controls work
2. ✅ Test all device types
3. ✅ Check sensor updates
4. ➡️ Buy physical ESP32
5. ➡️ Upload `smart-home.ino` to real ESP32
6. ➡️ Stop virtual device
7. ➡️ Real ESP32 takes over automatically!

---

## 💡 Tips

- **Multiple Terminals**: Run dashboard in one terminal, virtual device in another
- **Auto-restart**: Use `npm run dev` instead of `npm start` (uses nodemon)
- **View Logs**: Terminal output shows all Firebase interactions
- **Test Offline**: Stop virtual device to see dashboard's offline behavior

---

## 🆚 Virtual Device vs Real ESP32

| Feature | Virtual Device | Real ESP32 |
|---------|---------------|------------|
| **Setup** | 5 minutes | 30 minutes + hardware |
| **Cost** | Free | $30-45 |
| **Firebase** | ✅ Yes | ✅ Yes |
| **Dashboard** | ✅ Yes | ✅ Yes |
| **GPIO** | 🔶 Simulated | ✅ Real pins |
| **WiFi** | N/A | ✅ Real WiFi |
| **Sensors** | 🔶 Simulated | ✅ Real DHT22 |
| **Relays** | 🔶 Simulated | ✅ Real devices |

---

## 📞 Support

**Issues?**
- Check Firebase credentials are correct
- Verify Node.js version: `node --version` (need v16+)
- Check Firebase Database Rules allow access
- See main `TROUBLESHOOTING.md`

---

## ✅ Success Checklist

Before moving to real hardware:
- [ ] Virtual device starts without errors
- [ ] Dashboard shows all devices
- [ ] Can turn devices ON/OFF from dashboard
- [ ] Virtual device logs show state changes
- [ ] Sensor values update every 10 seconds
- [ ] Dashboard reflects sensor changes
- [ ] Understand the workflow

---

**You're ready!** Once this works perfectly, switching to real ESP32 hardware will be seamless! 🎉
