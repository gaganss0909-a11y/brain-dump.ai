"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, Auth } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Set cookie for 7 days
      } else {
        setUser(null);
        Cookies.remove("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    router.push("/dashboard");
    return userCredential;
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create a document for the new user in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      subscriptionTier: "Free",
    });

    router.push("/dashboard");
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
