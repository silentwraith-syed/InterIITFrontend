import { api } from './client'
export async function getPost(postId: string) {
const { data } = await api.get(`/api/posts/${postId}`)
return data
}
export async function listPosts() {
const { data } = await api.get('/api/posts')
return data as any[]
}