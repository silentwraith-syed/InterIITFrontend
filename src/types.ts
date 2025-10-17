export type ID = string;


export interface User {
id: ID;
name: string;
avatar: string;
created_at: string;
}


export interface Comment {
  id: ID;
  parent_id: ID | null;
  text: string;
  upvotes: number;
  created_at: string;
  user_id: ID;
  user?: { id?: ID; name: string; avatar?: string; createdAt?: string }; // NEW
}



export interface Post {
id: ID;
title: string;
body: string;
image?: string;
created_at: string;
author_id: ID;
}


export type SortKey = "top" | "new" | "replies";