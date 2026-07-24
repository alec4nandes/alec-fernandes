import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxXxRtviETe_a1q9vdGHrradtNF0GfK-s",
    authDomain: "alecfernandes.firebaseapp.com",
    projectId: "alecfernandes",
    storageBucket: "alecfernandes.firebasestorage.app",
    messagingSenderId: "76763730241",
    appId: "1:76763730241:web:6ca7b83357c787d89311c0",
};

const app = initializeApp(firebaseConfig),
    auth = getAuth(app),
    db = getFirestore(app);

export { auth, db };
