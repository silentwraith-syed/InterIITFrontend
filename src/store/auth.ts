import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { requestOtp, verifyOtp } from '../api/auth'

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  step: 'email' | 'code'
  email: string | null
  name: string | null
  isAuthed: boolean
  token: string | null
  user: User | null
  request: (email: string, name?: string) => Promise<boolean>
  verify: (code: string) => Promise<boolean>
  resetStep: () => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      step: 'email',
      email: null,
      name: null,
      isAuthed: false,
      token: null,
      user: null,
      async request(email, name) {
        try {
          await requestOtp(email, name)
          set({ email, name: name || null, step: 'code' })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },
      async verify(code) {
        try {
          const { token, user } = await verifyOtp(get().email!, code)
          set({ isAuthed: true, token, user, step: 'email' })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },
      resetStep: () => set({ step: 'email', email: null, name: null }),
      logout: () => set({ email: null, name: null, isAuthed: false, token: null, user: null, step: 'email' }),
    }),
    { name: 'interiit-auth' }
  )
)
