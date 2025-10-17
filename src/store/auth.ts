/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginApi } from '../api/auth'


interface AuthState {
email: string | null
name: string | null
isAuthed: boolean
token: string | null
user: any | null
login: (email: string, name?: string) => Promise<boolean>
logout: () => void
}


export const useAuth = create<AuthState>()(
persist(
(set) => ({
email: null,
name: null,
isAuthed: false,
token: null,
user: null,
async login(email: string, name?: string) {
try {
const { token, user } = await loginApi(email, name)
set({ email: user.email, name: user.name, isAuthed: true, token, user })
return true
} catch (e) {
console.error(e)
return false
}
},
logout: () => set({ email: null, name: null, isAuthed: false, token: null, user: null }),
}),
{ name: 'interiit-auth' }
)
)