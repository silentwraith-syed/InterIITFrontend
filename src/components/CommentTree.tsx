import { useEffect, useMemo } from 'react'
import { buildTree } from '../utils/tree'
import type { Node } from '../utils/tree'
import { useComments } from '../store/comments'
import SortBar from './SortBar'
import CommentItem from './CommentItem'


export default function CommentTree({ postId }: { postId: string }) {
  const { comments, fetchForPost, sort, loading } = useComments()
  
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


  return (
    <section className="card p-5 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Comments</h2>
        <SortBar />
      </div>
      {loading ? <div className="mt-3">Loading…</div> : (
        <div className="mt-2">
          {nodes.map((n) => (
            <CommentItem key={n.id} node={n} postId={postId} depth={0} />
          ))}
        </div>
      )}
    </section>
  )
}