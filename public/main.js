// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDEUVPJjFC6-Q_HQvNyH9uvxCpYoSTBsM",
  authDomain: "xhs-house-app.firebaseapp.com",
  projectId: "xhs-house-app",
  storageBucket: "xhs-house-app.appspot.com",
  messagingSenderId: "776582590026",
  appId: "1:776582590026:web:77e7177429c171e345c0b3",
  measurementId: "G-K2X4P92BB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);