import { create } from 'zustand'

interface UiState {
  upgradeModal: boolean
  sidebarOpen: boolean
  openUpgrade: () => void
  closeUpgrade: () => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  upgradeModal: false,
  sidebarOpen: false,
  openUpgrade: () => set({ upgradeModal: true }),
  closeUpgrade: () => set({ upgradeModal: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
