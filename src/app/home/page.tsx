'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building, User, Award, TrendingUp, Clock, ChevronRight, ExternalLink, Bell, Search, GraduationCap } from 'lucide-react';

interface UserStats {
  name: string;
  course: string;
  stream: string;
  batch: string;
  institute: string;
  cgpa: string;
  activeBacklogs: number;
  skillsCount: number;
  placementStatus: 'eligible' | 'pending' | 'placed';
  appliedJobs: number;
  interviewsScheduled: number;
}

interface Organization {
  id: string;
  name: string;
  logo: string;
  type: 'college' | 'company';
  memberSince: string;
  totalMembers: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  timestamp: string;
  type: 'announcement' | 'opportunity' | 'update' | 'deadline';
  tags: string[];
  attachments?: {
    name: string;
    url: string;
  }[];
  stats: {
    views: number;
    applicants?: number;
  };
}

const HomeDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const mockUserStats: UserStats = {
    name: "Rahul Sharma",
    course: "Bachelor of Technology",
    stream: "Computer Science Engineering",
    batch: "2026",
    institute: "Indian Institute of Technology",
    cgpa: "8.5",
    activeBacklogs: 0,
    skillsCount: 12,
    placementStatus: 'eligible',
    appliedJobs: 8,
    interviewsScheduled: 3
  };

  const mockOrganization: Organization = {
    id: "org-1",
    name: "IIT Delhi Placement Cell",
    logo: "🏛️",
    type: "college",
    memberSince: "August 2024",
    totalMembers: 2847
  };

  const mockPosts: Post[] = [
    {
      id: "post-1",
      title: "Google SDE Internship 2025 - Applications Open",
      content: "Google is hiring for Software Development Engineer Internship positions. Eligibility: 8.0+ CGPA, CS/IT background. Application deadline: September 15, 2025.",
      author: {
        name: "Dr. Priya Mehta",
        role: "Placement Officer",
        avatar: "👩‍💼"
      },
      timestamp: "2 hours ago",
      type: "opportunity",
      tags: ["Internship", "Google", "Software", "High Priority"],
      stats: {
        views: 342,
        applicants: 89
      }
    },
    {
      id: "post-2",
      title: "Microsoft Campus Drive - Pre-placement Talk",
      content: "Microsoft will be conducting a pre-placement talk on August 30, 2025. All eligible students are encouraged to attend. Topics covered: Company culture, role expectations, and selection process.",
      author: {
        name: "Prof. Amit Kumar",
        role: "TPO",
        avatar: "👨‍🏫"
      },
      timestamp: "5 hours ago",
      type: "announcement",
      tags: ["Microsoft", "PPT", "Campus Drive"],
      attachments: [
        { name: "Microsoft_PPT_Details.pdf", url: "#" }
      ],
      stats: {
        views: 567
      }
    },
    {
      id: "post-3",
      title: "Placement Statistics Update - August 2025",
      content: "Current placement statistics: 78% placement rate, average package ₹12.5 LPA, highest package ₹45 LPA. Keep up the excellent work!",
      author: {
        name: "Placement Cell",
        role: "Official",
        avatar: "📊"
      },
      timestamp: "1 day ago",
      type: "update",
      tags: ["Statistics", "Update", "Performance"],
      stats: {
        views: 1203
      }
    },
    {
      id: "post-4",
      title: "Resume Review Session - Deadline Extended",
      content: "Due to overwhelming response, we're extending the resume review session deadline to August 28, 2025. Submit your resumes for expert feedback.",
      author: {
        name: "Career Services",
        role: "Department",
        avatar: "📝"
      },
      timestamp: "2 days ago",
      type: "deadline",
      tags: ["Resume", "Deadline", "Career Services"],
      stats: {
        views: 892
      }
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUserStats(mockUserStats);
      setOrganization(mockOrganization);
      setPosts(mockPosts);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getPostTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'opportunity': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'announcement': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'update': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: UserStats['placementStatus']) => {
    switch (status) {
      case 'placed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'eligible': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handlePostClick = (postId: string) => {
    console.log(`Navigating to post: ${postId}`);
  };

  const PostSkeleton = () => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-700 rounded w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Campus Placement
                </h1>
                {organization && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-2xl">{organization.logo}</span>
                    <span className="text-sm">{organization.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors w-64"
                  />
                </div>
                <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            <main className="flex-1 max-w-2xl">
              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {post.author.avatar}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{post.author.name}</h4>
                            <p className="text-sm text-gray-400">{post.author.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${getPostTypeColor(post.type)}`}>
                            {post.type}
                          </span>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs border border-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {post.attachments && post.attachments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Attachments:</p>
                          {post.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                              <ExternalLink className="w-4 h-4" />
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{post.stats.views} views</span>
                          {post.stats.applicants && (
                            <span>{post.stats.applicants} applicants</span>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>

            <aside className="w-80 space-y-6">
              {isLoading ? (
                <StatsSkeleton />
              ) : (
                userStats && (
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {userStats.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{userStats.name}</h3>
                        <p className="text-sm text-gray-400">{userStats.stream}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm">Course</span>
                        </div>
                        <span className="text-white text-sm font-medium">{userStats.course}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Batch</span>
                        </div>
                        <span className="text-white text-sm font-medium">{userStats.batch}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">Institute</span>
                        </div>
                        <span className="text-white text-sm font-medium truncate ml-2">{userStats.institute}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">CGPA</span>
                        </div>
                        <span className="text-white text-sm font-medium">{userStats.cgpa}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Skills</span>
                        </div>
                        <span className="text-white text-sm font-medium">{userStats.skillsCount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Backlogs</span>
                        </div>
                        <span className="text-white text-sm font-medium">{userStats.activeBacklogs}</span>
                      </div>

                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-400">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs border capitalize ${getStatusColor(userStats.placementStatus)}`}>
                            {userStats.placementStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">{userStats.appliedJobs}</div>
                            <div className="text-xs text-gray-400">Applied Jobs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">{userStats.interviewsScheduled}</div>
                            <div className="text-xs text-gray-400">Interviews</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {!isLoading && organization && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Organization</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{organization.logo}</div>
                    <div>
                      <h4 className="font-medium text-white">{organization.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{organization.type}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member since</span>
                      <span className="text-white">{organization.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total members</span>
                      <span className="text-white">{organization.totalMembers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Update Profile
                  </button>
                  <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm">
                    View Applications
                  </button>
                  <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm">
                    Schedule Interview
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;