/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, ID, SortKey } from '../types'
import { fetchComments, createComment as createCommentApi, upvoteComment as upvoteApi } from '../api/comments'
import { toast } from 'sonner'
import { useAuth } from './auth'

interface CommentState {
  comments: Comment[]
  upvotedComments: Set<ID> // Track which comments the user has upvoted
  sort: SortKey
  loading: boolean
  fetchForPost: (postId: ID) => Promise<void>
  add: (payload: { postId: ID; parent_id: ID | null; text: string }) => Promise<void>
  upvote: (id: ID) => Promise<void>
  hasUpvoted: (id: ID) => boolean
  setSort: (s: SortKey) => void
}

function tempId() { return 'temp_' + Math.random().toString(36).slice(2, 10) }

export const useComments = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: [],
      upvotedComments: new Set<ID>(),
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
          
          // Sync upvoted state from backend
          const upvotedIds = data
            .filter((c: any) => c.hasUpvoted === true)
            .map((c: any) => c.id)
          
          set({ 
            comments: normalized, 
            upvotedComments: new Set(upvotedIds),
            loading: false 
          })
        } catch (e: any) {
          set({ loading: false })
          toast.error('Failed to load comments')
          console.error(e)
        }
      },
      async add({ postId, parent_id, text }) {
        // Get current user from auth store
        const currentUser = useAuth.getState().user
        
        // optimistic insert
        const optimistic: Comment = {
          id: tempId(),
          parent_id: parent_id || null,
          text,
          upvotes: 0,
          created_at: new Date().toISOString(),
          user_id: currentUser?.id || 'me',
          user: currentUser ? {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
          } : undefined,
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
        const hasUpvoted = get().upvotedComments.has(id)
        
        // optimistic toggle
        const prev = get().comments
        const prevUpvoted = new Set(get().upvotedComments)
        
        if (hasUpvoted) {
          // Remove upvote
          const newUpvoted = new Set(prevUpvoted)
          newUpvoted.delete(id)
          set({ 
            comments: prev.map(c => c.id === id ? { ...c, upvotes: c.upvotes - 1 } : c),
            upvotedComments: newUpvoted
          })
        } else {
          // Add upvote
          set({ 
            comments: prev.map(c => c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c),
            upvotedComments: new Set([...prevUpvoted, id])
          })
        }

        try {
          const updated = await upvoteApi(id)
          
          // Update with backend's authoritative count
          const newUpvoted = new Set(get().upvotedComments)
          
          // Backend returns hasUpvoted to tell us the final state
          if ((updated as any).hasUpvoted === true) {
            newUpvoted.add(id)
          } else if ((updated as any).hasUpvoted === false) {
            newUpvoted.delete(id)
          }
          
          set({
            comments: get().comments.map(c => c.id === id ? { ...c, upvotes: updated.upvotes } : c),
            upvotedComments: newUpvoted
          })
          toast.success(hasUpvoted ? 'Upvote removed' : 'Upvoted!')
        } catch (e: any) {
          // rollback
          set({ comments: prev, upvotedComments: prevUpvoted })
          toast.error('Failed to update upvote')
          console.error(e)
        }
      },
      hasUpvoted: (id) => get().upvotedComments.has(id),
      setSort: (s) => set({ sort: s }),
    }),
    { 
      name: 'interiit-comments',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          // Convert upvotedComments array back to Set
          if (parsed.state.upvotedComments) {
            parsed.state.upvotedComments = new Set(parsed.state.upvotedComments)
          }
          return parsed
        },
        setItem: (name, value) => {
          // Convert Set to array for JSON serialization
          const toStore = {
            ...value,
            state: {
              ...value.state,
              upvotedComments: Array.from(value.state.upvotedComments)
            }
          }
          localStorage.setItem(name, JSON.stringify(toStore))
        },
        removeItem: (name) => localStorage.removeItem(name),
      }
    }
  )
)
