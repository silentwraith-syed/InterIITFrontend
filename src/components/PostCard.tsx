import type { Post, User } from "../types";
import Avatar from "./Avatar";
import { timeAgo } from "../utils/time";


export default function PostCard({ post, author }: { post: Post; author: User }) {
return (
<article className="card overflow-hidden">
{post.image && (
<img src={post.image} alt="cover" className="w-full aspect-[16/8] object-cover" />
)}
<div className="p-5">
<div className="flex items-center gap-3 mb-3">
<Avatar src={author.avatar} alt={author.name} />
<div className="text-sm text-base-mute">
<div className="font-medium text-base-text">{author.name}</div>
<div>{timeAgo(post.created_at)}</div>
</div>
</div>
<h1 className="text-2xl font-bold mb-2">{post.title}</h1>
<p className="text-base-mute leading-relaxed">{post.body}</p>
</div>
</article>
);
}