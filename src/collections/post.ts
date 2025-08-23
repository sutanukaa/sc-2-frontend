// collections/post.ts
import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const POSTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!;

export async function createPost(data: {
  title: string;
  content: string;
  summary?: string; // Add summary field
  company?: string;
  website?: string;
  registration_link?: string;
  role?: string;
  ctc?: string;
  type:
    | "INTERNSHIP"
    | "JOB"
    | "ANNOUNCEMENT"
    | "OPPORTUNITY"
    | "DEADLINE"
    | "UPDATE";
  criteria?: {
    cgpa?: number;
    backlogs?: number;
    skills?: string[];
    courses?: string[];
    experience?: string;
  };
  author: {
    name: string;
    avatar?: string;
  };
  responsibilities?: string[];
  benefits?: string[];
  applicationProcess?: string[];
  eligibility?: {
    minCGPA?: string;
    branches?: string[];
    batch?: string[];
  };
  timestamp: string;
}) {
  const post = await databases.createDocument(
    DATABASE_ID,
    POSTS_COLLECTION_ID,
    ID.unique(),
    {
      ...data,
    }
  );
  return post;
}

export async function getPost(postId: string) {
  return databases.getDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId);
}

export async function getAllPosts() {
  return databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
    Query.orderDesc("$createdAt"),
  ]);
}
