import { databases, ID } from "@/lib/appwrite";
import { v4 as uuidv4 } from "uuid";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const INVITES_COLLECTION =
  process.env.NEXT_PUBLIC_APPWRITE_INVITES_COLLECTION_ID!;

export async function createInvite(
  orgId: string,
  email: string,
  createdBy: string
) {
  const token = uuidv4();
  const expiredAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days

  const invite = await databases.createDocument(
    DATABASE_ID,
    INVITES_COLLECTION,
    ID.unique(),
    {
      org_id: orgId,
      email,
      token,
      expired_at: expiredAt,
      status: "pending",
      created_by: createdBy,
    }
  );

  return invite;
}
