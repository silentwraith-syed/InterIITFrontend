import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Node } from "../utils/tree";
import { timeAgo } from "../utils/time";
import { useComments } from "../store/comments";
import Avatar from "./Avatar";
import VoteButton from "./VoteButton";
import CommentEditor from "./CommentEditor";
import usersData from "../data/users.json";

export default function CommentItem({ node, postId, depth = 0 }: { node: Node; postId: string; depth?: number }) {
  const [open, setOpen] = useState(true);
  const [replying, setReplying] = useState(false);
  const upvote = useComments((s) => s.upvote);
  const add = useComments((s) => s.add);

  const user = usersData.find((u) => u.id === node.user_id) || {
    id: node.user_id,
    name: "Unknown",
    avatar: "https://i.pravatar.cc/150?img=1",
    created_at: new Date().toISOString(),
  };

  const indentClass = depth > 0 ? "ml-8 border-l-2 border-base-300 pl-4" : "";

  return (
    <div className={indentClass}>
      <div className="flex gap-3">
        <Avatar src={user.avatar} alt={user.name} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
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
                const postId = (document.querySelector('[data-post-id]') as HTMLElement)?.dataset.postId as string
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