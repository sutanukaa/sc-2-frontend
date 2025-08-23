import { Client, Account, Databases, Storage } from "node-appwrite";

// Server-side Appwrite client with API key
const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverStorage = new Storage(serverClient); // ✅ Added
export { serverClient };
