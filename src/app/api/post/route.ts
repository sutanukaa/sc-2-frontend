// app/api/posts/route.ts
import { createPost, getAllPosts } from "@/collections/post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      company,
      website,
      registration_link,
      role,
      ctc,
      type,
      criteria,
      author,
      responsibilities,
      benefits,
      applicationProcess,
      eligibility,
      timestamp,
    } = body;

    if (
      !title ||
      !content ||
      !type ||
      !author?.name ||
      !author?.role ||
      !timestamp
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      content,
      company,
      website,
      registration_link,
      role,
      ctc,
      type,
      criteria,
      author,
      responsibilities,
      benefits,
      applicationProcess,
      eligibility,
      timestamp,
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

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
