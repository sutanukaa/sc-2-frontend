import { NextResponse } from "next/server";
import { serverDatabases } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user document
    const updated = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        ...updateData,
        isCompleted: true,
        // updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update user profile" },
      { status: 500 }
    );
  }
}
