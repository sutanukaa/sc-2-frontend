'use client';
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Building, Award, TrendingUp, Clock, Bell, Search,
  Plus, X, Save, Users, BarChart3, Settings, Briefcase, Shield, GraduationCap
} from 'lucide-react';

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
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
  };
  timestamp: string;
  type: 'announcement' | 'opportunity' | 'update' | 'deadline';
  ctc?: {
    min: string;
    max: string;
    currency: string;
  };
  eligibility?: {
    minCGPA: string;
    branches: string[];
    batch: string[];
  };
}

interface UserRole {
  role: 'user' | 'admin' | 'moderator';
  permissions: {
    canCreatePosts: boolean;
    canDeletePosts: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
  };
}


interface CreatePostForm {
  title: string;
  content: string;
  type: Post['type'];
}

const RoleBasedDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userOrgStatus, setUserOrgStatus] = useState<UserOrganizationStatus | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isProcessingInvite, setIsProcessingInvite] = useState<boolean>(false);
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);

  
  const [createPostForm, setCreatePostForm] = useState<CreatePostForm>({
    title: '',
    content: '',
    type: 'announcement'
  });

  const mockUserStats: UserStats = {
    name: "Dr. Priya Mehta",
    course: "PhD Computer Science",
    stream: "Artificial Intelligence",
    batch: "Faculty",
    institute: "Indian Institute of Technology Delhi",
    cgpa: "N/A",
    activeBacklogs: 0,
    skillsCount: 25,
    placementStatus: 'eligible',
    appliedJobs: 0,
    interviewsScheduled: 0
  };

  // Mock role data - Admin role
  const mockUserRole: UserRole = {
    role: 'admin',
    permissions: {
      canCreatePosts: true,
      canDeletePosts: true,
      canManageUsers: true,
      canViewAnalytics: true
    }
  };

  // For testing user role, uncomment this:
  // const mockUserRole: UserRole = {
  //   role: 'user',
  //   permissions: {
  //     canCreatePosts: false,
  //     canDeletePosts: false,
  //     canManageUsers: false,
  //     canViewAnalytics: false
  //   }
  // };

  const mockUserOrgStatus: UserOrganizationStatus = {
    isPartOfOrg: true,
    hasActiveInvite: false,
    organization: {
      id: "org-1",
      name: "IIT Delhi Placement Cell",
      logo: "🏛️",
      type: "college",
      memberSince: "August 2020",
      totalMembers: 2847
    }
  };

  const mockPosts: Post[] = [
    {
      id: "1",
      title: "Internship Opportunity at Microsoft",
      content: "Microsoft is offering a summer internship for pre-final year students. The program will provide hands-on experience in software development, AI, and cloud technologies. Interested students must apply before the deadline.",
      author: {
        name: "Soumyaraj Bag",
        role: "Placement Coordinator",
      },
      timestamp: "2025-08-24T10:30:00Z",
      type: "opportunity",
      ctc: {
        min: "10",
        max: "15",
        currency: "LPA",
      },
      eligibility: {
        minCGPA: "7.5",
        branches: ["CSE", "IT", "ECE"],
        batch: ["2026"],
      },
    },
    {
      id: "post-2",
      title: "Microsoft Campus Drive - Pre-placement Talk",
      content: "Microsoft will be conducting a pre-placement talk on August 30, 2025. All eligible students are encouraged to attend.",
      author: {
        name: "Prof. Amit Kumar",
        role: "TPO",
      },
      timestamp: "5 hours ago",
      type: "announcement"
    }
  ];

  const postTypes: { value: Post['type']; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'announcement', label: 'Announcement', icon: <Bell className="w-4 h-4" />, color: 'blue' },
    { value: 'opportunity', label: 'Job Opportunity', icon: <Briefcase className="w-4 h-4" />, color: 'green' },
    { value: 'update', label: 'Update', icon: <BarChart3 className="w-4 h-4" />, color: 'purple' },
    { value: 'deadline', label: 'Deadline', icon: <Clock className="w-4 h-4" />, color: 'red' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserStats(mockUserStats);
      setUserOrgStatus(mockUserOrgStatus);
      setUserRole(mockUserRole);
      setPosts(mockPosts);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleAcceptInvite = async (inviteId: string) => {
    if (!userOrgStatus?.activeInvite) return;
    
    setIsProcessingInvite(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updatedStatus: UserOrganizationStatus = {
        isPartOfOrg: true,
        hasActiveInvite: false,
        organization: {
          ...userOrgStatus.activeInvite.organization,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }
      };
      setUserOrgStatus(updatedStatus);
    } catch (error) {
      console.error('Failed to accept invite:', error);
    } finally {
      setIsProcessingInvite(false);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    setIsProcessingInvite(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserOrgStatus({
        isPartOfOrg: false,
        hasActiveInvite: false
      });
    } catch (error) {
      console.error('Failed to decline invite:', error);
    } finally {
      setIsProcessingInvite(false);
    }
  };

  const handleCreatePost = async () => {
    if (!createPostForm.title.trim() || !createPostForm.content.trim()) {
      alert('Please fill in required fields');
      return;
    }

    try {
      // Simulate API call to create post
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: createPostForm.title,
        content: createPostForm.content,
        author: {
          name: userStats?.name || "Admin",
          role: "Admin",
        },
        timestamp: "Just now",
        type: createPostForm.type
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Reset form
      setCreatePostForm({
        title: '',
        content: '',
        type: 'announcement'
      });
      
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };



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

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp; // Return as-is if not a valid date
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch {
      return timestamp; // Return as-is if parsing fails
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
    </div>
  );

  const CreatePostModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button
            onClick={() => setShowCreatePost(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Post Type</label>
            <div className="grid grid-cols-2 gap-3">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setCreatePostForm(prev => ({ ...prev, type: type.value }))}
                  className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                    createPostForm.type === type.value
                      ? `bg-${type.color}-500/20 border-${type.color}-500/30 text-${type.color}-400`
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={createPostForm.title}
              onChange={(e) => setCreatePostForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter post title..."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
            <textarea
              value={createPostForm.content}
              onChange={(e) => setCreatePostForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter post content..."
              rows={5}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-vertical"
            />

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => setShowCreatePost(false)}
              className="flex-1 p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              disabled={!createPostForm.title.trim() || !createPostForm.content.trim()}
              className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Post
            </button>
          </div>
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
                {userRole?.role === 'admin' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium">Admin</span>
                  </div>
                )}
                {userOrgStatus?.isPartOfOrg && userOrgStatus.organization && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-2xl">{userOrgStatus.organization.logo}</span>
                    <span className="text-sm">{userOrgStatus.organization.name}</span>
                  </div>
                )}
                {userOrgStatus?.hasActiveInvite && userOrgStatus.activeInvite && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span className="text-2xl">{userOrgStatus.activeInvite.organization.logo}</span>
                    <span className="text-sm">Invite pending: {userOrgStatus.activeInvite.organization.name}</span>
                  </div>
                )}
                {!userOrgStatus?.isPartOfOrg && !userOrgStatus?.hasActiveInvite && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-sm">Not affiliated with any organization</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {userRole?.permissions.canCreatePosts && (
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </button>
                )}
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
                  <>
                    {/* Scenario 1: User has active invite - Show invite card */}
                    {userOrgStatus?.hasActiveInvite && userOrgStatus.activeInvite && (
                      <div className="bg-gray-900 rounded-xl p-8 border border-yellow-500/30 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                          {userOrgStatus.activeInvite.organization.logo}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Organization Invitation</h2>
                        <p className="text-gray-300 mb-6 max-w-md mx-auto">
                          You&apos;ve been invited to join <strong>{userOrgStatus.activeInvite.organization.name}</strong> by {userOrgStatus.activeInvite.invitedBy.name}.
                        </p>
                        
                        <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Organization</span>
                              <span className="text-white font-medium">{userOrgStatus.activeInvite.organization.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Type</span>
                              <span className="text-white capitalize">{userOrgStatus.activeInvite.organization.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Members</span>
                              <span className="text-white">{userOrgStatus.activeInvite.organization.totalMembers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Invited by</span>
                              <span className="text-white">{userOrgStatus.activeInvite.invitedBy.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Expires on</span>
                              <span className="text-white">{userOrgStatus.activeInvite.expiryDate}</span>
                            </div>
                          </div>
                          
                          {userOrgStatus.activeInvite.message && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <p className="text-gray-300 text-sm italic">&quot;{userOrgStatus.activeInvite.message}&quot;</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={() => handleAcceptInvite(userOrgStatus.activeInvite!.id)}
                            disabled={isProcessingInvite}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {isProcessingInvite ? 'Processing...' : 'Accept Invitation'}
                          </button>
                          <button
                            onClick={() => handleDeclineInvite(userOrgStatus.activeInvite!.id)}
                            disabled={isProcessingInvite}
                            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {isProcessingInvite ? 'Processing...' : 'Decline'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Scenario 2: User is part of organization - Show posts */}
                    {userOrgStatus?.isPartOfOrg && !userOrgStatus?.hasActiveInvite && (
                      posts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => handlePostClick(post.id)}
                          className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group"
                        >
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                              {/* <p className="text-gray-300 mb-3">{post.description}</p> */}
                              <p className="text-gray-400 text-sm">{post.content}</p>
                            </div>

                            {/* Post Type Badge */}
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                                {post.type === 'opportunity' ? 'Job Opportunity' : 
                                 post.type === 'announcement' ? 'Announcement' : 
                                 post.type === 'update' ? 'Update' : 'Deadline'}
                              </span>
                            </div>

                            {/* CTC Display for opportunities */}
                            {post.ctc && (
                              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Briefcase className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-medium text-green-400">Compensation</span>
                                </div>
                                <p className="text-white font-semibold">
                                  {post.ctc.min} - {post.ctc.max} {post.ctc.currency}
                                </p>
                              </div>
                            )}

                            {/* Eligibility Display for opportunities */}
                            {post.eligibility && (
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <GraduationCap className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-medium text-blue-400">Eligibility Criteria</span>
                                </div>
                                <div className="space-y-2 text-sm text-white">
                                  {post.eligibility.minCGPA && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400">Min CGPA:</span>
                                      <span className="font-medium">{post.eligibility.minCGPA}</span>
                                    </div>
                                  )}
                                  {post.eligibility.branches && post.eligibility.branches.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400">Branches:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {post.eligibility.branches.map((branch, index) => (
                                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs border border-blue-500/30">
                                            {branch}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {post.eligibility.batch && post.eligibility.batch.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400">Batches:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {post.eligibility.batch.map((batch, index) => (
                                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs border border-purple-500/30">
                                            {batch}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Author and Time */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {post.author.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium">{post.author.name}</p>
                                    <p className="text-gray-400 text-xs">{post.author.role}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Clock className="w-4 h-4" />
                                {formatTimestamp(post.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Scenario 3: User not part of org and no invite - Show empty state */}
                    {!userOrgStatus?.isPartOfOrg && !userOrgStatus?.hasActiveInvite && (
                      <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 border-dashed text-center">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Building className="w-12 h-12 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">No Organization Access</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                          You need to be part of an organization to view placement posts and opportunities. Join or get invited to an organization to get started.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Find Organizations
                          </button>
                          <button className="px-6 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors font-medium">
                            Request Invite
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>

            <aside className="w-80 space-y-6">
              {isLoading ? (
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

                      {userStats.cgpa !== 'N/A' && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">CGPA</span>
                          </div>
                          <span className="text-white text-sm font-medium">{userStats.cgpa}</span>
                        </div>
                      )}

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

                      {userRole?.role !== 'admin' && (
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
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Organization Card */}
              {!isLoading && userOrgStatus?.isPartOfOrg && userOrgStatus.organization && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Organization</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{userOrgStatus.organization.logo}</div>
                    <div>
                      <h4 className="font-medium text-white">{userOrgStatus.organization.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{userOrgStatus.organization.type}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member since</span>
                      <span className="text-white">{userOrgStatus.organization.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total members</span>
                      <span className="text-white">{userOrgStatus.organization.totalMembers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Controls */}
              {!isLoading && userRole?.role === 'admin' && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Admin Controls</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Post
                    </button>
                    {userRole.permissions.canViewAnalytics && (
                      <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Analytics
                      </button>
                    )}
                    {userRole.permissions.canManageUsers && (
                      <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Manage Users
                      </button>
                    )}
                    <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions for non-admin users */}
              {!isLoading && userRole?.role !== 'admin' && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Update Profile
                    </button>
                    {userOrgStatus?.isPartOfOrg ? (
                      <>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm">
                          View Applications
                        </button>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors text-sm">
                          Schedule Interview
                        </button>
                      </>
                    ) : userOrgStatus?.hasActiveInvite ? (
                      <>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm" disabled>
                          View Applications
                        </button>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm" disabled>
                          Schedule Interview
                        </button>
                        <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-xs text-yellow-400 text-center">
                            Accept organization invite to unlock features
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm" disabled>
                          View Applications
                        </button>
                        <button className="w-full p-3 bg-gray-800 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm" disabled>
                          Schedule Interview
                        </button>
                        <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Join Organization
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && <CreatePostModal />}
    </div>
  );
};

export default RoleBasedDashboard;