import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, ID, SortKey } from '../types'
import { fetchComments, createComment as createCommentApi, upvoteComment as upvoteApi } from '../api/comments'


interface CommentState {
comments: Comment[]
sort: SortKey
loading: boolean
fetchForPost: (postId: ID) => Promise<void>
add: (payload: { postId: ID; parent_id: ID | null; text: string; user_id?: ID }) => Promise<void>
upvote: (id: ID) => Promise<void>
setSort: (s: SortKey) => void
}


export const useComments = create<CommentState>()(
persist(
(set, get) => ({
comments: [],
sort: 'top',
loading: false,
async fetchForPost(postId) {
set({ loading: true })
const data = await fetchComments(postId)
// Map API shape -> Comment shape expected by UI
const normalized: Comment[] = data.map((c: any) => ({
id: c.id,
parent_id: c.parentId || null,
text: c.text,
upvotes: c.upvotes,
created_at: c.createdAt,
user_id: c.userId,
}))
set({ comments: normalized, loading: false })
},
async add({ postId, parent_id, text }) {
const created = await createCommentApi(postId, text, parent_id ?? null)
const mapped: Comment = {
id: created.id,
parent_id: created.parentId || null,
text: created.text,
upvotes: created.upvotes,
created_at: created.createdAt,
user_id: created.userId,
}
set({ comments: [...get().comments, mapped] })
},
async upvote(id) {
const updated = await upvoteApi(id)
set({ comments: get().comments.map(c => c.id === id ? { ...c, upvotes: updated.upvotes } : c) })
},
setSort: (s) => set({ sort: s }),
}),
{ name: 'interiit-comments' }
)
)