/*
 * Virtual ESP32 Device Simulator
 * This simulates an ESP32 connecting to Firebase
 * Use this to test your dashboard WITHOUT physical hardware
 * 
 * Requirements: Node.js, Firebase Admin SDK
 * 
 * Setup:
 * 1. npm install
 * 2. Add your Firebase credentials
 * 3. node virtual-device.js
 */

const admin = require('firebase-admin');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Try to import open, but don't fail if it's not available
let open = null;
try {
  open = require('open');
} catch (e) {
  // open package not available, will open manually
}

// ===== CONFIGURATION =====
// TODO: Download your Firebase service account key from:
// Firebase Console → Project Settings → Service Accounts → Generate New Private Key
// Save as 'serviceAccountKey.json' in this directory

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-home-automation-641fc-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ===== VIRTUAL DEVICE CONFIGURATION =====
const devices = {
  lamp1: { name: "Living Room Lamp", pin: 12, status: "off" },
  fan1: { name: "Bedroom Fan", pin: 13, status: "off" },
  ac1: { name: "Air Conditioner", pin: 14, status: "off" }
};

// Simulated sensor values
let temperature = 26.0;
let humidity = 45.0;

// WebSocket server
let wss = null;
const WS_PORT = 8765;
const HTTP_PORT = 8080;

console.log("\n╔════════════════════════════════════════╗");
console.log("║   Virtual ESP32 Device Simulator     ║");
console.log("╚════════════════════════════════════════╝\n");

// ===== INITIALIZE FIREBASE DATA =====
async function initializeFirebase() {
  console.log("🔧 Initializing Firebase...");

  // Set initial device states
  const devicesRef = db.ref('devices');
  await devicesRef.set({
    lamp1: { name: "Living Room Lamp", status: "off" },
    fan1: { name: "Bedroom Fan", status: "off" },
    ac1: { name: "Air Conditioner", status: "off", temperature: 24 }
  });

  // Set initial sensor data
  const sensorsRef = db.ref('sensors');
  await sensorsRef.set({
    temperature: temperature,
    humidity: humidity,
    lastUpdate: Date.now()
  });

  console.log("✓ Firebase initialized\n");

  // Broadcast to web clients
  broadcastToWeb({ type: 'init', devices });
}

// ===== LISTEN FOR DEVICE CHANGES =====
function listenForDeviceChanges() {
  console.log("👂 Listening for device state changes from dashboard...\n");

  Object.keys(devices).forEach(deviceId => {
    const deviceRef = db.ref(`devices/${deviceId}/status`);

    deviceRef.on('value', (snapshot) => {
      const newStatus = snapshot.val();

      if (newStatus !== null && newStatus !== devices[deviceId].status) {
        devices[deviceId].status = newStatus;

        console.log(`🔄 [${new Date().toLocaleTimeString()}] Device Update:`);
        console.log(`   📱 ${devices[deviceId].name} (${deviceId})`);
        console.log(`   🔌 GPIO ${devices[deviceId].pin}: ${newStatus.toUpperCase()}`);
        console.log(`   ${newStatus === 'on' ? '✅ Turned ON' : '⭕ Turned OFF'}\n`);

        // Simulate physical GPIO change
        simulateGPIOChange(deviceId, newStatus);

        // Broadcast to web clients
        broadcastToWeb({
          type: 'deviceUpdate',
          deviceId,
          status: newStatus
        });

        broadcastToWeb({
          type: 'log',
          level: 'device',
          message: `${devices[deviceId].name} turned ${newStatus}`,
          details: {
            name: devices[deviceId].name,
            status: newStatus,
            pin: devices[deviceId].pin
          }
        });
      }
    });
  });
}

// ===== SIMULATE GPIO CHANGES =====
function simulateGPIOChange(deviceId, status) {
  // In real ESP32, this would be: digitalWrite(pin, status === 'on' ? HIGH : LOW)
  // Here we just log it
  const emoji = deviceId === 'lamp1' ? '💡' : deviceId === 'fan1' ? '🌀' : '❄️';
  console.log(`   ${emoji} GPIO ${devices[deviceId].pin} → ${status === 'on' ? 'HIGH' : 'LOW'}`);
}

// ===== UPDATE SENSOR DATA PERIODICALLY =====
function startSensorUpdates() {
  console.log("🌡️  Starting sensor updates (every 10 seconds)...\n");

  setInterval(async () => {
    // Simulate slight variations
    temperature = 26.0 + (Math.random() * 4 - 2); // 24-28°C
    humidity = 45.0 + (Math.random() * 10 - 5);    // 40-50%

    const sensorsRef = db.ref('sensors');
    await sensorsRef.update({
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      lastUpdate: Date.now()
    });

    console.log(`📊 [${new Date().toLocaleTimeString()}] Sensor Update:`);
    console.log(`   🌡️  Temperature: ${temperature.toFixed(1)}°C`);
    console.log(`   💧 Humidity: ${humidity.toFixed(1)}%\n`);

    // Broadcast to web clients
    broadcastToWeb({
      type: 'sensorUpdate',
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1))
    });

    broadcastToWeb({
      type: 'log',
      level: 'sensor',
      message: `Temp: ${temperature.toFixed(1)}°C, Humidity: ${humidity.toFixed(1)}%`
    });
  }, 10000);
}

// ===== SHOW STATUS =====
function showStatus() {
  console.log("\n═══════════════════════════════════════");
  console.log("📊 SYSTEM STATUS");
  console.log("═══════════════════════════════════════");
  console.log("🔌 Virtual Devices:");
  Object.keys(devices).forEach(id => {
    const device = devices[id];
    const emoji = id === 'lamp1' ? '💡' : id === 'fan1' ? '🌀' : '❄️';
    console.log(`   ${emoji} ${device.name}: ${device.status.toUpperCase()}`);
  });
  console.log("\n🌡️  Sensors:");
  console.log(`   Temperature: ${temperature.toFixed(1)}°C`);
  console.log(`   Humidity: ${humidity.toFixed(1)}%`);
  console.log("═══════════════════════════════════════\n");
}

// ===== WEB INTERFACE =====
function startWebServer() {
  // Create HTTP server for serving the HTML file
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      const htmlPath = path.join(__dirname, 'web-interface.html');
      fs.readFile(htmlPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading web interface');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(HTTP_PORT, () => {
    console.log(`🌐 Web interface: http://localhost:${HTTP_PORT}`);
  });

  // Create WebSocket server
  wss = new WebSocket.Server({ port: WS_PORT });

  wss.on('connection', (ws) => {
    console.log('🔌 Web client connected');

    // Send initial state
    ws.send(JSON.stringify({ type: 'init', devices }));

    ws.on('close', () => {
      console.log('🔌 Web client disconnected');
    });
  });

  console.log(`🔌 WebSocket server: ws://localhost:${WS_PORT}`);
}

function broadcastToWeb(data) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ===== MAIN =====
async function main() {
  try {
    await initializeFirebase();
    listenForDeviceChanges();
    startSensorUpdates();

    // Show status every 30 seconds
    setInterval(showStatus, 30000);
    showStatus();

    // Start web interface
    startWebServer();

    console.log("✅ Virtual ESP32 is running!");
    console.log("📱 Open your dashboard to control devices");
    console.log(`🌐 Web monitor: http://localhost:${HTTP_PORT}`);
    console.log("Press Ctrl+C to stop\n");

    // Auto-open browser if available
    if (open) {
      setTimeout(async () => {
        try {
          await open(`http://localhost:${HTTP_PORT}`);
          console.log("✅ Browser opened automatically!\n");
        } catch (e) {
          console.log("ℹ️  Please manually open: http://localhost:8080\n");
        }
      }, 1000);
    } else {
      console.log("ℹ️  Please manually open: http://localhost:8080\n");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Make sure you have:");
    console.log("   1. Downloaded serviceAccountKey.json from Firebase");
    console.log("   2. Placed it in the virtual-esp32 directory");
    console.log("   3. Run 'npm install' first\n");
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\n\n👋 Shutting down virtual device...");
  process.exit(0);
});

main();
