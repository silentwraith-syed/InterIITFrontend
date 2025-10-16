import { ArrowBigUp } from "lucide-react";


export default function VoteButton({ count, onUpvote }: { count: number; onUpvote: () => void }) {
return (
<button onClick={onUpvote} className="btn-ghost text-base-mute hover:text-brand-primary">
<ArrowBigUp className="w-5 h-5" /> {count}
</button>
);
}