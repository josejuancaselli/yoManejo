import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2CpMllbDvP_lEGk5B37TeHZA53iVIRac",
  authDomain: "yomanejo-1510a.firebaseapp.com",
  projectId: "yomanejo-1510a",
  storageBucket: "yomanejo-1510a.appspot.app",
  messagingSenderId: "787782467321",
  appId: "1:787782467321:web:164d7bf9e60d25ae4b2c28",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);




  //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID