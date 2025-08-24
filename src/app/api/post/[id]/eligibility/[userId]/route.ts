// app/api/post/[id]/eligibility/[userId]/route.ts
import { getPost } from "@/collections/post";
import { userDB } from "@/collections/users";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const { id, userId } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch post details
    let post;
    try {
      post = await getPost(id);
    } catch (error) {
      console.error("Error fetching post:", error);
      return NextResponse.json(
        { error: "Failed to fetch post details" },
        { status: 500 }
      );
    }

    // Fetch user details
    let user;
    try {
      user = await userDB.get(userId);
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: "Failed to fetch user details" },
        { status: 500 }
      );
    }

    // Calculate average CGPA from semester GPAs
    const semesterGPAs = [user.sem1, user.sem2, user.sem3, user.sem4, user.sem5, user.sem6];
    const validGPAs = semesterGPAs
      .filter((gpa): gpa is number => gpa !== undefined && gpa !== null && gpa > 0);
    const avgCGPA = validGPAs.length > 0 
      ? validGPAs.reduce((sum: number, gpa: number) => sum + gpa, 0) / validGPAs.length 
      : 0;

    // Calculate active backlogs (semesters with GPA = 0)
    const activeBacklogs = semesterGPAs.filter(gpa => gpa === 0).length;

    // Prepare user data for eligibility check (excluding individual semester GPAs)
    const userDataForEligibility = {
      id: user.$id,
      name: user.name,
      course: user.course || "Not specified",
      stream: user.stream || "Not specified",
      batch: user.batch || "Not specified",
      institute: user.institute || "Not specified",
      avg_cgpa: Math.round(avgCGPA * 100) / 100, // Round to 2 decimal places
      activeBacklogs: activeBacklogs,
      skillsCount: 0, // This will be calculated by the backend
      skills: [] // This will be populated by the backend
    };

    // Prepare post data for eligibility check
    const postDataForEligibility = {
      postId: post.$id,
      title: post.title,
      type: post.type,
      criteria: post.criteria || {},
      eligibility: post.eligibility || {}
    };

    // Combine user and post data
    const eligibilityPayload = {
      user: userDataForEligibility,
      post: postDataForEligibility
    };

    console.log('=== ELIGIBILITY API DEBUG ===');
    console.log('Post ID:', id);
    console.log('User ID:', userId);
    console.log('Complete eligibility payload:', JSON.stringify(eligibilityPayload, null, 2));
    console.log('=============================');

    // Send to backend for eligibility checking
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    const apiEndpoint = backendUrl.endsWith('/') 
      ? `${backendUrl}job/eligibility`
      : `${backendUrl}/job/eligibility`;

    console.log(`Calling backend eligibility API: ${apiEndpoint}`);

    try {
      const eligibilityResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eligibilityPayload),
      });

      if (eligibilityResponse.ok) {
        const eligibilityData = await eligibilityResponse.json();
        return NextResponse.json(eligibilityData);
      } else {
        const errorText = await eligibilityResponse.text();
        console.error(`Backend eligibility API responded with status ${eligibilityResponse.status}:`, errorText);
        return NextResponse.json(
          { error: `Failed to check eligibility: ${eligibilityResponse.status}` },
          { status: 500 }
        );
      }
    } catch (backendError) {
      console.error("Backend eligibility API failed:", backendError);
      return NextResponse.json(
        { error: "Backend eligibility service unavailable" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Eligibility check failed:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
