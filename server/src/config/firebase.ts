import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBh7s7z6cv8hAWwzsHQnBeGLwNV-KHjnsU',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'soulsyncbd-72287.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'soulsyncbd-72287',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'soulsyncbd-72287.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '60369449379',
  appId: process.env.FIREBASE_APP_ID || '1:60369449379:web:81d753c7c8b6f5d32f6a16',
};

const hasFirebaseConfig = Boolean(firebaseConfig.projectId);

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseDb: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;

export function getFirebaseServerStatus() {
  return {
    configured: hasFirebaseConfig,
    projectId: firebaseConfig.projectId,
  };
}
