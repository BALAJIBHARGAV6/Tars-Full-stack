/* ========================================================
   SIDEBAR STORE - State Management with Zustand
   
   Zustand is a simple state management library. This store
   manages the mobile sidebar's open/closed state.
   
   Why Zustand instead of React Context?
   - Simpler API (no Provider needed)
   - Better performance (components only re-render when
     the specific state they use changes)
   - Less boilerplate code
   ======================================================== */

import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;         // Whether sidebar is visible on mobile
  open: () => void;        // Show the sidebar
  close: () => void;       // Hide the sidebar
  toggle: () => void;      // Toggle sidebar visibility
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
