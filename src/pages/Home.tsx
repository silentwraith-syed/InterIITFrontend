import post from "../data/post.json";
import users from "../data/users.json";
import PostCard from "../components/PostCard";
import CommentTree from "../components/CommentTree";


export default function Home() {
const author = users.find((u) => u.id === post.author_id)!;
return (
<div className="space-y-4">
<PostCard post={post} author={author} />
<CommentTree />
</div>
);
}