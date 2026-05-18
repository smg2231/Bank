// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb-eq3pTv_TZ7jPPckm3waqbmnBP69OqE",
  authDomain: "js-bank-bbsg.firebaseapp.com",
  projectId: "js-bank-bbsg",
  storageBucket: "js-bank-bbsg.firebasestorage.app",
  messagingSenderId: "249209057557",
  appId: "1:249209057557:web:27c81bfb4c567c816bf91c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get Firestore database reference
export const db = getFirestore(app);
// Get Auth reference
export const auth = getAuth(app);