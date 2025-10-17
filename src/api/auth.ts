import { api } from './client'

export async function requestOtp(email: string, name?: string) {
  return api.post('/api/auth/request-otp', { email, name })
}
export async function verifyOtp(email: string, code: string) {
  const { data } = await api.post('/api/auth/verify-otp', { email, code })
  return data as { token: string; user: any }
}
