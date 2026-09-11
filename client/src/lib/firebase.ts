import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const getEnv = (key: string, viteKey: string, fallback: string = '') => {
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[viteKey]) {
    return (import.meta as any).env[viteKey] as string;
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'VITE_FIREBASE_API_KEY', 'AIzaSyBh7s7z6cv8hAWwzsHQnBeGLwNV-KHjnsU'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_AUTH_DOMAIN', 'soulsyncbd-72287.firebaseapp.com'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_PROJECT_ID', 'soulsyncbd-72287'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_STORAGE_BUCKET', 'soulsyncbd-72287.firebasestorage.app'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_MESSAGING_SENDER_ID', '60369449379'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'VITE_FIREBASE_APP_ID', '1:60369449379:web:81d753c7c8b6f5d32f6a16'),
  measurementId: getEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'VITE_FIREBASE_MEASUREMENT_ID', 'G-GRR67K4B2C'),
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseDb: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseStorage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

export function getFirebaseStatus() {
  return {
    configured: hasFirebaseConfig,
    projectId: firebaseConfig.projectId,
    appIdConfigured: Boolean(firebaseConfig.appId),
  };
}
