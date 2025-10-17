import { useEffect, useState } from 'react'
import users from '../data/users.json'
import PostCard from '../components/PostCard'
import CommentTree from '../components/CommentTree'
import { listPosts } from '../api/posts'


export default function Home() {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [post, setPost] = useState<any | null>(null)
useEffect(() => { (async () => { const p = (await listPosts())[0]; setPost(p) })() }, [])
if (!post) return <div className="card p-5 mt-4">Loading…</div>
const author = post.author || users[5]
return (
<div className="space-y-4" data-post-id={post.id}>
<PostCard post={{ id: post.id, title: post.title, body: post.body, image: post.image, created_at: post.createdAt, author_id: post.authorId }} author={{ id: author.id, name: author.name, avatar: author.avatar, created_at: author.createdAt }} />
<CommentTree postId={post.id} />
</div>
)
}