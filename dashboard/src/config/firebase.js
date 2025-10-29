import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDazCMd33qFOCNqLMAKVoVd3ihr5PZXeFs",
  authDomain: "smart-home-automation-641fc.firebaseapp.com",
  databaseURL: "https://smart-home-automation-641fc-default-rtdb.firebaseio.com",
  projectId: "smart-home-automation-641fc",
  storageBucket: "smart-home-automation-641fc.appspot.com",
  messagingSenderId: "991060932691",
  appId: "1:991060932691:web:81a373ca432c376abfeea6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getDatabase(app);
export const auth = getAuth(app);

export default app;
