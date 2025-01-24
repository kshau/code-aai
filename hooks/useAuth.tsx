"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase/config";

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  status: "authenticated" | "unauthenticated" | "loading";
  signIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      if (username && password) {
        if (username.includes("@")) {
          await signInWithEmailAndPassword(auth, `${username}`, password);
        } else {
          await signInWithEmailAndPassword(
            auth,
            `${username}@codeaai.org`,
            password
          );
        }
      }
    }
    catch (error: any) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
