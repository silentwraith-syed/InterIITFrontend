import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Node } from "../utils/tree";
import { timeAgo } from "../utils/time";
import { useComments } from "../store/comments";
import Avatar from "./Avatar";
import VoteButton from "./VoteButton";
import CommentEditor from "./CommentEditor";


export default function CommentItem({ node, postId, depth = 0 }: { node: Node; postId: string; depth?: number }) {
  const { upvote, add, hasUpvoted } = useComments()
  const [open, setOpen] = useState(true)
  const [replying, setReplying] = useState(false)

  // derive display data
  const name = node.user?.name || "Unknown"
  const avatar = node.user?.avatar || "https://i.pravatar.cc/150?u=placeholder"

  const replyCount = node.children.length
  const isUpvoted = hasUpvoted(node.id)

  return (
    <div className={`mt-4 ${depth > 0 ? 'comment-nested' : ''}`}>
      <div className="flex gap-3">
        <Avatar src={avatar} alt={name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="font-medium text-base-text">{name}</span>
            <span className="text-base-mute">·</span>
            <span className="text-base-mute">{timeAgo(node.created_at)}</span>
          </div>
          <p className="mt-2 leading-relaxed text-base-text break-words">{node.text}</p>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <VoteButton 
              count={node.upvotes} 
              onUpvote={() => upvote(node.id)} 
              isUpvoted={isUpvoted}
            />
            <button 
              className="btn-ghost text-sm py-1 px-2" 
              onClick={() => setReplying((v) => !v)}
            >
              Reply
            </button>
            {replyCount > 0 && (
              <button 
                className="btn-ghost text-sm py-1 px-2" 
                onClick={() => setOpen((v) => !v)}
              >
                {open ? '▼' : '▶'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
          {replying && (
            <CommentEditor
              autoFocus
              onSubmit={async(text) => {
                setReplying(false);
                await add({ postId, parent_id: node.id, text })
              }}
            />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <CommentItem key={child.id} node={child} postId={postId} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}