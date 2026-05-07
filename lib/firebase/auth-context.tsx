/* eslint-disable prettier/prettier */
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, firebaseConfigured } from './config';

// Lazy-import firebase/auth to avoid crashing when config missing
type User = { uid: string; email: string | null; displayName: string | null; photoURL: string | null };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: false, configured: false,
  signInWithGoogle: async () => {}, signInWithEmail: async () => {},
  signUpWithEmail: async () => {}, sendMagicLink: async () => {},
  resetPassword: async () => {}, signOut: async () => {}, error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseConfigured || !auth) { setLoading(false); return; }

    // Dynamically import firebase/auth
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      const unsub = onAuthStateChanged(auth!, (u) => {
        setUser(u ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } : null);
        setLoading(false);
      });
      return unsub;
    });

    // Handle magic link on page load
    import('firebase/auth').then(({ isSignInWithEmailLink, signInWithEmailLink }) => {
      if (auth && isSignInWithEmailLink(auth, window.location.href)) {
        const email = localStorage.getItem('emailForSignIn');
        if (email) {
          signInWithEmailLink(auth, email, window.location.href)
            .then(() => localStorage.removeItem('emailForSignIn'))
            .catch(e => setError(e.message));
        }
      }
    });
  }, []);

  const requireConfig = () => {
    if (!firebaseConfigured) {
      setError('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* vars to .env.local');
      throw new Error('Firebase not configured');
    }
  };

  const signInWithGoogle = async () => {
    requireConfig();
    setError(null);
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    await signInWithPopup(auth!, new GoogleAuthProvider()).catch(e => { setError(e.message); throw e; });
  };

  const signInWithEmail = async (email: string, password: string) => {
    requireConfig();
    setError(null);
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth!, email, password).catch(e => { setError(e.message); throw e; });
  };

  const signUpWithEmail = async (email: string, password: string) => {
    requireConfig();
    setError(null);
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    await createUserWithEmailAndPassword(auth!, email, password).catch(e => { setError(e.message); throw e; });
  };

  const sendMagicLink = async (email: string) => {
    requireConfig();
    setError(null);
    const { sendSignInLinkToEmail } = await import('firebase/auth');
    const actionCodeSettings = { url: `${window.location.origin}/auth/magic`, handleCodeInApp: true };
    await sendSignInLinkToEmail(auth!, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
  };

  const resetPassword = async (email: string) => {
    requireConfig();
    setError(null);
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth!, email).catch(e => { setError(e.message); throw e; });
  };

  const signOut = async () => {
    if (!auth) return;
    const { signOut: fbSignOut } = await import('firebase/auth');
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, configured: firebaseConfigured,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      sendMagicLink, resetPassword, signOut, error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
