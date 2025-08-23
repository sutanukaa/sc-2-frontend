import { NextResponse } from "next/server";
import { serverDatabases, serverStorage } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // ✅ handles both JSON + File
    const userId = formData.get("userId") as string;
    const resumeFile = formData.get("resume") as File | null;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let resumeFileId: string | null = null;

    // ✅ If resume is uploaded, save to bucket
    if (resumeFile) {
      const uploaded = await serverStorage.createFile(
        BUCKET_ID,
        "unique()", // auto-generate file ID
        resumeFile
      );
      resumeFileId = uploaded.$id;
    }

    // ✅ Update user document
    const updated = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        isCompleted: true,
        ...(resumeFileId ? { resumeFileId } : {}), // save file reference
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
