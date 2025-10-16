import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildTree } from "../utils/tree";
import { useComments } from "../store/comments";
import CommentItem from "./CommentItem";

export default function CommentTree() {
  const comments = useComments((s) => s.comments);
  const sort = useComments((s) => s.sort);

  const tree = useMemo(() => {
    const nodes = buildTree(comments);
    if (sort === "new") {
      return [...nodes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (sort === "top") {
      return [...nodes].sort((a, b) => b.upvotes - a.upvotes);
    }
    if (sort === "replies") {
      return [...nodes].sort((a, b) => b.children.length - a.children.length);
    }
    return nodes;
  }, [comments, sort]);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tree.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CommentItem node={node} depth={0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}