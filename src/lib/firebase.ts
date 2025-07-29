// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADY1XkaRqDI1a0X52Dw5rgzxAPovOolKY",
  authDomain: "rakshak-kuqpv.firebaseapp.com",
  projectId: "rakshak-kuqpv",
  storageBucket: "rakshak-kuqpv.appspot.com",
  messagingSenderId: "143976412649",
  appId: "1:143976412649:web:677d671d54087cde708778"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
