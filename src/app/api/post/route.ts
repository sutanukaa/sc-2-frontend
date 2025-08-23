// app/api/posts/route.ts
import { createPost, getAllPosts } from "@/collections/post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description, // Only accept title and description from request body
      userId, // Add userId to get author information
    } = body;

    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, and userId" },
        { status: 400 }
      );
    }

    // Fetch user information for author
    let authorInfo = null;
    try {
      const userResponse = await fetch(`${req.url.replace('/api/post', '/api/user')}/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        authorInfo = {
          name: userData.name,
          avatar: userData.avatar || undefined,
        };
      } else {
        return NextResponse.json(
          { error: "Failed to fetch user information" },
          { status: 400 }
        );
      }
    } catch (userError) {
      console.error("User fetch failed:", userError);
      return NextResponse.json(
        { error: "User service unavailable" },
        { status: 500 }
      );
    }

    // Send title and description to backend for processing
    let extractedData = null;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        return NextResponse.json(
          { error: "Backend URL not configured" },
          { status: 500 }
        );
      }

      // console.log(`${backendUrl}job/summarize`);

      const summarizeResponse = await fetch(`${backendUrl}job/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (summarizeResponse.ok) {
        const summarizeData = await summarizeResponse.json();
        // Extract data from the summary object
        if (summarizeData.summary) {
          extractedData = summarizeData.summary;
        } else {
          return NextResponse.json(
            { error: "Invalid backend response format" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Failed to process data with backend" },
          { status: 500 }
        );
      }
    } catch (summarizeError) {
      console.error("Backend processing failed:", summarizeError);
      return NextResponse.json(
        { error: "Backend service unavailable" },
        { status: 500 }
      );
    }

    // Validate required fields from backend response (author info comes from user controller)
    if (!extractedData.type) {
      return NextResponse.json(
        { error: "Backend response missing required type field" },
        { status: 500 }
      );
    }

    const post = await createPost({
      title,
      content: description, // Convert description back to content for DB
      company: extractedData.company,
      website: extractedData.website,
      registration_link: extractedData.registration_link,
      role: extractedData.role,
      ctc: extractedData.ctc,
      type: extractedData.type,
      criteria: extractedData.criteria,
      responsibilities: extractedData.responsibilities,
      benefits: extractedData.benefits,
      applicationProcess: extractedData.applicationProcess,
      eligibility: extractedData.eligibility,
      author: authorInfo, // Use author info from user controller
      timestamp: extractedData.timestamp || new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Post created successfully",
      post,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}
