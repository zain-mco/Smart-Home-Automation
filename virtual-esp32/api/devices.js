// API route for device control
const { initializeFirebase } = require('./firebase-config');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = initializeFirebase();
    
    if (req.method === 'GET') {
      // Get all devices
      const devicesRef = db.ref('devices');
      const snapshot = await devicesRef.once('value');
      const devices = snapshot.val() || {};
      
      return res.status(200).json({ 
        success: true, 
        devices 
      });
    }
    
    if (req.method === 'POST' || req.method === 'PUT') {
      // Update device status
      const { deviceId, status } = req.body;
      
      if (!deviceId || !status) {
        return res.status(400).json({ 
          success: false, 
          error: 'deviceId and status are required' 
        });
      }
      
      const deviceRef = db.ref(`devices/${deviceId}/status`);
      await deviceRef.set(status);
      
      return res.status(200).json({ 
        success: true, 
        message: `Device ${deviceId} set to ${status}`,
        deviceId,
        status
      });
    }
    
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
    
  } catch (error) {
    console.error('Error in devices API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
