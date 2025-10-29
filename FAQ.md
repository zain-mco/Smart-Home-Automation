# Frequently Asked Questions (FAQ)

## General Questions

### What is this project?
A complete IoT-based smart home automation system that lets you control home appliances remotely using ESP32 microcontroller and a web dashboard built with React.js and Firebase.

### What can I control?
Any appliance that can be connected to a relay module - lights, fans, air conditioners, heaters, coffee makers, etc. The system also monitors environmental sensors like temperature and humidity.

### Is this safe to use with AC appliances?
⚠️ **Working with AC power can be dangerous.** If you're not experienced with electrical work, start with DC appliances (12V lights, fans) or consult an electrician. Always follow local electrical codes.

### How much does it cost?
- **Hardware**: $30-45 (ESP32, relays, sensors, wires)
- **Software**: Free (Firebase Spark plan, Vercel hobby plan)
- **Operating**: <$1/month (electricity)

---

## Setup Questions

### Do I need a Firebase account?
Yes, Firebase provides the cloud database and authentication. The free "Spark" plan is sufficient for personal use.

### Do I need coding experience?
Basic coding knowledge helps, but the provided code is ready to use. You mainly need to:
1. Update WiFi credentials
2. Configure Firebase settings
3. Upload code to ESP32

### Can I use a different microcontroller?
The code is written for ESP32, but can be adapted for:
- ESP8266 (similar WiFi board)
- Arduino with WiFi shield
- Raspberry Pi

ESP32 is recommended for its built-in WiFi and affordability.

### What WiFi do I need?
- **2.4GHz WiFi** (ESP32 doesn't support 5GHz)
- Stable internet connection
- Access to router settings (for troubleshooting)

---

## Technical Questions

### How fast is the response time?
- **Device control**: <1 second from button click to relay activation
- **Sensor updates**: Every 10 seconds (configurable)
- **Dashboard refresh**: Real-time via WebSocket

### How many devices can I add?
- **Recommended**: 3-10 devices per ESP32
- **Maximum**: Limited by available GPIO pins (~18 usable pins)
- **Multiple ESP32s**: Can be used for more devices

### Can I control devices without internet?
Not with the current architecture. The system requires internet for Firebase communication. Future versions could add local WiFi control.

### Is the data secure?
- Dashboard requires authentication (Firebase Auth)
- HTTPS encryption for all communications
- Firebase security rules control access
- **For production**: Enable Firebase Authentication rules

### What happens if WiFi disconnects?
- ESP32 attempts to reconnect automatically
- Devices maintain their last known state
- Dashboard shows "offline" status
- No data is lost (stored in Firebase)

---

## Hardware Questions

### What ESP32 board should I buy?
Any ESP32 development board works:
- ESP32-DevKitC (recommended)
- ESP32-WROOM-32
- ESP32-NodeMCU
- Look for: USB port, 30+ pins, built-in WiFi

### What relays do I need?
- **Voltage**: 5V (powered by ESP32)
- **Type**: Optically isolated (safer)
- **Channels**: 1-channel per device (or multi-channel modules)
- **Current rating**: Match your appliance (usually 10A is sufficient)

### Do I need a DHT22 sensor?
No, it's optional. You can:
- Use DHT22 for temperature/humidity
- Use other sensors (motion, light, gas)
- Skip sensors and only control devices

### Can I power ESP32 from USB?
- **Yes** for development and light loads
- **No** for multiple relays (insufficient current)
- **Solution**: Use 5V/2A power adapter for relays

---

## Dashboard Questions

### Can I access the dashboard from anywhere?
Yes! Once deployed to Vercel or Firebase Hosting, you can access it from:
- Any web browser
- Desktop, tablet, mobile
- Anywhere with internet

### Does it work on mobile?
Yes! The dashboard is fully responsive and works on:
- iOS (Safari, Chrome)
- Android (Chrome, Firefox)
- Tablets
- Desktop browsers

### Can multiple users access it?
Yes! Add users in Firebase Authentication:
1. Go to Firebase Console → Authentication
2. Add user with email/password
3. All users can log in and control devices

### Can I customize the interface?
Absolutely! The code is open and modular:
- Change colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add new features easily

---

## Troubleshooting

### ESP32 won't connect to WiFi
1. Check SSID and password are correct
2. Ensure 2.4GHz network (not 5GHz)
3. Move ESP32 closer to router
4. Check Serial Monitor for error messages
5. Restart ESP32 and router

### Dashboard shows "No devices"
1. Check Firebase Realtime Database has device data
2. Verify Firebase config in `firebase.js`
3. Check database security rules
4. Open browser console for errors
5. Ensure you're logged in

### Can't login to dashboard
1. Verify user exists in Firebase Authentication
2. Check email/password are correct
3. Clear browser cache and cookies
4. Check Firebase Auth is enabled
5. Try creating a new user

### Relays not switching
1. Check GPIO pin connections
2. Verify relay gets 5V power
3. Test relay with manual HIGH/LOW
4. Check relay LED indicators
5. Verify relay module is functional

### Sensor shows NaN (Not a Number)
1. Check DHT22 connections (Data, VCC, GND)
2. Wait 2 seconds after power-on
3. Try different GPIO pin
4. Test sensor with example code
5. Replace sensor if faulty

---

## Advanced Questions

### Can I add voice control?
Yes! Integration possible with:
- Google Assistant (via IFTTT or Actions)
- Amazon Alexa (via skills)
- Apple HomeKit (requires additional setup)

### Can I schedule device on/off?
Not built-in, but can be added:
- Firebase Cloud Functions (scheduled tasks)
- ESP32 built-in timer
- Dashboard scheduling UI

### Can I add automation rules?
Yes! Examples:
- Turn on lights when motion detected
- Turn on AC when temperature > 30°C
- Turn off devices at specific time

Implement in:
- ESP32 firmware (local rules)
- Firebase Functions (cloud rules)

### Can I monitor energy usage?
With additional hardware:
- Current sensor (ACS712)
- Power meter (PZEM-004T)
- Code modifications needed

### Can I use MQTT instead of HTTP?
Yes! MQTT is more efficient:
- Lower latency
- Reduced bandwidth
- Requires MQTT broker setup
- Code modifications needed

---

## Deployment Questions

### Should I use Vercel or Firebase Hosting?
Both work great:

**Vercel** (recommended):
- ✅ Faster builds
- ✅ Better developer experience
- ✅ Automatic deployments from Git

**Firebase Hosting**:
- ✅ All services in one place
- ✅ Free SSL certificate
- ✅ Good for Firebase-heavy apps

### How do I update the deployed app?
```bash
# Vercel
cd dashboard
npm run build
vercel --prod

# Firebase
firebase deploy
```

### Can I use a custom domain?
Yes!
- **Vercel**: Add domain in dashboard settings
- **Firebase**: Add custom domain in Hosting settings
- Configure DNS records as instructed

---

## Cost Questions

### Is Firebase free?
Firebase Spark plan (free) includes:
- 1GB storage
- 10GB/month bandwidth
- 100 simultaneous connections
- Sufficient for personal use

Upgrade to Blaze (pay-as-you-go) if needed.

### Is Vercel free?
Vercel Hobby plan (free) includes:
- Unlimited personal projects
- 100GB bandwidth/month
- Automatic SSL
- Perfect for this project

### What's the monthly cost?
- **Free tier**: $0/month (within limits)
- **Electricity**: ~$0.50/month (ESP32)
- **Internet**: Existing connection
- **Total**: <$1/month

---

## Support

### Where can I get help?
1. Read documentation (README, SETUP_GUIDE)
2. Check Serial Monitor for ESP32 errors
3. Check browser console for dashboard errors
4. Search existing GitHub issues
5. Create new issue with details

### Can I hire someone to set this up?
This is an educational project, but you can:
- Follow step-by-step guides provided
- Join maker communities (Arduino forums, Reddit)
- Find local makers/students to help

### How do I report a bug?
Create a GitHub issue with:
- Clear description
- Steps to reproduce
- Screenshots
- Error messages
- Environment details

---

## Legal Questions

### Can I use this commercially?
Yes! MIT License allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

Please include original license.

### Do I need to credit the author?
Not required, but appreciated! You can:
- Link to original repository
- Mention in your documentation
- Star the repo on GitHub

---

**Still have questions?** 

Open an issue on GitHub or check the documentation files:
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `ARCHITECTURE.md` - Technical architecture
- `esp32-firmware/README.md` - Hardware setup

Happy automating! 🏠✨
