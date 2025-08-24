// collections/users.ts

import { databases } from "@/lib/appwrite";

export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export interface UserData {
  $id: string; // Document ID
  org_id?: string;
  name: string; // required
  gender?: "MALE" | "FEMALE" | "OTHER"; // enum
  course?: string;
  stream?: string;
  batch?: string;
  institute?: string;
  email: string; // required email
  phone?: string;
  address?: string;
  dob?: string; // datetime (stored as ISO string)
  active_backlog?: number; // integer
  resume_file_id?: string;
  isCompleted: boolean; // default false
  invite?: string[]; // array of strings, default empty
  updatedAt?: string;
  "10th"?: number; // double
  "12th"?: number; // double
  sem1?: number; // integer (but using number for consistency)
  sem2?: number; // double
  sem3?: number; // double
  sem4?: number; // double
  sem5?: number; // double
  sem6?: number; // double
  $createdAt?: string; // Appwrite auto-generated
  $updatedAt?: string; // Appwrite auto-generated
}

// Type for creating new user (without auto-generated fields)
export type CreateUserData = Omit<UserData, '$id' | '$createdAt' | '$updatedAt'>;

// Type for updating user (all fields optional except what's required)
export type UpdateUserData = Partial<Omit<UserData, '$id' | '$createdAt' | '$updatedAt'>>;

export const userDB = {
  get: async (id: string): Promise<UserData> => {
    try {
      const doc = await databases.getDocument<UserData>(
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
    data: CreateUserData
  ): Promise<UserData> => {
    try {
      const userData: CreateUserData = {
        ...data,
        isCompleted: data.isCompleted ?? false,
        invite: data.invite ?? [],
        updatedAt: new Date().toISOString(),
      };

      const doc = await databases.createDocument<UserData>(
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

  update: async (id: string, data: UpdateUserData): Promise<UserData> => {
    try {
      const updateData: UpdateUserData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const doc = await databases.updateDocument<UserData>(
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
      return await databases.listDocuments<UserData>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        queries
      );
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },

  // Helper method to get user by email
  getByEmail: async (email: string): Promise<UserData | null> => {
    try {
      const result = await databases.listDocuments<UserData>(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [`email=${email}`]
      );
      return result.documents.length > 0 ? result.documents[0] : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  },

  // Helper method to check if onboarding is completed
  isOnboardingCompleted: async (id: string): Promise<boolean> => {
    try {
      const user = await userDB.get(id);
      return user.isCompleted;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  },

  // Helper method to update academic results
  updateAcademicResults: async (
    id: string, 
    results: {
      "10th"?: number;
      "12th"?: number;
      sem1?: number;
      sem2?: number;
      sem3?: number;
      sem4?: number;
      sem5?: number;
      sem6?: number;
    }
  ): Promise<UserData> => {
    try {
      // Calculate active backlogs based on semester results
      const semesterResults = [
        results.sem1,
        results.sem2,
        results.sem3,
        results.sem4,
        results.sem5,
        results.sem6
      ];
      
      const activeBacklogs = semesterResults.filter(result => result === 0).length;

      const updateData: UpdateUserData = {
        ...results,
        active_backlog: activeBacklogs,
      };

      return await userDB.update(id, updateData);
    } catch (error) {
      console.error("Error updating academic results:", error);
      throw error;
    }
  },
};

// Export default for convenience
export default userDB;