// app/api/posts/route.ts
import { createPost } from "@/collections/post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      org_id,
      created_by,
      company_name,
      role,
      description,
      criteria,
      duration,
      summarisation,
      mail_attachment_ref,
      attachment_1_desc,
      attachment_2_desc,
    } = body;

    if (!org_id || !created_by || !company_name || !role || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await createPost({
      org_id,
      created_by,
      company_name,
      role,
      description,
      criteria,
      duration,
      summarisation,
      mail_attachment_ref,
      attachment_1_desc,
      attachment_2_desc,
    });

    return NextResponse.json({
      message: "Post created successfully",
      post,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
