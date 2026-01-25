
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyCnEyzaUz9PEt4swjaTnee5hWE4n3xhGmE",
  authDomain: "e-wed-59061.firebaseapp.com",
  databaseURL: "https://e-wed-59061-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-wed-59061",
  storageBucket: "e-wed-59061.firebasestorage.app",
  messagingSenderId: "785291082676",
  appId: "1:785291082676:web:99d0f76eb0dc0619ea50e1",
  measurementId: "G-ZVEC3N2V6E"
};

const app = initializeApp(firebaseConfig);
// Export Realtime Database instance
export const db = getDatabase(app);
