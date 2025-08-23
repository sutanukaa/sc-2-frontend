import { NextResponse } from "next/server";
import { account, databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ROLES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ROLES_COLLECTION_ID!;

export async function GET() {
  try {
    // Get currently logged in user
    const user = await account.get();

    // Query roles collection by userId
    const result = await databases.listDocuments(
      DATABASE_ID,
      ROLES_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    // If no role record found -> default to USER
    const role = result.documents.length > 0 ? result.documents[0].role : "USER";

    return NextResponse.json({
      userId: user.$id,
      role: role,
    });
  } catch (error: unknown) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 }
    );
  }
}
