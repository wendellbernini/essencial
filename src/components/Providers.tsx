<<<<<<< Updated upstream
'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ComparisonProvider } from '@/contexts/ComparisonContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ComparisonProvider>
            {children}
          </ComparisonProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
} 
=======
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <AuthProvider>
          <WishlistProvider>
            <ComparisonProvider>{children}</ComparisonProvider>
          </WishlistProvider>
        </AuthProvider>
      </SessionProvider>
    </Provider>
  );
}
>>>>>>> Stashed changes
