// lib/firebaseClient.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIuH-1JYs7EX8Jd8mN1it4Tdo9XgbKPuo",
  authDomain: "lead-management-3c2d2.firebaseapp.com",
  projectId: "lead-management-3c2d2",
  storageBucket: "lead-management-3c2d2.firebasestorage.app",
  messagingSenderId: "7369187211",
  appId: "1:7369187211:web:5abc501a4be09aecd6998e",
  measurementId: "G-VX3EZES3V4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();