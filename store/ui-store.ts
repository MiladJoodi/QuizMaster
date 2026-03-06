import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  searchOpen: boolean;
  globalSearchQuery: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setGlobalSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  searchOpen: false,
  globalSearchQuery: '',
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set(state => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
  setMobileSidebarOpen: (open) => set({ sidebarMobileOpen: open }),
  toggleSearch: () => set(state => ({ searchOpen: !state.searchOpen, globalSearchQuery: state.searchOpen ? '' : state.globalSearchQuery })),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
}));
