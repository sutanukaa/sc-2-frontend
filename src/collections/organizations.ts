// collections/organizations.ts

import { databases } from "@/lib/appwrite";

export const ORGANIZATIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_COLLECTION_ID!;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export interface OrganizationData {
  id: string;
  name: string;
  college: string;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}

export const orgDB = {
  get: async (id: string): Promise<OrganizationData> => {
    try {
      const doc = await databases.getDocument<OrganizationData | any>(
        DATABASE_ID,
        ORGANIZATIONS_COLLECTION_ID,
        id
      );
      return doc;
    } catch (error) {
      console.error("Error getting organization:", error);
      throw error;
    }
  },

  create: async (
    id: string,
    data: Omit<OrganizationData, "createdAt" | "updatedAt">
  ): Promise<OrganizationData> => {
    try {
      const now = new Date().toISOString();
      const OrganizationData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const doc = await databases.createDocument<OrganizationData | any>(
        DATABASE_ID,
        ORGANIZATIONS_COLLECTION_ID,
        id,
        OrganizationData
      );
      return doc;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  update: async (
    id: string,
    data: Partial<OrganizationData>
  ): Promise<OrganizationData> => {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const doc = await databases.updateDocument<OrganizationData | any>(
        DATABASE_ID,
        ORGANIZATIONS_COLLECTION_ID,
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
      await databases.deleteDocument(
        DATABASE_ID,
        ORGANIZATIONS_COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  },

  list: async (queries?: string[]) => {
    try {
      return await databases.listDocuments<OrganizationData | any>(
        DATABASE_ID,
        ORGANIZATIONS_COLLECTION_ID,
        queries
      );
    } catch (error) {
      console.error("Error listing organizations:", error);
      throw error;
    }
  },
};
