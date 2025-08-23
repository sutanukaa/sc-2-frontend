// /api/upload/route.ts - New endpoint for individual file uploads
import { NextResponse } from "next/server";
import { serverStorage } from "@/lib/appwrite-server";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileKey = formData.get("fileKey") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!fileKey) {
      return NextResponse.json({ error: "File key is required" }, { status: 400 });
    }

    // Upload file to Appwrite storage
    const uploaded = await serverStorage.createFile(
      BUCKET_ID,
      "unique()", // auto-generate file ID
      file
    );

    return NextResponse.json({ 
      success: true, 
      fileId: uploaded.$id,
      fileName: file.name,
      fileKey 
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
