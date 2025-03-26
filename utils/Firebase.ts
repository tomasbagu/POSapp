import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA19_tEPSuRCqB40l27aCL-RtoSVTSfgnw",
    authDomain: "posapp-f777b.firebaseapp.com",
    projectId: "posapp-f777b",
    storageBucket: "posapp-f777b.firebasestorage.app",
    messagingSenderId: "170836371535",
    appId: "1:170836371535:web:bffb35f2e7d11e6c23223a"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);







