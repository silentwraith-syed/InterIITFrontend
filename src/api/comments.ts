import { api } from './client'


export async function fetchComments(postId: string) {
const { data } = await api.get(`/api/comments/post/${postId}`)
return data as any[]
}


export async function createComment(postId: string, text: string, parentId?: string | null) {
const { data } = await api.post('/api/comments', { postId, text, parentId: parentId ?? null })
return data as any
}


export async function upvoteComment(commentId: string) {
const { data } = await api.post(`/api/comments/${commentId}/upvote`)
return data as any
}