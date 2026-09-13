import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface AuthUser {
  id: string
  email: string
  fullName: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => {
      set((state) => {
        state.user = user
        state.isAuthenticated = true
      })
    },
    clearUser: () => {
      set((state) => {
        state.user = null
        state.isAuthenticated = false
      })
    },
  })),
)
