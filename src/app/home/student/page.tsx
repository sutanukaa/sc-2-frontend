"use client";
import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import {
  Calendar,
  Building,
  Award,
  TrendingUp,
  Clock,
  Bell,
  Search,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserStats {
  name: string;
  course: string;
  stream: string;
  batch: string;
  institute: string;
  cgpa: string;
  activeBacklogs: number;
  skillsCount: number;
  placementStatus: "eligible" | "pending" | "placed";
  appliedJobs: number;
  interviewsScheduled: number;
}

interface Organization {
  id: string;
  name: string;
  logo: string;
  type: "college" | "company";
  memberSince: string;
  totalMembers: number;
}

interface OrganizationInvite {
  id: string;
  organization: Organization;
  invitedBy: {
    name: string;
    role: string;
  };
  inviteDate: string;
  expiryDate: string;
  message?: string;
}

interface UserOrganizationStatus {
  isPartOfOrg: boolean;
  organization?: Organization;
  hasActiveInvite: boolean;
  activeInvite?: OrganizationInvite;
}

interface Post {
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

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userOrgStatus, setUserOrgStatus] =
    useState<UserOrganizationStatus | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isProcessingInvite, setIsProcessingInvite] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mockUserStats: UserStats = {
    name: "Soumyaraj Bag ",
    course: "Bachelor of Technology",
    stream: "Computer Science Engineering",
    batch: "2026",
    institute: "RCC Institute of Information Technology",
    cgpa: "8.2",
    activeBacklogs: 1,
    skillsCount: 25,
    placementStatus: "eligible",
    appliedJobs: 0,
    interviewsScheduled: 0,
  };

  const mockUserOrgStatus: UserOrganizationStatus = {
    isPartOfOrg: true,
    hasActiveInvite: false,
    organization: {
      id: "org-1",
      name: "RCCIIT Placement Cell",
      logo: "🏛️",
      type: "college",
      memberSince: "August 2020",
      totalMembers: 2847,
    },
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch("/api/post");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data.documents || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch posts from API
        await fetchPosts();

        // Set mock user data (keeping this for now as it's not part of the Posted  API)

        setUserStats(mockUserStats);
        setUserOrgStatus(mockUserOrgStatus);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAcceptInvite = async (inviteId: string) => {
    if (!userOrgStatus?.activeInvite) return;

    setIsProcessingInvite(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const updatedStatus: UserOrganizationStatus = {
        isPartOfOrg: true,
        hasActiveInvite: false,
        organization: {
          ...userOrgStatus.activeInvite.organization,
          memberSince: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        },
      };
      setUserOrgStatus(updatedStatus);
    } catch (error) {
      console.error("Failed to accept invite:", error);
    } finally {
      setIsProcessingInvite(false);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    setIsProcessingInvite(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserOrgStatus({
        isPartOfOrg: false,
        hasActiveInvite: false,
      });
    } catch (error) {
      console.error("Failed to decline invite:", error);
    } finally {
      setIsProcessingInvite(false);
    }
  };

  const getPostTypeColor = (type: Post["type"]) => {
    switch (type) {
      case "OPPORTUNITY":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "ANNOUNCEMENT":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "DEADLINE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "UPDATE":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "INTERNSHIP":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "JOB":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: UserStats["placementStatus"]) => {
    switch (status) {
      case "placed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "eligible":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp; // Return as-is if not a valid date
      }

      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      return timestamp; // Return as-is if parsing fails
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const PostSkeleton = () => (
    <div className='bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gray-700 rounded-full'></div>
          <div className='space-y-2'>
            <div className='h-4 bg-gray-700 rounded w-32'></div>
            <div className='h-3 bg-gray-700 rounded w-24'></div>
          </div>
        </div>
        <div className='h-6 bg-gray-700 rounded w-20'></div>
      </div>
      <div className='space-y-3'>
        <div className='h-6 bg-gray-700 rounded w-3/4'></div>
        <div className='h-4 bg-gray-700 rounded w-full'></div>
        <div className='h-4 bg-gray-700 rounded w-2/3'></div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>

      <div className='relative z-10'>
        <header className='border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20'>
          <div className='max-w-8xl mx-auto px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {/* Campus.IO Logo and Brand */}
                <div className='flex items-center space-x-3'>
                  <div className='relative group'>
                    {/* Main Logo Container */}
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3'>
                      <div className='w-6 h-6 bg-white rounded-lg flex items-center justify-center'>
                        <GraduationCap className='w-4 h-4 text-purple-600' />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse'></div>
                    <div
                      className='absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse'
                      style={{ animationDelay: "0.5s" }}
                    ></div>

                    {/* Glow Effect */}
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10'></div>
                  </div>

                  {/* Company Name with Creative Typography */}
                  <div className='relative group'>
                    <div className='flex items-baseline space-x-1'>
                      {/* Campus */}
                      <span className='text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight'>
                        Campus
                      </span>

                      {/* Dot Separator */}
                      <div className='relative'>
                        <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse'></div>
                        <div className='absolute inset-0 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75'></div>
                      </div>

                      {/* IO */}
                      <span className='text-2xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-tight'>
                        IO
                      </span>
                    </div>

                    {/* Subtitle */}
                    <div className='absolute -bottom-5 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1'>
                      <span className='text-xs font-medium bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent tracking-wider uppercase'>
                        Next-Gen Placement
                      </span>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10'></div>
                  </div>
                </div>

                {userOrgStatus?.isPartOfOrg && userOrgStatus.organization && (
                  <div className='flex items-center gap-2 text-gray-400'>
                    <span className='text-2xl'>
                      {userOrgStatus.organization.logo}
                    </span>
                    <span className='text-sm'>
                      {userOrgStatus.organization.name}
                    </span>
                  </div>
                )}
                {userOrgStatus?.hasActiveInvite &&
                  userOrgStatus.activeInvite && (
                    <div className='flex items-center gap-2 text-yellow-400'>
                      <span className='text-2xl'>
                        {userOrgStatus.activeInvite.organization.logo}
                      </span>
                      <span className='text-sm'>
                        Invite pending:{" "}
                        {userOrgStatus.activeInvite.organization.name}
                      </span>
                    </div>
                  )}
                {!userOrgStatus?.isPartOfOrg &&
                  !userOrgStatus?.hasActiveInvite && (
                    <div className='flex items-center gap-2 text-gray-500'>
                      <span className='text-sm'>
                        Not affiliated with any organization
                      </span>
                    </div>
                  )}
              </div>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search posts...'
                    className='pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors w-64'
                  />
                </div>
                <Bell className='w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' />
              </div>
            </div>
          </div>
        </header>

        <div className='w-full max-w-7xl mx-auto px-6 py-8'>
          <div className='flex gap-8'>
            <main className='flex-1 w-full'>
              <div className='space-y-6'>
                {isLoading ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : (
                  <>
                    {/* Scenario 1: User has active invite - Show invite card */}
                    {userOrgStatus?.hasActiveInvite &&
                      userOrgStatus.activeInvite && (
                        <div className='bg-gray-900 rounded-xl p-8 border border-yellow-500/30 text-center'>
                          <div className='w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl'>
                            {userOrgStatus.activeInvite.organization.logo}
                          </div>
                          <h2 className='text-2xl font-bold text-white mb-4'>
                            Organization Invitation
                          </h2>
                          <p className='text-gray-300 mb-6 mx-auto'>
                            You&apos;ve been invited to join{" "}
                            <strong>
                              {userOrgStatus.activeInvite.organization.name}
                            </strong>{" "}
                            by {userOrgStatus.activeInvite.invitedBy.name}.
                          </p>

                          <div className='bg-gray-800 rounded-lg p-6 mb-6 text-left mx-auto'>
                            <div className='space-y-3 text-sm'>
                              <div className='flex justify-between'>
                                <span className='text-gray-400'>
                                  Organization
                                </span>
                                <span className='text-white font-medium'>
                                  {userOrgStatus.activeInvite.organization.name}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-400'>Type</span>
                                <span className='text-white capitalize'>
                                  {userOrgStatus.activeInvite.organization.type}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-400'>Members</span>
                                <span className='text-white'>
                                  {userOrgStatus.activeInvite.organization.totalMembers.toLocaleString()}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-400'>
                                  Invited by
                                </span>
                                <span className='text-white'>
                                  {userOrgStatus.activeInvite.invitedBy.name}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-400'>
                                  Expires on
                                </span>
                                <span className='text-white'>
                                  {userOrgStatus.activeInvite.expiryDate}
                                </span>
                              </div>
                            </div>

                            {userOrgStatus.activeInvite.message && (
                              <div className='mt-4 pt-4 border-t border-gray-700'>
                                <p className='text-gray-300 text-sm italic'>
                                  &quot;{userOrgStatus.activeInvite.message}
                                  &quot;
                                </p>
                              </div>
                            )}
                          </div>

                          <div className='flex gap-4 justify-center'>
                            <button
                              onClick={() =>
                                handleAcceptInvite(
                                  userOrgStatus.activeInvite!.id
                                )
                              }
                              disabled={isProcessingInvite}
                              className='px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-colors font-medium'
                            >
                              {isProcessingInvite
                                ? "Processing..."
                                : "Accept Invitation"}
                            </button>
                            <button
                              onClick={() =>
                                handleDeclineInvite(
                                  userOrgStatus.activeInvite!.id
                                )
                              }
                              disabled={isProcessingInvite}
                              className='px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-colors font-medium'
                            >
                              {isProcessingInvite ? "Processing..." : "Decline"}
                            </button>
                          </div>
                        </div>
                      )}

                    {/* Scenario 2: User is part of organization - Show posts */}
                    {userOrgStatus?.isPartOfOrg &&
                      !userOrgStatus?.hasActiveInvite && (
                        <>
                          <div className='flex items-center justify-between w-full mb-6'>
                            <h2 className='text-2xl font-bold text-white'>
                              Latest Posts
                            </h2>
                            <button
                              onClick={fetchPosts}
                              disabled={isLoading}
                              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors'
                            >
                              <svg
                                className={`w-4 h-4 ${
                                  isLoading ? "animate-spin" : ""
                                }`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                />
                              </svg>
                              {isLoading ? "Loading..." : "Refresh"}
                            </button>
                          </div>

                          {error && (
                            <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6'>
                              <p className='text-red-400 text-sm'>{error}</p>
                              <button
                                onClick={fetchPosts}
                                className='mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
                              >
                                Retry
                              </button>
                            </div>
                          )}

                          {posts.length === 0 && !error ? (
                            <div className='bg-gray-900 rounded-xl p-12 border border-gray-800 border-dashed text-center'>
                              <div className='w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
                                <Building className='w-12 h-12 text-gray-500' />
                              </div>
                              <h2 className='text-2xl font-bold text-white mb-4'>
                                No Posts Available
                              </h2>
                              <p className='text-gray-400 mb-8 max-w-md mx-auto'>
                                There are no posts available at the moment.
                                Check back later for new opportunities and
                                announcements.
                              </p>
                            </div>
                          ) : (
                            posts.map((post) => (
                              <div
                                key={post.$id}
                                onClick={() => handlePostClick(post.$id)}
                                className='bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group'
                              >
                                <div className='space-y-4'>
                                  <div
                                    onClick={() => {
                                      router.push(`/posts/${post.$id}`);
                                    }}
                                  >
                                    <h3 className='text-lg font-semibold text-white mb-2'>
                                      {post.title}
                                    </h3>
                                    <p className='text-gray-400 text-sm'>
                                      {parse(post.content)}
                                    </p>
                                  </div>

                                  {/* Post Type Badge */}
                                  <div className='flex items-center gap-2'>
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(
                                        post.type
                                      )}`}
                                    >
                                      {post.type === "OPPORTUNITY"
                                        ? "Job Opportunity"
                                        : post.type === "ANNOUNCEMENT"
                                        ? "Announcement"
                                        : post.type === "UPDATE"
                                        ? "Update"
                                        : post.type === "DEADLINE"
                                        ? "Deadline"
                                        : post.type === "INTERNSHIP"
                                        ? "Internship"
                                        : post.type === "JOB"
                                        ? "Full-time Job"
                                        : "Post"}
                                    </span>
                                  </div>

                                  {/* Company and Role Display */}
                                  {post.company && (
                                    <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-3'>
                                      <div className='flex items-center gap-2 mb-2'>
                                        <Building className='w-4 h-4 text-blue-400' />
                                        <span className='text-sm font-medium text-blue-400'>
                                          Company Details
                                        </span>
                                      </div>
                                      <div className='space-y-2 text-sm text-white'>
                                        <div className='flex items-center gap-2'>
                                          <span className='text-gray-400'>
                                            Company:
                                          </span>
                                          <span className='font-medium'>
                                            {post.company}
                                          </span>
                                        </div>
                                        {post.role && (
                                          <div className='flex items-center gap-2'>
                                            <span className='text-gray-400'>
                                              Role:
                                            </span>
                                            <span className='font-medium'>
                                              {post.role}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* CTC Display for opportunities */}
                                  {post.ctc && (
                                    <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-3'>
                                      <div className='flex items-center gap-2 mb-2'>
                                        <Briefcase className='w-4 h-4 text-green-400' />
                                        <span className='text-sm font-medium text-green-400'>
                                          Compensation
                                        </span>
                                      </div>
                                      <p className='text-white font-semibold'>
                                        {post.ctc}
                                      </p>
                                    </div>
                                  )}

                                  {/* Eligibility Display for opportunities */}
                                  {post.eligibility && (
                                    <div className='bg-purple-500/10 border border-purple-500/30 rounded-lg p-3'>
                                      <div className='flex items-center gap-2 mb-2'>
                                        <GraduationCap className='w-4 h-4 text-purple-400' />
                                        <span className='text-sm font-medium text-purple-400'>
                                          Eligibility Criteria
                                        </span>
                                      </div>
                                      <div className='space-y-2 text-sm text-white'>
                                        {post.eligibility.minCGPA && (
                                          <div className='flex items-center gap-2'>
                                            <span className='text-gray-400'>
                                              Min CGPA:
                                            </span>
                                            <span className='font-medium'>
                                              {post.eligibility.minCGPA}
                                            </span>
                                          </div>
                                        )}
                                        {post.eligibility.branches &&
                                          post.eligibility.branches.length >
                                            0 && (
                                            <div className='flex items-center gap-2'>
                                              <span className='text-gray-400'>
                                                Branches:
                                              </span>
                                              <div className='flex flex-wrap gap-1'>
                                                {post.eligibility.branches.map(
                                                  (branch, index) => (
                                                    <span
                                                      key={index}
                                                      className='px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs border border-purple-500/30'
                                                    >
                                                      {branch}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        {post.eligibility.batch &&
                                          post.eligibility.batch.length > 0 && (
                                            <div className='flex items-center gap-2'>
                                              <span className='text-gray-400'>
                                                Batches:
                                              </span>
                                              <div className='flex flex-wrap gap-1'>
                                                {post.eligibility.batch.map(
                                                  (batch, index) => (
                                                    <span
                                                      key={index}
                                                      className='px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs border border-purple-500/30'
                                                    >
                                                      {batch}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Author and Time */}
                                  <div className='flex items-center justify-between pt-2 border-t border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                      <div className='flex items-center gap-2'>
                                        <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                                          {post.author.name.charAt(0)}
                                        </div>
                                        <div>
                                          <p className='text-white text-sm font-medium'>
                                            {post.author.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='flex items-center gap-2 text-gray-400 text-sm'>
                                      <Clock className='w-4 h-4' />
                                      {formatTimestamp(
                                        post.timestamp || post.$createdAt
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      )}

                    {/* Scenario 3: User not part of org and no invite - Show empty state */}
                    {!userOrgStatus?.isPartOfOrg &&
                      !userOrgStatus?.hasActiveInvite && (
                        <div className='bg-gray-900 rounded-xl p-12 border border-gray-800 border-dashed text-center'>
                          <div className='w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <Building className='w-12 h-12 text-gray-500' />
                          </div>
                          <h2 className='text-2xl font-bold text-white mb-4'>
                            No Organization Access
                          </h2>
                          <p className='text-gray-400 mb-8 max-w-md mx-auto'>
                            You need to be part of an organization to view
                            placement posts and opportunities. Join or get
                            invited to an organization to get started.
                          </p>
                          <div className='flex gap-4 justify-center'>
                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
                              Find Organizations
                            </button>
                            <button className='px-6 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors font-medium'>
                              Request Invite
                            </button>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </main>

            <aside className='w-80 space-y-6'>
              {isLoading ? (
                <div className='bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse'>
                  <div className='space-y-4'>
                    <div className='h-6 bg-gray-700 rounded w-3/4'></div>
                    <div className='space-y-3'>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className='flex justify-between items-center'
                        >
                          <div className='h-4 bg-gray-700 rounded w-1/2'></div>
                          <div className='h-4 bg-gray-700 rounded w-1/4'></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                userStats && (
                  <div className='bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24'>
                    <div className='flex items-center gap-3 mb-6'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                        {userStats.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className='font-semibold text-white'>
                          {userStats.name}
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {userStats.stream}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-gray-400'>
                          <GraduationCap className='w-4 h-4' />
                          <span className='text-sm'>Course</span>
                        </div>
                        <span className='text-white text-sm font-medium'>
                          {userStats.course}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-gray-400'>
                          <Calendar className='w-4 h-4' />
                          <span className='text-sm'>Batch</span>
                        </div>
                        <span className='text-white text-sm font-medium'>
                          {userStats.batch}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-gray-400'>
                          <Building className='w-4 h-4' />
                          <span className='text-sm'>Institute</span>
                        </div>
                        <span className='text-white text-sm font-medium truncate ml-2'>
                          {userStats.institute}
                        </span>
                      </div>

                      {userStats.cgpa !== "N/A" && (
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2 text-gray-400'>
                            <Award className='w-4 h-4' />
                            <span className='text-sm'>CGPA</span>
                          </div>
                          <span className='text-white text-sm font-medium'>
                            {userStats.cgpa}
                          </span>
                        </div>
                      )}

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

                      <div className='pt-4 border-t border-gray-800'>
                        <div className='flex items-center justify-between mb-3'>
                          <span className='text-sm text-gray-400'>Status</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs border capitalize ${getStatusColor(
                              userStats.placementStatus
                            )}`}
                          >
                            {userStats.placementStatus}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div className='text-center'>
                            <div className='text-lg font-bold text-white'>
                              {userStats.appliedJobs}
                            </div>
                            <div className='text-xs text-gray-400'>
                              Applied Jobs
                            </div>
                          </div>
                          <div className='text-center'>
                            <div className='text-lg font-bold text-white'>
                              {userStats.interviewsScheduled}
                            </div>
                            <div className='text-xs text-gray-400'>
                              Interviews
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
