/* eslint-disable prettier/prettier */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Strip surrounding quotes that some env setups preserve
function stripQuotes(val: string | undefined): string | undefined {
  if (!val) return val;
  return val.replace(/^["']|["']$/g, '').trim();
}

const rawConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfig = {
  apiKey:            stripQuotes(rawConfig.apiKey),
  authDomain:        stripQuotes(rawConfig.authDomain),
  projectId:         stripQuotes(rawConfig.projectId),
  storageBucket:     stripQuotes(rawConfig.storageBucket),
  messagingSenderId: stripQuotes(rawConfig.messagingSenderId),
  appId:             stripQuotes(rawConfig.appId),
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
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error('[DemonLord] Firebase init error:', e);
  }
} else if (typeof window !== 'undefined') {
  console.warn(
    '[DemonLord] Firebase not configured.\n' +
    'Detected values:\n' +
    `  apiKey: ${rawConfig.apiKey ? '✅ set' : '❌ missing'}\n` +
    `  authDomain: ${rawConfig.authDomain ? '✅ set' : '❌ missing'}\n` +
    `  projectId: ${rawConfig.projectId ? '✅ set' : '❌ missing'}\n` +
    `  appId: ${rawConfig.appId ? '✅ set' : '❌ missing'}\n` +
    'IMPORTANT: Do NOT wrap values in quotes in .env.local\n' +
    '  ✅ NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...\n' +
    '  ❌ NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."'
  );
}

export { auth, db };
export default app;
export const firebaseConfigured = isConfigured;
