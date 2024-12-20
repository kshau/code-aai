'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  signInWithEmailAndPassword,
  TwitterAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import { useRouter } from 'next/navigation';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  status: "authenticated" | "unauthenticated" | "loading";
  signIn: (provider?: string, email?: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

// Create the context with a more specific type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        setStatus("authenticated")
      }
      else {
        setStatus("unauthenticated")
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (provider?: string, email?: string, password?: string) => {

    if (provider) {
      var providerType: any;

      switch (provider) {
        case 'google':
          providerType = new GoogleAuthProvider();
          break;
        case 'twitter':
          providerType = new TwitterAuthProvider();
          break;
        case 'github':
          providerType = new GithubAuthProvider();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      await signInWithPopup(auth, providerType);
    }
    else {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error', error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ user, status, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
