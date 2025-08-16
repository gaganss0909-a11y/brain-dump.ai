// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "braindumpio",
  "appId": "1:269555493583:web:eb781cfba54c8303b5a5ba",
  "storageBucket": "braindumpio.firebasestorage.app",
  "apiKey": "AIzaSyCzpWRbzJ7jIB3GtMrXpPT3-vUJKT3EX8M",
  "authDomain": "braindumpio.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "269555493583"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
