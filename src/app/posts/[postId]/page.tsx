'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Building, User, Award, TrendingUp, ExternalLink, Calendar, CheckCircle, XCircle, AlertCircle, FileText, Target, Brain } from 'lucide-react';
import { useParams } from 'next/navigation';

interface UserStats {
  id: string;
  name: string;
  course: string;
  stream: string;
  batch: string;
  institute: string;
  cgpa: number;
  activeBacklogs: number;
  skillsCount: number;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  placementStatus: 'eligible' | 'pending' | 'placed';
  appliedJobs: number;
  interviewsScheduled: number;
}

interface PostDetail {
  id: string;
  title: string;
  content: string;
  company: {
    name: string;
    logo: string;
    website: string;
  };
  jobDetails: {
    role: string;
    type: 'Internship' | 'Full-time' | 'Part-time';
    location: string;
    salary: string;
    deadline: string;
    requirements: {
      cgpa: number;
      backlogs: number;
      skills: string[];
      courses: string[];
      experience?: string;
    };
  };
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  timestamp: string;
  description: string;
  responsibilities: string[];
  benefits: string[];
  applicationProcess: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'link';
  }>;
  stats: {
    views: number;
    applicants: number;
    positions: number;
  };
  isActive: boolean;
  hasUserApplied: boolean;
}

interface EligibilityCheck {
  isEligible: boolean;
  score: number;
  breakdown: {
    cgpa: { status: 'pass' | 'fail' | 'partial'; message: string; };
    backlogs: { status: 'pass' | 'fail'; message: string; };
    skills: { status: 'pass' | 'fail' | 'partial'; message: string; matchedSkills: string[]; missingSkills: string[]; };
    course: { status: 'pass' | 'fail'; message: string; };
  };
  recommendations: string[];
}

interface StudyPlan {
  id: string;
  title: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  modules: Array<{
    id: string;
    title: string;
    type: 'reading' | 'video' | 'practice' | 'quiz';
    duration: string;
    description: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'tutorial' | 'documentation';
    }>;
    completed: boolean;
  }>;
  progress: number;
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [activeTab, setActiveTab] = useState<'post' | 'summarise' | 'planner'>('post');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  
  const USE_DUMMY_DATA = true;

  const mockUserStats: UserStats = {
    id: "user-1",
    name: "Rahul Sharma",
    course: "Bachelor of Technology",
    stream: "Computer Science Engineering",
    batch: "2026",
    institute: "Indian Institute of Technology",
    cgpa: 8.2,
    activeBacklogs: 1,
    skillsCount: 12,
    skills: [
      { name: "JavaScript", level: "Advanced" },
      { name: "React", level: "Intermediate" },
      { name: "Python", level: "Advanced" },
      { name: "Node.js", level: "Intermediate" },
      { name: "SQL", level: "Beginner" }
    ],
    placementStatus: 'eligible',
    appliedJobs: 8,
    interviewsScheduled: 3
  };

  const mockPost: PostDetail = {
    id: postId || "post-1",
    title: "Google SDE Internship 2025 - Summer Program",
    content: "Google is seeking passionate software engineering interns for our Summer 2025 program. Join our team and work on cutting-edge projects that impact billions of users worldwide.",
    company: {
      name: "Google",
      logo: "🔍",
      website: "https://google.com"
    },
    jobDetails: {
      role: "Software Development Engineer Intern",
      type: "Internship",
      location: "Bangalore, India",
      salary: "₹80,000/month + Benefits",
      deadline: "September 15, 2025",
      requirements: {
        cgpa: 8.0,
        backlogs: 0,
        skills: ["JavaScript", "Python", "Data Structures", "Algorithms", "System Design"],
        courses: ["Computer Science", "Information Technology", "Electronics"],
        experience: "Previous internship preferred but not mandatory"
      }
    },
    author: {
      name: "Dr. Priya Mehta",
      role: "Placement Officer",
      avatar: "👩‍💼"
    },
    timestamp: "2 hours ago",
    description: "This internship program offers hands-on experience with Google's cutting-edge technology stack. Interns will work alongside experienced engineers on real-world projects that directly impact Google's products and services.",
    responsibilities: [
      "Develop and maintain web applications using modern frameworks",
      "Collaborate with cross-functional teams on product features",
      "Write clean, efficient, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Contribute to system design and architecture decisions"
    ],
    benefits: [
      "Competitive stipend with performance bonuses",
      "Free meals and transportation",
      "Access to Google's learning resources",
      "Mentorship from senior engineers",
      "Opportunity for full-time conversion"
    ],
    applicationProcess: [
      "Submit application through campus placement portal",
      "Online coding assessment (2 hours)",
      "Technical interview rounds (2-3 rounds)",
      "HR interview and background verification",
      "Offer letter and documentation"
    ],
    attachments: [
      { name: "Google_Internship_JD.pdf", url: "#", type: "pdf" },
      { name: "Application_Form.doc", url: "#", type: "doc" },
      { name: "Company_Website", url: "https://careers.google.com", type: "link" }
    ],
    stats: {
      views: 1245,
      applicants: 89,
      positions: 15
    },
    isActive: true,
    hasUserApplied: false
  };

  const mockEligibility: EligibilityCheck = {
    isEligible: false,
    score: 75,
    breakdown: {
      cgpa: { 
        status: 'pass', 
        message: 'Your CGPA (8.2) meets the minimum requirement (8.0)' 
      },
      backlogs: { 
        status: 'fail', 
        message: 'You have 1 active backlog, but 0 backlogs are required' 
      },
      skills: { 
        status: 'partial', 
        message: '3 out of 5 required skills matched',
        matchedSkills: ['JavaScript', 'Python', 'Data Structures'],
        missingSkills: ['Algorithms', 'System Design']
      },
      course: { 
        status: 'pass', 
        message: 'Your course (Computer Science Engineering) is eligible' 
      }
    },
    recommendations: [
      "Clear your active backlog before applying",
      "Study Algorithms and System Design fundamentals",
      "Practice coding problems on platforms like LeetCode",
      "Build projects showcasing system design skills"
    ]
  };

  const mockStudyPlan: StudyPlan = {
    id: "plan-1",
    title: "Google SDE Preparation Plan",
    estimatedTime: "4-6 weeks",
    difficulty: "Medium",
    modules: [
      {
        id: "module-1",
        title: "Data Structures & Algorithms Fundamentals",
        type: "practice",
        duration: "2 weeks",
        description: "Master essential DSA concepts required for Google interviews",
        resources: [
          { title: "Introduction to Algorithms", url: "#", type: "article" },
          { title: "DSA Video Course", url: "#", type: "video" },
          { title: "LeetCode Practice", url: "#", type: "tutorial" }
        ],
        completed: false
      },
      {
        id: "module-2",
        title: "System Design Basics",
        type: "reading",
        duration: "1 week",
        description: "Learn system design principles and common patterns",
        resources: [
          { title: "System Design Primer", url: "#", type: "documentation" },
          { title: "Scalability Patterns", url: "#", type: "article" }
        ],
        completed: false
      },
      {
        id: "module-3",
        title: "Mock Interviews",
        type: "practice",
        duration: "1 week",
        description: "Practice with mock technical interviews",
        resources: [
          { title: "Pramp Mock Interviews", url: "#", type: "tutorial" },
          { title: "InterviewBit Practice", url: "#", type: "tutorial" }
        ],
        completed: false
      }
    ],
    progress: 0
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (USE_DUMMY_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPost(mockPost);
        setUserStats(mockUserStats);
        setEligibility(mockEligibility);
        setStudyPlan(mockStudyPlan);
      } else {
        try {
          const [postResponse, userResponse, eligibilityResponse, planResponse] = await Promise.all([
            fetch(`/api/posts/${postId}`),
            fetch('/api/user/profile'),
            fetch(`/api/posts/${postId}/eligibility`),
            fetch(`/api/posts/${postId}/study-plan`)
          ]);
          
          const postData = await postResponse.json();
          const userData = await userResponse.json();
          const eligibilityData = await eligibilityResponse.json();
          const planData = await planResponse.json();
          
          setPost(postData);
          setUserStats(userData);
          setEligibility(eligibilityData);
          setStudyPlan(planData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [postId]);

  const handleApply = async () => {
    if (USE_DUMMY_DATA) {
      alert('Application submitted successfully!');
      setPost(prev => prev ? { ...prev, hasUserApplied: true } : null);
    } else {
      try {
        const response = await fetch(`/api/posts/${postId}/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          alert('Application submitted successfully!');
          setPost(prev => prev ? { ...prev, hasUserApplied: true } : null);
        }
      } catch (error) {
        console.error('Error applying:', error);
        alert('Failed to submit application');
      }
    }
  };

  const getEligibilityColor = (isEligible: boolean) => {
    return isEligible 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'partial') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'partial': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const PostTab: React.FC = () => (
    <div className="space-y-6">
      {post && (
        <>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                  {post.company.logo}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {post.company.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {post.jobDetails.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white mb-1">{post.jobDetails.salary}</div>
                <div className="text-sm text-gray-400">Deadline: {post.jobDetails.deadline}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{post.stats.views}</div>
                <div className="text-xs text-gray-400">Views</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{post.stats.applicants}</div>
                <div className="text-xs text-gray-400">Applicants</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{post.stats.positions}</div>
                <div className="text-xs text-gray-400">Positions</div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">{post.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {post.responsibilities.map((item, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Benefits & Perks</h3>
                  <ul className="space-y-2">
                    {post.benefits.map((item, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Application Process</h3>
                <div className="flex flex-wrap gap-2">
                  {post.applicationProcess.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="ml-2 text-gray-300 text-sm">{step}</span>
                      {index < post.applicationProcess.length - 1 && (
                        <div className="mx-3 w-4 h-0.5 bg-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {post.attachments && post.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Resources & Downloads</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white">{attachment.name}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const SummariseTab: React.FC = () => (
    <div className="space-y-6">
      {eligibility && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Eligibility Analysis</h2>
            <div className={`px-4 py-2 rounded-full border ${getEligibilityColor(eligibility.isEligible)}`}>
              <span className="font-medium">
                {eligibility.isEligible ? 'Eligible' : 'Not Eligible'} ({eligibility.score}% match)
              </span>
            </div>
          </div>

          <div className="grid gap-4 mb-6">
            {Object.entries(eligibility.breakdown).map(([key, details]) => (
              <div key={key} className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                {getStatusIcon(details.status)}
                <div className="flex-1">
                  <h4 className="font-medium text-white capitalize mb-1">{key} Check</h4>
                  <p className="text-sm text-gray-300">{details.message}</p>
                  {key === 'skills' && 'matchedSkills' in details && (
                    <div className="mt-2 space-y-1">
                      {details.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-green-400">Matched:</span>
                          {details.matchedSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {details.missingSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-red-400">Missing:</span>
                          {details.missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
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
              <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
              <div className="space-y-2">
                {eligibility.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-gray-300">
                    <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
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
    <div className="space-y-6">
      {studyPlan && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{studyPlan.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {studyPlan.estimatedTime}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  studyPlan.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  studyPlan.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {studyPlan.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{studyPlan.progress}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${studyPlan.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {studyPlan.modules.map((module, index) => (
              <div key={module.id} className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      module.completed 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-600 bg-gray-800'
                    }`}>
                      {module.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{module.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{module.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {module.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-11">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Resources:</h5>
                  <div className="space-y-2">
                    {module.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{resource.title}</span>
                        <span className="px-1 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
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
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-800 rounded-xl"></div>
            <div className="flex gap-8">
              <div className="flex-1 space-y-6">
                <div className="h-96 bg-gray-800 rounded-xl"></div>
              </div>
              <div className="w-80">
                <div className="h-64 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post || !userStats || !eligibility) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-gray-400">The requested post could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  {post.jobDetails.role}
                </h1>
                <p className="text-sm text-gray-400">{post.company.name}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            <main className="flex-1">
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
                  {(['post', 'summarise', 'planner'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tab-content">
                {activeTab === 'post' && <PostTab />}
                {activeTab === 'summarise' && <SummariseTab />}
                {activeTab === 'planner' && <PlannerTab />}
              </div>
            </main>

            <aside className="w-80 space-y-6">
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

                <div className="space-y-4 mb-6">
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Eligibility</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getEligibilityColor(eligibility.isEligible)}`}>
                      {eligibility.isEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  {post.isActive && (
                    <div className="space-y-3">
                      {post.hasUserApplied ? (
                        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <p className="text-sm text-green-400">Application Submitted</p>
                        </div>
                      ) : eligibility.isEligible ? (
                        <button
                          onClick={handleApply}
                          className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                          <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                          <p className="text-sm text-red-400 mb-2">Not Eligible</p>
                          <p className="text-xs text-gray-400">Check recommendations in Summarise tab</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 text-center">
                        Deadline: {post.jobDetails.deadline}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-white mb-4">Job Requirements</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min CGPA</span>
                    <span className="text-white">{post.jobDetails.requirements.cgpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Backlogs</span>
                    <span className="text-white">{post.jobDetails.requirements.backlogs}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2">Required Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {post.jobDetails.requirements.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            userStats.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2">Eligible Courses</span>
                    <div className="flex flex-wrap gap-1">
                      {post.jobDetails.requirements.courses.map((course, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            userStats.stream.toLowerCase().includes(course.toLowerCase()) || 
                            course.toLowerCase().includes(userStats.stream.toLowerCase())
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-white mb-4">Company Info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{post.company.logo}</div>
                  <div>
                    <h4 className="font-medium text-white">{post.company.name}</h4>
                    <a 
                      href={post.company.website}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position Type</span>
                    <span className="text-white">{post.jobDetails.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{post.jobDetails.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salary</span>
                    <span className="text-white">{post.jobDetails.salary}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;