// Shared Firebase configuration for API routes
const admin = require('firebase-admin');

let db = null;

function loadServiceAccountFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n')
    };
  }
  return null;
}

function initializeFirebase() {
  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccountFromEnv();
    if (!serviceAccount) {
      throw new Error('Firebase service account credentials are missing. Please set FIREBASE_SERVICE_ACCOUNT environment variable.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://smart-home-automation-641fc-default-rtdb.firebaseio.com"
    });
    
    db = admin.database();
  }
  return admin.database();
}

module.exports = { initializeFirebase };
