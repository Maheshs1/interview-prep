import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzMRu9jaZWvcTlnNQUCjq3bqehrYnUzwY',
  authDomain: 'fir-auth-5651c.firebaseapp.com',
  projectId: 'fir-auth-5651c',
  databaseURL: 'https://fir-auth-5651c.firebaseio.com',
  storageBucket: 'fir-auth-5651c.firebasestorage.app',
  messagingSenderId: '564324298962',
  appId: '1:564324298962:web:030b9b2516255a2d233d0b',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
