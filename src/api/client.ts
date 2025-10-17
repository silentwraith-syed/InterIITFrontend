import axios from 'axios'


const baseURL = import.meta.env.VITE_API_URL || '' // empty when proxying
export const api = axios.create({ baseURL })


// attach token from auth store if present
api.interceptors.request.use((cfg) => {
    try {
        const raw = localStorage.getItem('interiit-auth')
        if (raw) {
            const { state } = JSON.parse(raw)
            const token = state?.token
            if (token) {
                cfg.headers.Authorization = `Bearer ${token}`
            }
        }
    } catch (error) {
        // Silently fail if auth token retrieval fails
        console.debug('Failed to retrieve auth token:', error)
    }
    return cfg
})