import { NextResponse } from "next/server";
import { serverDatabases, serverStorage } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const updateDataString = formData.get("updateData") as string;
    const resumeFile = formData.get("resume") as File | null;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!updateDataString) {
      return NextResponse.json({ error: "Update data is required" }, { status: 400 });
    }

    // Parse the update data
    const updateData = JSON.parse(updateDataString);

    let resumeFileId: string | null = null;

    // Upload resume file if provided
    if (resumeFile) {
      try {
        const uploaded = await serverStorage.createFile(
          BUCKET_ID,
          "unique()", // auto-generate file ID
          resumeFile
        );
        resumeFileId = uploaded.$id;
      } catch (uploadError) {
        console.error("Resume upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload resume file" },
          { status: 500 }
        );
      }
    }

    // Prepare final update data
    const finalUpdateData = {
      ...updateData,
      ...(resumeFileId ? { resume_file_id: resumeFileId } : {}),
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };

    // Update user document in database
    const updated = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      finalUpdateData
    );

    return NextResponse.json({ 
      success: true, 
      user: updated,
      resumeFileId 
    });
  } catch (err: any) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update user profile" },
      { status: 500 }
    );
  }
}