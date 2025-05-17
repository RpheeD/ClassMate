import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAyPpw6JBfqGGzyVBQxegvAvyrvUG8mDbo",
  authDomain: "classmate-509e5.firebaseapp.com",
  projectId: "classmate-509e5",
  storageBucket: "classmate-509e5.firebasestorage.app",
  messagingSenderId: "626978688867",
  appId: "1:626978688867:web:cf1615ef0cb73274fd0d56"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);


export { auth, firestore };
