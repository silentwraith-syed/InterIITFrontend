import { api } from './client'

interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    createdAt: string
  }
}

export async function register(email: string, password: string, name?: string) {
  const { data } = await api.post<AuthResponse>('/api/auth/register', { email, password, name })
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password })
  return data
}
