import { create } from 'zustand'

interface GlobalState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))
