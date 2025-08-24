"use client";
import React, { useState, useEffect, useCallback } from "react";
import parse from "html-react-parser";
import {
  ArrowLeft,
  Clock,
  Building,
  Award,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
} from "lucide-react";
import { useParams } from "next/navigation";
import { account } from "@/lib/appwrite";

interface UserStats {
  id: string;
  name: string;
  course: string;
  stream: string;
  batch: string;
  institute: string;
  avg_cgpa: number;
  activeBacklogs: number;
  skillsCount: number;
  skills: Array<{
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  }>;
  placementStatus: "eligible" | "pending" | "placed";
  appliedJobs: number;
  interviewsScheduled: number;
}

interface PostDetail {
  $id: string;
  title: string;
  content: string;
  company?: string;
  website?: string;
  registration_link?: string;
  role?: string;
  ctc?: string;
  type:
    | "INTERNSHIP"
    | "JOB"
    | "ANNOUNCEMENT"
    | "OPPORTUNITY"
    | "DEADLINE"
    | "UPDATE";
  criteria?: {
    cgpa?: number;
    backlogs?: number;
    skills?: string[];
    courses?: string[];
    experience?: string;
  };
  author: {
    name: string;
    avatar?: string;
  };
  responsibilities?: string[];
  benefits?: string[];
  applicationProcess?: string[];
  eligibility?: {
    minCGPA?: string;
    branches?: string[];
    batch?: string[];
  };
  timestamp: string;
  $createdAt: string;
}

interface EligibilityCheck {
  isEligible: boolean;
  score: number;
  breakdown: {
    cgpa: { status: "pass" | "fail" | "partial"; message: string };
    backlogs: { status: "pass" | "fail"; message: string };
    skills: {
      status: "pass" | "fail" | "partial";
      message: string;
      matchedSkills: string[];
      missingSkills: string[];
    };
    course: { status: "pass" | "fail"; message: string };
  };
  recommendations: string[];
}

interface StudyPlan {
  id: string;
  title: string;
  estimatedTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    description: string;
    resources: Array<{
      title: string;
      url: string;
      type: "article" | "video" | "tutorial" | "documentation";
    }>;
  }>;
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [activeTab, setActiveTab] = useState<"post" | "summarise" | "planner">(
    "post"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const mockUserStats: UserStats = {
  //   id: "user-1",
  //   name: "Soumyaraj Bag",
  //   course: "Bachelor of Technology",
  //   stream: "Computer Science Engineering",
  //   batch: "2026",
  //   institute: "RCC Institute of Information Technology",
  //   avg_cgpa: 8.2,
  //   activeBacklogs: 1,
  //   skillsCount: 12,
  //   skills: [
  //     { name: "JavaScript", level: "Advanced" },
  //     { name: "React", level: "Intermediate" },
  //     { name: "Python", level: "Advanced" },
  //     { name: "Node.js", level: "Intermediate" },
  //     { name: "SQL", level: "Beginner" },
  //   ],
  //   placementStatus: "eligible",
  //   appliedJobs: 8,
  //   interviewsScheduled: 3,
  // };

  // const mockEligibility: EligibilityCheck = {
  //   isEligible: false,
  //   score: 75,
  //   breakdown: {
  //     cgpa: {
  //       status: "pass",
  //       message: "Your CGPA (8.2) meets the minimum requirement (8.0)",
  //     },
  //     backlogs: {
  //       status: "fail",
  //       message: "You have 1 active backlog, but 0 backlogs are required",
  //     },
  //     skills: {
  //       status: "partial",
  //       message: "3 out of 5 required skills matched",
  //       matchedSkills: ["JavaScript", "Python", "Data Structures"],
  //       missingSkills: ["Algorithms", "System Design"],
  //     },
  //     course: {
  //       status: "pass",
  //       message: "Your course (Computer Science Engineering) is eligible",
  //     },
  //   },
  //   recommendations: [
  //     "Clear your active backlog before applying",
  //     "Study Algorithms and System Design fundamentals",
  //     "Practice coding problems on platforms like LeetCode",
  //     "Build projects showcasing system design skills",
  //   ],
  // };

  const mockStudyPlan: StudyPlan = {
    id: "plan-1",
    title: "Google SDE Preparation Plan",
    estimatedTime: "4-6 weeks",
    difficulty: "Medium",
    modules: [
      {
        id: "module-1",
        title: "Data Structures & Algorithms Fundamentals",
        duration: "2 weeks",
        description:
          "Master essential DSA concepts required for Google interviews",
        resources: [
          {
            title: "Introduction to Algorithms (CLRS Book)",
            url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
            type: "article",
          },
          {
            title: "DSA Video Course by Abdul Bari",
            url: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ",
            type: "video",
          },
          {
            title: "LeetCode Problems – Practice DSA",
            url: "https://leetcode.com/problemset/all/",
            type: "tutorial",
          },
          {
            title: "GeeksforGeeks DSA Self-Paced Course",
            url: "https://practice.geeksforgeeks.org/courses/dsa-self-paced",
            type: "tutorial",
          },
          {
            title: "Big-O Cheat Sheet",
            url: "https://www.bigocheatsheet.com/",
            type: "article",
          },
          {
            title: "InterviewBit DSA Practice",
            url: "https://www.interviewbit.com/practice/",
            type: "tutorial",
          },
        ],
      },
      {
        id: "module-2",
        title: "System Design Basics",
        duration: "1 week",
        description: "Learn system design principles and common patterns",
        resources: [
          { title: "System Design Primer", url: "#", type: "documentation" },
          { title: "Scalability Patterns", url: "#", type: "article" },
        ],
      },
      {
        id: "module-3",
        title: "Mock Interviews",
        duration: "1 week",
        description: "Practice with mock technical interviews",
        resources: [
          { title: "Pramp Mock Interviews", url: "#", type: "tutorial" },
          { title: "InterviewBit Practice", url: "#", type: "tutorial" },
        ],
      },
    ],
  };

  // Fetch post data from API
  const fetchPostData = useCallback(async () => {
    if (!postId) return;

    try {
      setError(null);
      const response = await fetch(`/api/post/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const postData = await response.json();
      setPost(postData);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch post");
    }
  }, [postId]);

  const fetchUserData = useCallback(async () => {
    try {
      // Fetch the logged-in user from Appwrite
      const userDetails = await account.get();
      const userId = userDetails.$id;

      // Fetch additional user data from your API
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();

      setUserStats({
        id: userData.$id,
        name: userData.name,
        course: userData.course,
        stream: userData.stream,
        batch: userData.batch,
        institute: userData.institute,
        avg_cgpa: userData.avg_cgpa,
        activeBacklogs: userData.activeBacklogs,
        skillsCount: userData.skills?.length || 0,
        skills: userData.skills || [],
        placementStatus: "pending",
        appliedJobs: 0,
        interviewsScheduled: 0,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      // Optionally, set fallback user stats here
      // setUserStats(userDetails);
    }
  }, []);

  const fetchEligibilityData = useCallback(async () => {
    if (!postId || !userStats) return;

    try {
      setError(null);

      // Call your API route
      const response = await fetch(
        `/api/post/${postId}/eligibility/${userStats.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch eligibility data");
      }

      const eligibilityData = await response.json();
      setEligibility(eligibilityData);
    } catch (err) {
      console.error("Error fetching eligibility data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch eligibility data"
      );
    }
  }, [postId, userStats]);

  // Fetch study plan data (keeping mock for now as it's not part of post API)
  const fetchStudyPlanData = useCallback(async () => {
    try {
      // For now, using mock data since study plan API is separate
      // TODO: Implement real study plan API call
      setStudyPlan(mockStudyPlan);
    } catch (err) {
      console.error("Error fetching study plan data:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchPostData();
        await fetchUserData();
      } catch (error) {
        console.error("Error loading post or user:", error);
        setError("Failed to load post or user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      loadData();
    }
  }, [postId, fetchPostData, fetchUserData]);

  // Fetch eligibility when both post and userStats are available
  useEffect(() => {
    if (post && userStats) {
      fetchEligibilityData();
    }
  }, [post, userStats, fetchEligibilityData]);

  const handleApply = async () => {
    if (post) {
      try {
        const response = await fetch(`/api/posts/${postId}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          alert("Application submitted successfully!");
          setPost((prev) => (prev ? { ...prev, hasUserApplied: true } : null));
        }
      } catch (error) {
        console.error("Error applying:", error);
        alert("Failed to submit application");
      }
    }
  };

  const getEligibilityColor = (isEligible: boolean) => {
    return isEligible
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getStatusIcon = (status: "pass" | "fail" | "partial") => {
    switch (status) {
      case "pass":
        return <CheckCircle className='w-4 h-4 text-green-400' />;
      case "fail":
        return <XCircle className='w-4 h-4 text-red-400' />;
      case "partial":
        return <AlertCircle className='w-4 h-4 text-yellow-400' />;
    }
  };

  const PostTab: React.FC = () => (
    <div className='space-y-6'>
      {isLoading ? (
        <div className='bg-gray-900 rounded-xl p-12 border border-gray-800 text-center'>
          <div className='animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading post details...</p>
        </div>
      ) : error ? (
        <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4'>
          <p className='text-red-400 text-sm mb-3'>{error}</p>
          <button
            onClick={fetchPostData}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
          >
            Retry
          </button>
        </div>
      ) : !post ? (
        <div className='bg-gray-900 rounded-xl p-12 border border-gray-800 text-center'>
          <div className='w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Building className='w-12 h-12 text-gray-500' />
          </div>
          <h2 className='text-2xl font-bold text-white mb-4'>Post Not Found</h2>
          <p className='text-gray-400 mb-8 max-w-md mx-auto'>
            The post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={fetchPostData}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className='bg-gray-900 rounded-xl p-6 border border-gray-800'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl'>
                  {post.company?.charAt(0) || "P"}
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-white mb-2'>
                    {post.title}
                  </h1>
                  <div className='flex items-center gap-4 text-sm text-gray-400'>
                    {post.company && (
                      <span className='flex items-center gap-1'>
                        <Building className='w-4 h-4' />
                        {post.company}
                      </span>
                    )}
                    {post.website && (
                      <span className='flex items-center gap-1'>
                        <ExternalLink className='w-4 h-4' />
                        <a
                          href={post.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:text-blue-400 transition-colors'
                        >
                          Company Website
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='text-right'>
                {post.ctc && (
                  <div className='text-lg font-semibold text-white mb-1'>
                    {post.ctc}
                  </div>
                )}
                {post.role && (
                  <div className='text-sm text-gray-400'>Role: {post.role}</div>
                )}
              </div>
            </div>

            <div className='mb-6 p-4 bg-gray-800 rounded-lg'>
              {parse(post.content)}
            </div>

            {/* Key Responsibilities - Only show if available */}
            {post.responsibilities && post.responsibilities.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  Key Responsibilities
                </h3>
                <ul className='space-y-2'>
                  {post.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className='text-gray-300 flex items-start gap-2'
                    >
                      <span className='w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0'></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks - Only show if available */}
            {post.benefits && post.benefits.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  Benefits & Perks
                </h3>
                <ul className='space-y-2'>
                  {post.benefits.map((item, index) => (
                    <li
                      key={index}
                      className='text-gray-300 flex items-start gap-2'
                    >
                      <span className='w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0'></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Process - Only show if available */}
            {post.applicationProcess && post.applicationProcess.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  Application Process
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {post.applicationProcess.map((step, index) => (
                    <div key={index} className='flex items-center'>
                      <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium'>
                        {index + 1}
                      </div>
                      <span className='ml-2 text-gray-300 text-sm'>{step}</span>
                      {post.applicationProcess &&
                        index < post.applicationProcess.length - 1 && (
                          <div className='mx-3 w-4 h-0.5 bg-gray-600'></div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const SummariseTab: React.FC = () => (
    <div className='space-y-6'>
      {eligibility && (
        <div className='bg-gray-900 rounded-xl p-6 border border-gray-800'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-white'>
              Eligibility Analysis
            </h2>
            <div
              className={`px-4 py-2 rounded-full border ${getEligibilityColor(
                eligibility.isEligible
              )}`}
            >
              <span className='font-medium'>
                {eligibility.isEligible ? "Eligible" : "Not Eligible"} (
                {eligibility.score}% match)
              </span>
            </div>
          </div>

          <div className='grid gap-4 mb-6'>
            {Object.entries(eligibility.breakdown).map(([key, details]) => (
              <div
                key={key}
                className='flex items-start gap-3 p-4 bg-gray-800 rounded-lg'
              >
                {getStatusIcon(details.status)}
                <div className='flex-1'>
                  <h4 className='font-medium text-white capitalize mb-1'>
                    {key} Check
                  </h4>
                  <p className='text-sm text-gray-300'>{details.message}</p>
                  {key === "skills" && "matchedSkills" in details && (
                    <div className='mt-2 space-y-1'>
                      {details.matchedSkills.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          <span className='text-xs text-green-400'>
                            Matched:
                          </span>
                          {details.matchedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className='px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {details.missingSkills.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          <span className='text-xs text-red-400'>Missing:</span>
                          {details.missingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className='px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {eligibility.recommendations.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold text-white mb-3'>
                Recommendations
              </h3>
              <div className='space-y-2'>
                {eligibility.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-2 text-gray-300'
                  >
                    <Target className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                    <span className='text-sm'>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const PlannerTab: React.FC = () => (
    <div className='space-y-6'>
      {studyPlan && (
        <div className='bg-gray-900 rounded-xl p-6 border border-gray-800'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-bold text-white'>
                {studyPlan.title}
              </h2>
              <div className='flex items-center gap-4 mt-2 text-sm text-gray-400'>
                <span className='flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  {studyPlan.estimatedTime}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    studyPlan.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : studyPlan.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {studyPlan.difficulty}
                </span>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-white'>
                {studyPlan.modules.length}
              </div>
              <div className='text-sm text-gray-400'>Modules</div>
            </div>
          </div>

          <div className='space-y-4'>
            {studyPlan.modules.map((module, index) => (
              <div
                key={module.id}
                className='border border-gray-800 rounded-lg p-4'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center'>
                      <span className='text-sm font-medium text-gray-400'>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className='font-medium text-white'>{module.title}</h4>
                      <p className='text-sm text-gray-400 mb-2'>
                        {module.description}
                      </p>
                      <div className='flex items-center gap-4 text-xs text-gray-500'>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='ml-11'>
                  <h5 className='text-sm font-medium text-gray-300 mb-2'>
                    Resources:
                  </h5>
                  <div className='space-y-2'>
                    {module.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        className='flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors'
                      >
                        <ExternalLink className='w-3 h-3' />
                        <span>{resource.title}</span>
                        <span className='px-1 py-0.5 bg-gray-700 text-gray-300 rounded text-xs'>
                          {resource.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black text-white'>
        <div className='absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>
        <div className='relative z-10 max-w-7xl mx-auto p-6'>
          <div className='animate-pulse space-y-6'>
            <div className='h-8 bg-gray-700 rounded w-1/2'></div>
            <div className='h-64 bg-gray-800 rounded-xl'></div>
            <div className='flex gap-8'>
              <div className='flex-1 space-y-6'>
                <div className='h-96 bg-gray-800 rounded-xl'></div>
              </div>
              <div className='w-80'>
                <div className='h-64 bg-gray-800 rounded-xl'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post || !userStats || !eligibility) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Post not found</h1>
          <p className='text-gray-400'>
            The requested post could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>

      <div className='relative z-10'>
        <header className='border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20'>
          <div className='max-w-7xl mx-auto px-6 py-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => window.history.back()}
                className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back</span>
              </button>
              <div className='flex-1'>
                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent'>
                  {post.role}
                </h1>
                <p className='text-sm text-gray-400'>{post.company}</p>
              </div>
            </div>
          </div>
        </header>

        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='flex gap-8'>
            <main className='flex-1'>
              <div className='mb-6'>
                <div className='flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit'>
                  {(["post", "summarise", "planner"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className='tab-content'>
                {activeTab === "post" && <PostTab />}
                {activeTab === "summarise" && <SummariseTab />}
                {activeTab === "planner" && <PlannerTab />}
              </div>
            </main>

            <aside className='w-80 space-y-6'>
              <div className='bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                    {userStats.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className='font-semibold text-white'>
                      {userStats.name}
                    </h3>
                    <p className='text-sm text-gray-400'>{userStats.stream}</p>
                  </div>
                </div>

                <div className='space-y-4 mb-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-gray-400'>
                      <Award className='w-4 h-4' />
                      <span className='text-sm'>CGPA</span>
                    </div>
                    <span className='text-white text-sm font-medium'>
                      {userStats.avg_cgpa}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-gray-400'>
                      <TrendingUp className='w-4 h-4' />
                      <span className='text-sm'>Skills</span>
                    </div>
                    <span className='text-white text-sm font-medium'>
                      {userStats.skillsCount}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-gray-400'>
                      <Clock className='w-4 h-4' />
                      <span className='text-sm'>Backlogs</span>
                    </div>
                    <span className='text-white text-sm font-medium'>
                      {userStats.activeBacklogs}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-400'>Eligibility</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getEligibilityColor(
                        eligibility.isEligible
                      )}`}
                    >
                      {eligibility.isEligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>
                </div>

                <div className='border-t border-gray-800 pt-4'>
                  <div className='space-y-3'>
                    {eligibility.isEligible ? (
                      <button
                        onClick={handleApply}
                        className='w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium'
                      >
                        Apply Now
                      </button>
                    ) : (
                      <div className='p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center'>
                        <XCircle className='w-5 h-5 text-red-400 mx-auto mb-1' />
                        <p className='text-sm text-red-400 mb-2'>
                          Not Eligible
                        </p>
                        <p className='text-xs text-gray-400'>
                          Check recommendations in Summarise tab
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria - Only show if available */}
              {post.criteria && (
                <div className='bg-gray-800 rounded-lg p-4 mb-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>
                    Eligibility Criteria
                  </h3>
                  <div className='space-y-3'>
                    {post.criteria.cgpa && (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Min CGPA</span>
                        <span className='text-white'>{post.criteria.cgpa}</span>
                      </div>
                    )}
                    {post.criteria.backlogs !== undefined && (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Max Backlogs</span>
                        <span className='text-white'>
                          {post.criteria.backlogs}
                        </span>
                      </div>
                    )}
                    {post.criteria.skills &&
                      post.criteria.skills.length > 0 && (
                        <div>
                          <span className='text-gray-400 block mb-2'>
                            Required Skills
                          </span>
                          <div className='flex flex-wrap gap-1'>
                            {post.criteria.skills.map((skill, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs border border-blue-500/30'
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {post.criteria.courses &&
                      post.criteria.courses.length > 0 && (
                        <div>
                          <span className='text-gray-400 block mb-2'>
                            Eligible Courses
                          </span>
                          <div className='flex flex-wrap gap-1'>
                            {post.criteria.courses.map((course, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs border border-green-500/30'
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {post.criteria.experience && (
                      <div>
                        <span className='text-gray-400 block mb-2'>
                          Experience Required
                        </span>
                        <span className='text-white text-sm'>
                          {post.criteria.experience}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Info - Only show if company details available */}
              {post.company && (
                <div className='bg-gray-800 rounded-lg p-4'>
                  <h3 className='font-semibold text-white mb-4'>
                    Company Info
                  </h3>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='text-2xl'>{post.company.charAt(0)}</div>
                    <div>
                      <h4 className='font-medium text-white'>{post.company}</h4>
                    </div>
                  </div>
                  {post.website && (
                    <div className='flex items-center gap-2 text-sm'>
                      <ExternalLink className='w-4 h-4 text-gray-400' />
                      <a
                        href={post.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-400 hover:text-blue-300 transition-colors'
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {post.registration_link && (
                    <div className='mt-3'>
                      <a
                        href={post.registration_link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                      >
                        Apply Now
                        <ExternalLink className='w-4 h-4' />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
