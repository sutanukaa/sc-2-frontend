import { Briefcase } from "lucide-react";
import React from "react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-black text-white transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2 animate-fade-in">
          <Briefcase className="inline-block text-white drop-shadow-glow" size={32} />
          About the Platform
        </h2>
        <p className="text-lg mb-8 animate-fade-in delay-100">
          <span className="bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
            Our platform revolutionizes campus placements by automating the entire process for placement cells and students. Placement cells can create groups (like Google Classroom), announce upcoming companies, and share custom or external application forms. Students join groups, upload their marksheets, and our AI agent checks their eligibility for each company. Eligible students can apply directly and receive personalized interview preparation, including suggestions and previously asked questions, all powered by AI.
          </span>
        </p>
        <button className="skew-button relative overflow-hidden mt-4 group">
          <span className="transition-transform duration-300 group-hover:scale-110">Learn More</span>
        </button>
      </div>
    </section>
  );
}
