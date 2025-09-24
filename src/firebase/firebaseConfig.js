// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBilrLpbnOljjNPkpLM_UMo00fMk1NyM_o",
  authDomain: "yomanejo-7419e.firebaseapp.com",
  projectId: "yomanejo-7419e",
  storageBucket: "yomanejo-7419e.firebasestorage.app",
  messagingSenderId: "658220365348",
  appId: "1:658220365348:web:f9f9f1f6c193c8a9a70ab1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);