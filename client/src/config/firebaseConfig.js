import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkG7nSB7wkMFKPWSMX0WsAupX0B6mzTlg",
    authDomain: "expense-tracker-692d1.firebaseapp.com",
    projectId: "expense-tracker-692d1",
    storageBucket: "expense-tracker-692d1.firebasestorage.app",
    messagingSenderId: "926628737720",
    appId: "1:926628737720:web:980479651650feecc57a4d",
    measurementId: "G-B95LV210GJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Firestore
export const db = getFirestore(app);

export default app;