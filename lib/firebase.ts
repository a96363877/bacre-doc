import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA0h6Fr8Rj-1h1-hnVaagrdINe9KELOOUM",
    authDomain: "qatar-33.firebaseapp.com",
    projectId: "qatar-33",
    storageBucket: "qatar-33.firebasestorage.app",
    messagingSenderId: "1092649551137",
    appId: "1:1092649551137:web:e5a35176cc5f6c16076a60",
    measurementId: "G-1N7BHMYPB9"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

