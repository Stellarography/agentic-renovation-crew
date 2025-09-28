// src/stores/uiSlice.ts
import { create } from "zustand";

interface UIState {
  isHierarchyOpen: boolean;
  toggleHierarchy: () => void;
  closeHierarchy: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHierarchyOpen: true, // show by default
  toggleHierarchy: () => set((s) => ({ isHierarchyOpen: !s.isHierarchyOpen })),
  closeHierarchy: () => set({ isHierarchyOpen: false }),
}));