import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP9StwYM8qoOmufb9hQXVKClsX7NFxZqA",
  authDomain: "cahtly-app.firebaseapp.com",
  databaseURL: "https://cahtly-app-default-rtdb.firebaseio.com",
  projectId: "cahtly-app",
  storageBucket: "cahtly-app.firebasestorage.app",
  messagingSenderId: "593203560564",
  appId: "1:593203560564:web:545e6af5a8bfb77daf1121",
  measurementId: "G-VGH99B2Y1Y",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
