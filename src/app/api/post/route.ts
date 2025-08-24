// app/api/posts/route.ts
import { createPost, getAllPosts } from "@/collections/post";
import { userDB } from "@/collections/users";
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

    // Fetch user information for author directly from Appwrite users collection
    let authorInfo = null;
    try {
      const userData = await userDB.get(userId);
      authorInfo = {
        name: userData.name,
        // Note: avatar field is not available in UserData interface
        // Using name as fallback for avatar display
      };
    } catch (userError) {
      console.error("User fetch failed:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user information" },
        { status: 400 }
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

      // Ensure proper URL formatting with forward slash
      const apiEndpoint = backendUrl.endsWith('/') 
        ? `${backendUrl}job/summarize`
        : `${backendUrl}/job/summarize`;

      console.log(`Calling backend API: ${apiEndpoint}`);

      const summarizeResponse = await fetch(apiEndpoint, {
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
        const errorText = await summarizeResponse.text();
        console.error(`Backend responded with status ${summarizeResponse.status}:`, errorText);
        return NextResponse.json(
          { error: `Failed to process data with backend: ${summarizeResponse.status}` },
          { status: 500 }
        );
      }
    } catch (summarizeError) {
      console.error("Backend processing failed:", summarizeError);
      
      // Provide more specific error messages based on error type
      let errorMessage = "Backend service unavailable";
      if (summarizeError instanceof TypeError && summarizeError.message.includes('fetch failed')) {
        errorMessage = "Cannot connect to backend service. Please check if the backend is running and the URL is correct.";
      } else if (summarizeError instanceof TypeError && summarizeError.message.includes('Invalid URL')) {
        errorMessage = "Invalid backend URL configuration. Please check NEXT_PUBLIC_BACKEND_URL environment variable.";
      }
      
      return NextResponse.json(
        { error: errorMessage },
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
      content: extractedData.content,
      company: extractedData.company,
      website: extractedData.website,
      registration_link: extractedData.registration_link,
      role: extractedData.role,
      ctc: extractedData.ctc,
      type: extractedData.type,
      // Sanitize criteria (especially skills) to satisfy Appwrite attribute constraints
      criteria: (() => {
        const criteria = extractedData.criteria || {};
        const sanitizeStringArray = (value: unknown, maxLen = 20): string[] | undefined => {
          if (!value) return undefined;
            // If backend returns a single comma separated string
          if (typeof value === 'string') {
            value = value.split(/[,\n]/).map((v: string) => v.trim()).filter(Boolean);
          }
          if (!Array.isArray(value)) return undefined;
          const cleaned = value
            .map((item: unknown) => {
              if (typeof item === 'string') return item.trim();
              if (item && typeof item === 'object' && 'name' in (item as Record<string, unknown>)) {
                const nameVal = (item as Record<string, unknown>).name;
                return typeof nameVal === 'string' ? nameVal.trim() : String(nameVal).trim();
              }
              return String(item).trim();
            })
            .filter((s: string) => s.length > 0)
            .map((s: string) => (s.length > maxLen ? s.slice(0, maxLen) : s));
          return cleaned.length ? cleaned : undefined;
        };

        const sanitized = {
          ...criteria,
          skills: sanitizeStringArray(criteria.skills, 20),
          courses: sanitizeStringArray(criteria.courses, 40),
        };
        return sanitized;
      })(),
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
