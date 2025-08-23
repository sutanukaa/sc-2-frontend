import {
  Client,
  Account,
  Databases,
  OAuthProvider,
  Query,
  Permission,
  Role,
  ID,
} from "appwrite";

// Client-side Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Export utilities
export { client, OAuthProvider, Query, Permission, Role, ID };
