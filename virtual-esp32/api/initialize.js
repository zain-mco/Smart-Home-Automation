// API route to initialize Firebase data
const path = require('path');
const { initializeFirebase } = require(path.join(__dirname, 'firebase-config'));

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const db = initializeFirebase();
    
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
      temperature: 26.0,
      humidity: 45.0,
      lastUpdate: Date.now()
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Firebase initialized successfully',
      devices: {
        lamp1: { name: "Living Room Lamp", status: "off" },
        fan1: { name: "Bedroom Fan", status: "off" },
        ac1: { name: "Air Conditioner", status: "off", temperature: 24 }
      },
      sensors: {
        temperature: 26.0,
        humidity: 45.0,
        lastUpdate: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
