import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase - À remplacer par vos vraies clés
const firebaseConfig = {
  apiKey: "AIzaSyDaleZjacIUhLov-weuKHPOux8w4-gnhRw",
  authDomain: "oyder-7d3f7.firebaseapp.com",
  projectId: "oyder-7d3f7",
  storageBucket: "oyder-7d3f7.firebasestorage.app",
  messagingSenderId: "794604169001",
  appId: "1:794604169001:web:69304f28f1a1866458f938",
  measurementId: "G-20SC9GRDF3",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
// Exporter les services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
