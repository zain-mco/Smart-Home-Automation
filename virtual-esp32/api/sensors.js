// API route for sensor data
const { initializeFirebase } = require('./firebase-config');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = initializeFirebase();
    
    if (req.method === 'GET') {
      // Get sensor data
      const sensorsRef = db.ref('sensors');
      const snapshot = await sensorsRef.once('value');
      const sensors = snapshot.val() || {};
      
      return res.status(200).json({ 
        success: true, 
        sensors 
      });
    }
    
    if (req.method === 'POST') {
      // Update sensor data (simulate sensor readings)
      const temperature = 26.0 + (Math.random() * 4 - 2); // 24-28°C
      const humidity = 45.0 + (Math.random() * 10 - 5);    // 40-50%
      
      const sensorsRef = db.ref('sensors');
      await sensorsRef.update({
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1)),
        lastUpdate: Date.now()
      });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Sensor data updated',
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1))
      });
    }
    
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
    
  } catch (error) {
    console.error('Error in sensors API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
