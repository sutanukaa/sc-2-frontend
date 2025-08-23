// collections/users.ts

import { databases } from "@/lib/appwrite";

export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export interface UserData {
  id: string; // Auth userId
  name: string;
  email: string;
  invite?: string[];
  org_id?: string;
  gender?: "male" | "female" | "other";
  course?: string;
  stream?: string;
  batch?: string;
  institute?: string;
  phone?: string;
  address?: string;
  dob?: string;
  active_backlog?: number;
  resume_file_id?: string;
  isCompleted: boolean; // For onboarding check
  createdAt?: string;
  updatedAt?: string;
}

export const userDB = {
  get: async (id: string): Promise<UserData> => {
    try {
      const doc = await databases.getDocument<UserData | any>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id
      );
      return doc;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  create: async (
    id: string,
    data: Omit<UserData, "createdAt" | "updatedAt">
  ): Promise<UserData> => {
    try {
      const now = new Date().toISOString();
      const userData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const doc = await databases.createDocument<UserData | any>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id,
        userData
      );
      return doc;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<UserData>): Promise<UserData> => {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const doc = await databases.updateDocument<UserData | any>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        id,
        updateData
      );
      return doc;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  list: async (queries?: string[]) => {
    try {
      return await databases.listDocuments<UserData | any>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        queries
      );
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },
};
