// src/firebase/client.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDIuH-1JYs7EX8Jd8mN1it4Tdo9XgbKPuo",
  authDomain: "lead-management-3c2d2.firebaseapp.com",
  projectId: "lead-management-3c2d2",
  storageBucket: "lead-management-3c2d2.firebasestorage.app",
  messagingSenderId: "7369187211",
  appId: "1:7369187211:web:5abc501a4be09aecd6998e",
  measurementId: "G-VX3EZES3V4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log("🔥 Firebase app initialized:", app.name);

let messaging: Messaging | null = null;

// Export a function that returns a Promise of messaging instance if supported
export async function getFirebaseMessaging() {
  console.log("🔥 getFirebaseMessaging called");
  
  if (messaging) {
    console.log("🔥 Returning existing messaging instance");
    return messaging;
  }

  if (typeof window === 'undefined') {
    console.log("🔥 Window is undefined (server-side), returning null");
    return null;
  }

  console.log("🔥 Checking if Firebase Messaging is supported...");
  const supported = await isSupported();
  console.log("🔥 Firebase Messaging supported:", supported);
  
  if (!supported) return null;

  console.log("🔥 Initializing Firebase Messaging...");
  messaging = getMessaging(app);
  console.log("🔥 Firebase Messaging initialized successfully");
  return messaging;
}

export { app };
