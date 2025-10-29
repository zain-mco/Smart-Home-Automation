# Quick Start Guide

Get your Smart Home system running in **15 minutes**! ⚡

## Prerequisites Checklist

- [ ] Node.js installed (v18+)
- [ ] Firebase account created
- [ ] ESP32 board and USB cable
- [ ] Arduino IDE installed

## 5-Step Setup

### Step 1: Firebase Setup (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project: `Smart Home Automation`
3. Enable **Realtime Database** (test mode)
4. Enable **Authentication** → Email/Password
5. Add user: `demo@smarthome.com` / `demo123`
6. Copy your Firebase config

### Step 2: Dashboard Setup (3 min)

```bash
cd dashboard
npm install
```

Edit `src/config/firebase.js` - paste your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  // ... rest of config
};
```

Start dashboard:
```bash
npm run dev
```

Open: http://localhost:3000

### Step 3: Initialize Firebase Data (1 min)

In Firebase Console → Realtime Database, add this JSON:

```json
{
  "devices": {
    "lamp1": { "name": "Living Room Lamp", "status": "off" },
    "fan1": { "name": "Bedroom Fan", "status": "off" },
    "ac1": { "name": "Air Conditioner", "status": "off" }
  },
  "sensors": {
    "temperature": 0,
    "humidity": 0
  }
}
```

### Step 4: Hardware Setup (3 min)

**Connections:**
```
ESP32 Pin → Component
-----------------------
GPIO 4    → DHT22 Data
GPIO 12   → Relay 1
GPIO 13   → Relay 2
GPIO 14   → Relay 3
5V        → All VCC
GND       → All GND
```

### Step 5: ESP32 Upload (3 min)

1. Open `esp32-firmware/smart-home.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "Your_WiFi_Name";
   const char* password = "Your_WiFi_Password";
   ```
3. Select: **Tools → Board → ESP32 Dev Module**
4. Select: **Tools → Port → (your COM port)**
5. Click **Upload** ➜

## Verify It Works

### ✅ Dashboard Test
1. Open http://localhost:3000
2. Login with `demo@smarthome.com` / `demo123`
3. You should see your devices!

### ✅ ESP32 Test
1. Open **Tools → Serial Monitor** (115200 baud)
2. Should see:
   ```
   WiFi Connected!
   IP Address: 192.168.x.x
   ```

### ✅ Device Control Test
1. Click "Turn ON" on any device in dashboard
2. Check Serial Monitor - should show:
   ```
   Device lamp1 updated to: on
   ```
3. Relay should click!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Dashboard won't start | Run `npm install` again |
| Can't login | Check user exists in Firebase Auth |
| ESP32 won't connect | Check WiFi SSID/password, use 2.4GHz |
| Devices not updating | Check Firebase database rules |
| Relay not working | Check GPIO connections, verify 5V power |

## Next Steps

- 📖 Read full [SETUP_GUIDE.md](SETUP_GUIDE.md) for details
- 🎨 Customize the dashboard UI
- 🔧 Add more devices
- 🚀 Deploy to Vercel: `vercel --prod`

## Common Commands

```bash
# Dashboard
cd dashboard
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview build

# Deployment
vercel --prod        # Deploy to Vercel
firebase deploy      # Deploy to Firebase
```

## Support

- 📖 Documentation: See README.md
- ❓ Questions: Check FAQ.md
- 🐛 Issues: Read troubleshooting section
- 💬 Community: GitHub Discussions

---

**That's it!** Your smart home is now live! 🎉🏠

Test by clicking device buttons in the dashboard and watch the magic happen! ✨
