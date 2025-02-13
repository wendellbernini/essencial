"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (id: string) => {
    setItems((currentItems) => {
      if (!currentItems.includes(id)) {
        return [...currentItems, id];
      }
      return currentItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((itemId) => itemId !== id));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const isInWishlist = (id: string) => {
    return items.includes(id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
