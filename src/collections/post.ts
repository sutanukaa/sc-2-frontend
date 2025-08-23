// lib/post.ts
import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const POSTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!;

export async function createPost(data: {
  org_id: string;
  created_by: string;
  company_name: string;
  role: string;
  description: string;
  criteria?: string;
  duration?: string;
  summarisation?: string;
  mail_attachment_ref?: string;
  attachment_1_desc?: string;
  attachment_2_desc?: string;
}) {
  const post = await databases.createDocument(
    DATABASE_ID,
    POSTS_COLLECTION_ID,
    ID.unique(),
    {
      ...data,
      status: "active",
    }
  );
  return post;
}

export async function getPost(postId: string) {
  const post = await databases.getDocument(
    DATABASE_ID,
    POSTS_COLLECTION_ID,
    postId
  );
  return post;
}

export async function getAllPosts() {
  const response = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
    Query.orderDesc("$createdAt"),
  ]);
  return response;
}
  