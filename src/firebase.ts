import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqWwx4mGfPKbhQrnoCPGXfxh1tJUFyY-s",
  authDomain: "tictactoe-83b2f.firebaseapp.com",
  projectId: "tictactoe-83b2f",
  storageBucket: "tictactoe-83b2f.appspot.com",
  messagingSenderId: "1038824729880",
  appId: "1:1038824729880:web:3450e3126d828834f6826d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();
export const database = getDatabase();