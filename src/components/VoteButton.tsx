import { ArrowBigUp } from "lucide-react";


export default function VoteButton({ 
  count, 
  onUpvote, 
  isUpvoted = false 
}: { 
  count: number; 
  onUpvote: () => void;
  isUpvoted?: boolean;
}) {
return (
<button 
  onClick={onUpvote} 
  className={`btn-ghost transition-colors ${
    isUpvoted 
      ? 'text-brand-primary' 
      : 'text-base-mute hover:text-brand-primary'
  }`}
  title={isUpvoted ? 'Remove upvote' : 'Upvote'}
>
  <ArrowBigUp 
    className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} 
  /> 
  {count}
</button>
);
}