// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfK0mMoqGmqcnwNG_f66tKtfn2LwNm-vc",
  authDomain: "mfa-project-927f9.firebaseapp.com",
  projectId: "mfa-project-927f9",
  storageBucket: "mfa-project-927f9.firebasestorage.app",
  messagingSenderId: "663825431763",
  appId: "1:663825431763:web:5e8d89997930e6e5476826",
  measurementId: "G-EBPWT4PCT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);