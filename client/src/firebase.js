// firebase.js or firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArNmtSkQ3CH37ubiHGNFFme_eHyCT_CUQ",
    authDomain: "qrurl-15135.firebaseapp.com",
    projectId: "qrurl-15135",
    storageBucket: "qrurl-15135.appspot.com",
    messagingSenderId: "649505637744",
    appId: "1:649505637744:web:6e9a5ef1e789d2ad5c7bb5",
    measurementId: "G-YQN1CCWST4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
