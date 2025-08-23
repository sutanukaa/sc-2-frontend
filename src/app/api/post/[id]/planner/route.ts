// app/api/posts/[id]/planner/route.ts
import { getPost } from "@/collections/post";
import { NextResponse } from "next/server";
import { userDB } from "@/collections/users"; // ✅ reference your existing userDB

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Extract userId from query params (e.g. ?userId=123)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch post from DB
    const post = await getPost(id);

    // ✅ Fetch user from DB
    const user = await userDB.get(userId);

    // ✅ Build payload (merge user + post)
    const payload = {
      course: user.course,
      stream: user.stream,
      //   avg_cgpa: user.avg_cgpa,
      //   activeBacklogs: user.activeBacklogs,
      //   skills: user.skills ?? [],
      company: post.company ?? "Unknown",
      role: post.role ?? "N/A",
      ctc: post.ctc ?? "N/A",
      applicationProcess: post.applicationProcess ?? [],
      criteria: {
        skills: post.criteria?.skills ?? [],
        courses: post.criteria?.courses ?? [],
      },
    };

    // ✅ Send payload to AI backend
    const aiResponse = await fetch(process.env.AI_BACKEND_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const aiData = await aiResponse.json();

    return NextResponse.json({
      message: "Planner generated successfully",
      payload,
      aiResponse: aiData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
