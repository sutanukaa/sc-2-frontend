import { Users, CheckCircle, Star, Rocket } from "lucide-react";
import React from "react";

const features = [
  {
    icon: <Users className="text-white drop-shadow-glow transition-transform duration-300 group-hover:scale-125" size={32} />, 
    title: "Group Management",
    desc: "Placement cells can create and manage groups for each batch or department, just like Google Classroom."
  },
  {
    icon: <CheckCircle className="text-white drop-shadow-glow transition-transform duration-300 group-hover:scale-125" size={32} />, 
    title: "Custom & External Forms",
    desc: "Announce upcoming companies and attach customizable forms or external links (like Google Forms) for applications."
  },
  {
    icon: <Star className="text-white drop-shadow-glow transition-transform duration-300 group-hover:scale-125" size={32} />, 
    title: "AI Eligibility Checks",
    desc: "Students upload marksheets; our AI instantly checks eligibility for each company and notifies them."
  },
  {
    icon: <Rocket className="text-white drop-shadow-glow transition-transform duration-300 group-hover:scale-125" size={32} />, 
    title: "AI Interview Prep",
    desc: "Eligible students get personalized suggestions and previously asked questions to prepare for interviews."
  }
];

interface FeaturesSectionProps {
  id?: string;
}

export default function FeaturesSection({ id }: FeaturesSectionProps) {
  return (
    <section id={id} className="py-20 pt-32 bg-zinc-900/80 text-white transition-colors duration-500 relative z-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-2 animate-fade-in">
          <Star className="inline-block text-white drop-shadow-glow" size={28} />
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-zinc-800 rounded-lg shadow p-6 flex flex-col items-center text-center group hover:bg-zinc-700 transition-colors duration-300 cursor-pointer hover:scale-105 transform"
              tabIndex={0}
              role="button"
              aria-label={f.title}
            >
              <div className="mb-2">{f.icon}</div>
              <h3 className="mt-2 font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="skew-button relative overflow-hidden group">
            <span className="transition-transform duration-300 group-hover:scale-110">Get Started</span>
          </button>
        </div>
      </div>
    </section>
  );
}
