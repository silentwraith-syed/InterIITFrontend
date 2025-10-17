import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Node } from "../utils/tree";
import { timeAgo } from "../utils/time";
import { useComments } from "../store/comments";
import Avatar from "./Avatar";
import VoteButton from "./VoteButton";
import CommentEditor from "./CommentEditor";


export default function CommentItem({ node, postId, depth = 0 }: { node: Node; postId: string; depth?: number }) {
  const { upvote, add } = useComments()
  const [open, setOpen] = useState(true)
  const [replying, setReplying] = useState(false)

  // derive display data
  const name = node.user?.name || "Unknown"
  const avatar = node.user?.avatar || "https://i.pravatar.cc/150?u=placeholder"

  const indentClass = depth > 0 ? `ml-${depth * 4}` : "";

  return (
    <div className={`mt-3 ${indentClass}`}>
      <div className="flex gap-3">
        <Avatar src={avatar} alt={name} />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{name}</span>
            <span className="text-base-mute">· {timeAgo(node.created_at)}</span>
          </div>
          <p className="mt-1 leading-relaxed">{node.text}</p>
          <div className="mt-1 flex items-center gap-2">
            <VoteButton count={node.upvotes} onUpvote={() => upvote(node.id)} />
            <button className="btn-ghost" onClick={() => setReplying((v) => !v)}>
              Reply
            </button>
            {node.children.length > 0 && (
              <button className="btn-ghost" onClick={() => setOpen((v) => !v)}>
                {open ? "Collapse" : `Expand (${node.children.length})`}
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