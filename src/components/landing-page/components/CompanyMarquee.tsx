"use client";

import { motion } from "framer-motion";

interface CompanyAnnouncement {
  company: string;
  position: string;
  deadline: string;
  package: string;
  requirements: string;
  logo: string;
  color: string;
  bgColor: string;
  applicants: number;
  timeLeft: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  tier: 'Dream' | 'Super Dream' | 'Good' | 'Decent';
}

const companyAnnouncements: CompanyAnnouncement[] = [
  {
    company: "Google",
    position: "Software Engineer",
    deadline: "Jan 15, 2025",
    package: "₹45 LPA",
    requirements: "CSE/IT, 8.5+ CGPA",
    logo: "G",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 245,
    timeLeft: "3 days",
    location: "Bangalore",
    type: "Full-time",
    tier: "Dream"
  },
  {
    company: "Microsoft",
    position: "Software Engineer",
    deadline: "Jan 20, 2025",
    package: "₹35 LPA",
    requirements: "Any Branch, 8+ CGPA",
    logo: "M",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 189,
    timeLeft: "8 days",
    location: "Noida",
    type: "Full-time",
    tier: "Dream"
  },
  {
    company: "Amazon",
    position: "SDE Intern",
    deadline: "Jan 25, 2025",
    package: "₹28 LPA",
    requirements: "CSE/IT, 7.5+ CGPA",
    logo: "A",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 312,
    timeLeft: "13 days",
    location: "Bangalore",
    type: "Internship",
    tier: "Dream"
  },
  {
    company: "Goldman Sachs",
    position: "Technology Analyst",
    deadline: "Feb 1, 2025",
    package: "₹52 LPA",
    requirements: "Any Branch, 9+ CGPA",
    logo: "GS",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 156,
    timeLeft: "20 days",
    location: "Mumbai",
    type: "Full-time",
    tier: "Dream"
  },
  {
    company: "Meta",
    position: "Frontend Engineer",
    deadline: "Jan 30, 2025",
    package: "₹48 LPA",
    requirements: "CSE/IT, 8.5+ CGPA",
    logo: "M",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 178,
    timeLeft: "18 days",
    location: "Gurgaon",
    type: "Full-time",
    tier: "Dream"
  },
  {
    company: "Flipkart",
    position: "Software Engineer",
    deadline: "Feb 5, 2025",
    package: "₹24 LPA",
    requirements: "CSE/IT, 7+ CGPA",
    logo: "F",
    color: "text-white",
    bgColor: "from-gray-800/50 to-gray-900/50",
    applicants: 287,
    timeLeft: "24 days",
    location: "Bangalore",
    type: "Full-time",
    tier: "Good"
  }
];

export function CompanyMarquee() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden ml-6">
      {/* Gradient fade effects */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
      
      <motion.div
        className="flex flex-col gap-8 py-8"
        animate={{
          y: [0, -1400],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...companyAnnouncements, ...companyAnnouncements, ...companyAnnouncements].map((announcement, index) => (
          <CompanyCard key={`${announcement.company}-${index}`} announcement={announcement} index={index} />
        ))}
      </motion.div>
    </div>
  );
}

function CompanyCard({ announcement, index }: { announcement: CompanyAnnouncement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="ml-8 mr-2 min-w-[380px] max-w-[420px]"
    >
      <div className="relative p-8 rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/80 transition-all duration-300 shadow-xl">
        {/* Company Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-300 flex items-center justify-center text-black font-bold text-xl shadow-lg">
            {announcement.logo}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xl mb-1">{announcement.company}</h3>
            <p className="text-gray-400 text-base">@{announcement.company.toLowerCase()}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <p className="text-white text-lg leading-relaxed">
            {announcement.position} position now open. Package: <span className="font-semibold text-blue-400">{announcement.package}</span>. 
            Apply before {announcement.deadline}.
          </p>
          
          {/* Additional Details */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
              {announcement.type}
            </span>
            <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
              {announcement.tier}
            </span>
            <span className="px-3 py-1 bg-gray-600/20 text-gray-300 rounded-full text-sm font-medium">
              {announcement.location}
            </span>
          </div>
          
          {/* Requirements and Stats */}
          <div className="text-gray-300 text-sm space-y-2 pt-2">
            <p><span className="text-gray-400">Requirements:</span> {announcement.requirements}</p>
            <p><span className="text-gray-400">Applicants:</span> {announcement.applicants} | <span className="text-gray-400">Time left:</span> {announcement.timeLeft}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
