// Example Firebase configuration
// Copy this file to firebase.js and replace with your actual credentials

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "smart-home-automation-641fc.firebaseapp.com",
  databaseURL: "https://smart-home-automation-641fc-default-rtdb.firebaseio.com",
  projectId: "smart-home-automation-641fc",
  storageBucket: "smart-home-automation-641fc.appspot.com",
  messagingSenderId: "991060932691",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
