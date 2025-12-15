import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHFOfUVFcdyU8CtKfToil_54IV4Oi3Ks4",
  authDomain: "sistemas-390c1.firebaseapp.com",
  databaseURL: "https://sistemas-390c1-default-rtdb.firebaseio.com",
  projectId: "sistemas-390c1",
  storageBucket: "sistemas-390c1.firebasestorage.app",
  messagingSenderId: "356964957232",
  appId: "1:356964957232:web:16c48bf637d59120ad41f5",
  measurementId: "G-P6FTXJMBYM"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
