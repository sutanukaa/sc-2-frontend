import { NextRequest, NextResponse } from "next/server";
import { serverDatabases } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User data required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("email", user.email)]
    );

    let userDoc;

    if (existingUsers.total === 0) {
      // Create new user document
      userDoc = await serverDatabases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id, // Use the user's auth ID as document ID
        {
          email: user.email,
          name: user.name,
          isCompleted: false,
          // createdAt: new Date(),
        }
      );
      console.log("New user created:", userDoc.$id);
    } else {
      userDoc = existingUsers.documents[0];
      console.log("Existing user found:", userDoc.$id);
    }

    return NextResponse.json({
      success: true,
      user: userDoc,
      needsOnboarding: !userDoc.isCompleted,
    });
  } catch (error: any) {
    console.error("Server-side auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
