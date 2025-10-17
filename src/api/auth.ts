import { api } from './client'


export async function loginApi(email: string, name?: string) {
    const { data } = await api.post('/api/auth/login', { email, name })
    return data as { token: string; user: any }
}