import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1VIZA99wGPA28d0z2p3T38-kkKpfLvSQ",
    authDomain: "alec-fernandes.firebaseapp.com",
    projectId: "alec-fernandes",
    storageBucket: "alec-fernandes.firebasestorage.app",
    messagingSenderId: "990187193176",
    appId: "1:990187193176:web:092e9a2138a8aea7da9b2d",
    measurementId: "G-7QM5KTX0XK",
};

const app = initializeApp(firebaseConfig),
    auth = getAuth(app),
    db = getFirestore(app);

export { auth, db };
