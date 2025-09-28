import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware' // Add persistence

interface AppState {
  isLoading: boolean
  currentView: 'chat' | 'agents' | 'documents' | 'settings'
  sidebarCollapsed: boolean
  notifications: Notification[]
  systemInfo: {
    platform: string
    version: string
    electronVersion: string
  } | null

  // Actions
  setLoading: (loading: boolean) => void
  setCurrentView: (view: AppState['currentView']) => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  initializeApp: () => Promise<void>
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  autoClose?: boolean
}

export const useAppStore = create<AppState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      isLoading: false,
      currentView: 'chat',
      sidebarCollapsed: false,
      notifications: [],
      systemInfo: null,

      setLoading: (loading) => set({ isLoading: loading }),

      setCurrentView: (view) => set({ currentView: view }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      addNotification: (notification) => {
        const id = crypto.randomUUID()
        const timestamp = Date.now()
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp,
          autoClose: notification.autoClose ?? true
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))

        if (newNotification.autoClose) {
          setTimeout(() => {
            get().removeNotification(id)
          }, 5000)
        }
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      initializeApp: async () => {
        set({ isLoading: true })

        try {
          if (window.electronAPI) {
            const systemInfo = await window.electronAPI.system.getInfo()
            set({ systemInfo })
          }

          get().addNotification({
            type: 'success',
            title: 'ARC Initialized',
            message: 'Agentic Renovation Crew is ready for orchestration'
          })
        } catch (error) {
          get().addNotification({
            type: 'error',
            title: 'Initialization Error',
            message: 'Failed to initialize application'
          })
        } finally {
          set({ isLoading: false })
        }
      }
    })),
    {
      name: 'arc-app-state', // Key for localStorage
      partialize: (state) => ({
        currentView: state.currentView,
        notifications: state.notifications,
        sidebarCollapsed: state.sidebarCollapsed
      }) // Only persist these fields
    }
  )
)