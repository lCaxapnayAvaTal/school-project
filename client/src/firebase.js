// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(import.meta.env.FIREBASE_API_KEY);
const firebaseConfig = {
    apiKey: "AIzaSyDUxZm4XchP_1dey7adwbXB4Kl9FYlm3rA",
    authDomain: "diplom-d87f8.firebaseapp.com",
    projectId: "diplom-d87f8",
    storageBucket: "diplom-d87f8.appspot.com",
    messagingSenderId: "496831509174",
    appId: "1:496831509174:web:e5a84edd0fff290ab26c17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);