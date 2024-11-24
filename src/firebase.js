import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBMBW4IGbSUzmu5G3ybBuxoeJK8PW5iEXk",
    authDomain: "register-703f2.firebaseapp.com",
    projectId: "register-703f2",
    storageBucket: "register-703f2.appspot.com",
    messagingSenderId: "418531322233",
    appId: "1:418531322233:web:de0fee64294a9c8844a7a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
