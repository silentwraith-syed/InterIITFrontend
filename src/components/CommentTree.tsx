import { useEffect, useMemo, useState } from 'react'
import { buildTree } from '../utils/tree'
import type { Node } from '../utils/tree'
import { useComments } from '../store/comments'
import SortBar from './SortBar'
import CommentItem from './CommentItem'
import CommentEditor from './CommentEditor'
import { useAuth } from '../store/auth'


export default function CommentTree({ postId }: { postId: string }) {
  const { comments, fetchForPost, sort, loading, add } = useComments()
  const { isAuthed } = useAuth()
  const [addingComment, setAddingComment] = useState(false)
  
  useEffect(() => { 
    fetchForPost(postId) 
  }, [postId, fetchForPost])


  const nodes: Node[] = useMemo(() => {
    const base = buildTree(comments)
    if (sort === 'top') {
      return [...base].sort((a, b) => b.upvotes - a.upvotes)
    }
    if (sort === 'new') {
      return [...base].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    if (sort === 'replies') {
      return [...base].sort((a, b) => b.children.length - a.children.length)
    }
    return base
  }, [comments, sort])

  const totalComments = comments.length

  return (
    <section className="card p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
        </h2>
        <SortBar />
      </div>

      {/* Top-level comment input */}
      {isAuthed && (
        <div className="mb-4 pb-4 border-b border-base-border">
          {!addingComment ? (
            <button 
              onClick={() => setAddingComment(true)}
              className="input text-left text-base-mute hover:border-brand-primary transition-colors cursor-text"
            >
              Add a comment...
            </button>
          ) : (
            <div className="space-y-2">
              <CommentEditor
                autoFocus
                onSubmit={async (text) => {
                  await add({ postId, parent_id: null, text })
                  setAddingComment(false)
                }}
              />
              <button 
                onClick={() => setAddingComment(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="mt-3 text-center text-base-mute">Loading comments...</div>
      ) : nodes.length === 0 ? (
        <div className="mt-3 text-center text-base-mute py-8">
          <p className="text-lg mb-2">No comments yet</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="mt-2 space-y-4">
          {nodes.map((n) => (
            <CommentItem key={n.id} node={n} postId={postId} depth={0} />
          ))}
        </div>
      )}
    </section>
  )
}