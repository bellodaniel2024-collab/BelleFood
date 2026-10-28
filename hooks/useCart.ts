"use client";
/**
 * Zustand cart store with localStorage persistence.
 * Cart state is display-only — server recalculates all totals at checkout.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartState } from "@/types";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.menuItemId === item.menuItemId);

        if (existing) {
          const newQty = Math.min(existing.quantity + (item.quantity ?? 1), 20);
          set({
            items: items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: newQty }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...item, quantity: item.quantity ?? 1 },
            ],
          });
        }
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(menuItemId);
          return;
        }
        const clamped = Math.min(quantity, 20);
        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: clamped } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotalKobo() {
        return get().items.reduce(
          (sum, i) => sum + i.priceKobo * i.quantity,
          0
        );
      },
    }),
    {
      name: "belle-food-cart",
      storage: createJSONStorage(() => {
        // Safe localStorage access — fails gracefully in SSR
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Validate persisted cart data on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sanitize quantities — remove invalid items
          state.items = state.items.filter(
            (item) =>
              item.menuItemId &&
              typeof item.priceKobo === "number" &&
              item.priceKobo > 0 &&
              item.quantity >= 1 &&
              item.quantity <= 20
          );
        }
      },
    }
  )
);
