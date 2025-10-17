/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, ID, SortKey } from '../types'
import { fetchComments, createComment as createCommentApi, upvoteComment as upvoteApi } from '../api/comments'
import { toast } from 'sonner'

interface CommentState {
  comments: Comment[]
  sort: SortKey
  loading: boolean
  fetchForPost: (postId: ID) => Promise<void>
  add: (payload: { postId: ID; parent_id: ID | null; text: string }) => Promise<void>
  upvote: (id: ID) => Promise<void>
  setSort: (s: SortKey) => void
}

function tempId() { return 'temp_' + Math.random().toString(36).slice(2, 10) }

export const useComments = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: [],
      sort: 'top',
      loading: false,
      async fetchForPost(postId) {
        set({ loading: true })
        try {
          const data = await fetchComments(postId)
          const normalized: Comment[] = data.map((c: any) => ({
            id: c.id,
            parent_id: c.parentId || null,
            text: c.text,
            upvotes: c.upvotes,
            created_at: c.createdAt,
            user_id: c.userId,
            // NEW: keep user object (for avatar/name)
            user: c.user,
          }))
          set({ comments: normalized, loading: false })
        } catch (e: any) {
          set({ loading: false })
          toast.error('Failed to load comments')
          console.error(e)
        }
      },
      async add({ postId, parent_id, text }) {
        // optimistic insert
        const optimistic: Comment = {
          id: tempId(),
          parent_id: parent_id || null,
          text,
          upvotes: 0,
          created_at: new Date().toISOString(),
          // user_id will be replaced after server returns; use auth user if you keep it in store
          user_id: 'me',
          user: undefined, // will be replaced by server response on refetch or merge
        }
        const prev = get().comments
        set({ comments: [...prev, optimistic] })

        try {
          const created = await createCommentApi(postId, text, parent_id ?? null)
          const mapped: Comment = {
            id: created.id,
            parent_id: created.parentId || null,
            text: created.text,
            upvotes: created.upvotes,
            created_at: created.createdAt,
            user_id: created.userId,
            user: created.user, // backend may not include; optional
          }
          // replace temp with actual
          set({
            comments: get().comments.map(c => c.id === optimistic.id ? mapped : c)
          })
        } catch (e: any) {
          // rollback
          set({ comments: prev })
          toast.error('Could not post your comment')
          console.error(e)
        }
      },
      async upvote(id) {
        // optimistic upvote
        const prev = get().comments
        set({ comments: prev.map(c => c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c) })

        try {
          const updated = await upvoteApi(id)
          set({
            comments: get().comments.map(c => c.id === id ? { ...c, upvotes: updated.upvotes } : c)
          })
        } catch (e: any) {
          // rollback
          set({ comments: prev })
          toast.error('Failed to upvote')
          console.error(e)
        }
      },
      setSort: (s) => set({ sort: s }),
    }),
    { name: 'interiit-comments' }
  )
)
