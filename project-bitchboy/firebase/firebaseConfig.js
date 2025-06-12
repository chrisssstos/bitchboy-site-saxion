import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6_8ppTnqtHEk0nf3gfzSTq06afC-5Abs",
  authDomain: "bitchboy-6d583.firebaseapp.com",
  projectId: "bitchboy-6d583",
  storageBucket: "bitchboy-6d583.firebasestorage.app",
  messagingSenderId: "991801143333",
  appId: "1:991801143333:web:ef9dde6e6c5ac28f5f4fcc",
  measurementId: "G-PRTEVDT5MR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };
