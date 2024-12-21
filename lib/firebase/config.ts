import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvIr3Qvu3cVkSW-Md5kOzK0SPgWr5l6Zo",
  authDomain: "codeaai-fe42e.firebaseapp.com",
  projectId: "codeaai-fe42e",
  storageBucket: "codeaai-fe42e.firebasestorage.app",
  messagingSenderId: "414332387481",
  appId: "1:414332387481:web:ee59ceeef03ad30b26b808",
  measurementId: "G-F96TD9VX70"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);