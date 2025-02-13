"use client";

import { createContext, useContext, ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Session["user"] | null;
  loading: boolean;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const handleSignIn = async (provider?: string) => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: status === "authenticated",
        user: session?.user ?? null,
        loading: status === "loading",
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
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
