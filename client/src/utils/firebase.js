import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-7a0a1.firebaseapp.com",
  projectId: "taskmanager-7a0a1",
  storageBucket: "taskmanager-7a0a1.firebasestorage.app",
  messagingSenderId: "582172182378",
  appId: "1:582172182378:web:9ccdacdd088b69288dc713",
};

export const app = initializeApp(firebaseConfig);
