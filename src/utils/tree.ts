import type { Comment } from "../types";


export interface Node extends Comment {
children: Node[];
}


export function buildTree(comments: Comment[]): Node[] {
const map = new Map<string, Node>();
const roots: Node[] = [];
comments.forEach((c) => map.set(c.id, { ...c, children: [] }));
map.forEach((node) => {
if (node.parent_id) {
const parent = map.get(node.parent_id);
if (parent) parent.children.push(node);
else roots.push(node); // orphan safeguard
} else {
roots.push(node);
}
});
// stable order by created_at asc at each level by default
const sortRec = (arr: Node[]) => {
arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
arr.forEach((n) => sortRec(n.children));
};
sortRec(roots);
return roots;
}