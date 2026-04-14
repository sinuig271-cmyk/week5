import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  login: (token) => set({ accessToken: token }),
  logout: () => set({ user: null, accessToken: null }),
  setUser: (user) => set({ user }),
  setLoading: (v) => set({ isLoading: v }),
}))
