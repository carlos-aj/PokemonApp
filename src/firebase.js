import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDgIKqIsC0qjrNld6MOMA97TehlycOcOtA",
    authDomain: "pokeappproject.firebaseapp.com",
    projectId: "pokeappproject",
    storageBucket: "pokeappproject.firebasestorage.app",
    messagingSenderId: "130890355278",
    appId: "1:130890355278:web:4eb8546719c7380008e91f",
    measurementId: "G-LY23DSW46F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
