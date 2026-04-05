import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBKOcOK-9K6it6rxKYRfikkuv62f1OVtXQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mahek-saree.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mahek-saree",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mahek-saree.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "627435528343",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:627435528343:web:bc3e467282f63443da09d2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
