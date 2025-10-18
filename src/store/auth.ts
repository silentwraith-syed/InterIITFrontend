import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, register as apiRegister } from '../api/auth'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

interface AuthState {
  isAuthed: boolean
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      token: null,
      user: null,
      async login(email, password) {
        try {
          const { token, user } = await apiLogin(email, password)
          set({ isAuthed: true, token, user })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },
      async register(email, password, name) {
        try {
          const { token, user } = await apiRegister(email, password, name)
          set({ isAuthed: true, token, user })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },
      logout: () => set({ isAuthed: false, token: null, user: null }),
    }),
    { name: 'interiit-auth' }
  )
)
