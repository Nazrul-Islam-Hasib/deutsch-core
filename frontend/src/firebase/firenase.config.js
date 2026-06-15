// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAI0AU-Y_KL2OtJ-vAJZA6ZKQQqjwxqB2E",
    authDomain: "deutsch-core.firebaseapp.com",
    projectId: "deutsch-core",
    storageBucket: "deutsch-core.firebasestorage.app",
    messagingSenderId: "528973957073",
    appId: "1:528973957073:web:40891275fb3de6061382f0",
    measurementId: "G-EL2B0W73CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;