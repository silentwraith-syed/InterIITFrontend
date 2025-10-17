import { api } from './client'

interface CommentResponse {
  id: string
  parentId: string | null
  text: string
  upvotes: number
  createdAt: string
  userId: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
}

export async function fetchComments(postId: string) {
  const { data } = await api.get(`/api/comments/post/${postId}`)
  return data as CommentResponse[]
}


export async function createComment(postId: string, text: string, parentId?: string | null) {
  const { data } = await api.post('/api/comments', { postId, text, parentId: parentId ?? null })
  return data as CommentResponse
}


export async function upvoteComment(commentId: string) {
  const { data } = await api.post(`/api/comments/${commentId}/upvote`)
  return data as CommentResponse
}