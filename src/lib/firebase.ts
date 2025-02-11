import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize services and providers
const app = initializeApp(firebaseConfig);

const auth = getAuth(app),
  googleAuthProvider = new GoogleAuthProvider(),
  facebookAuthProvider = new FacebookAuthProvider(),
  appleAuthProvider = new OAuthProvider("apple.com");

// Initialize Firestore
const db = getFirestore(app);

export {
  auth,
  googleAuthProvider,
  facebookAuthProvider,
  appleAuthProvider,
  db,
};
