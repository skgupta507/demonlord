/* eslint-disable prettier/prettier */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Strip surrounding quotes that Next.js preserves from .env files
function stripQuotes(val: string | undefined): string | undefined {
  if (!val) return val;
  return val.replace(/^["']|["']$/g, '');
}

const firebaseConfig = {
  apiKey:            stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain:        stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId:         stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket:     stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId:             stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else if (typeof window !== 'undefined') {
  console.warn(
    '[DemonLord] Firebase not configured — add NEXT_PUBLIC_FIREBASE_* vars to .env.local\n' +
    'IMPORTANT: Do NOT wrap values in quotes in .env.local\n' +
    '  ✅ NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...\n' +
    '  ❌ NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."'
  );
}

export { auth, db };
export default app;
export const firebaseConfigured = isConfigured;
