import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBFGBpVtUeNL-t61RrjSzn3vLi5uzp9diU",
  authDomain: "app-local-8bfd8.firebaseapp.com",
  projectId: "app-local-8bfd8",
  storageBucket: "app-local-8bfd8.firebasestorage.app",
  messagingSenderId: "1062428641236",
  appId: "1:1062428641236:web:36b44f7d5c385ecb56f841",
  measurementId: "G-0PJGLMGH6D"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);