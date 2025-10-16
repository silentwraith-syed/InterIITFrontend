import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comment, ID, SortKey } from "../types";


interface CommentState {
comments: Comment[];
sort: SortKey;
upvote: (id: ID) => void;
add: (payload: Omit<Comment, "id">) => void;
setAll: (data: Comment[]) => void;
setSort: (s: SortKey) => void;
}


function genId() {
return Math.random().toString(36).slice(2, 10);
}


export const useComments = create<CommentState>()(
persist(
(set, get) => ({
comments: [],
sort: "top",
setAll: (data) => set({ comments: data }),
setSort: (s) => set({ sort: s }),
upvote: (id) =>
set({
comments: get().comments.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c)),
}),
add: (payload) =>
set({
comments: [
...get().comments,
{ id: genId(), ...payload },
],
}),
}),
{ name: "interiit-comments" }
)
);