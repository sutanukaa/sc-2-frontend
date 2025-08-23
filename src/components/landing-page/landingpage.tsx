"use client";

import React, { useRef } from "react";
import clsx from "clsx";
import { CompanyMarquee } from "./components/CompanyMarquee";
import GradualSpacing from "./components/GradualSpacing";
import NavigationBar from "./components/NavigationBar";
import AboutSection from "./components/AboutSection";
import FeaturesSection from "./components/FeaturesSection";
import { useInView } from "framer-motion";
import {
  TopLeftShiningLight,
  TopRightShiningLight,
} from "./svgs/ShinyLighs";

export default function LandingPage() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
  ];
  
  const heroRef = useRef(null);
  const isInView = useInView(heroRef);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-black">
        <TopRightShiningLight />
        <TopLeftShiningLight />
        
        {/* Enhanced Grid Background with Fade */}
        <div className="absolute inset-0 w-full h-full">
          {/* Primary Grid Pattern */}
          <div className="absolute inset-0 bg-transparent opacity-20 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
          
          {/* Secondary Grid Pattern (larger) */}
          <div className="absolute inset-0 bg-transparent opacity-10 bg-[linear-gradient(to_right,#3b82f6_2px,transparent_2px),linear-gradient(to_bottom,#3b82f6_2px,transparent_2px)] bg-[size:12rem_12rem] pointer-events-none"></div>
          
          {/* Grid Glow Effect */}
          <div className="absolute inset-0 bg-transparent opacity-5 bg-[linear-gradient(to_right,#60a5fa_1px,transparent_1px),linear-gradient(to_bottom,#60a5fa_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none blur-[0.5px]"></div>

          {/* Top Fade - Enhanced */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent z-10"></div>

          {/* Bottom Fade - Enhanced */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>

          {/* Side Fades - Enhanced */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>
        </div>
        
        {/* Navigation */}
        <div className="relative z-20 pt-8 pb-4 px-6">
          <NavigationBar
            logo="/logo.png"
            logoAlt="CampusPlace Logo"
            items={navItems}
            activeHref="/"
            pillColor="#3b82f6"
            hoveredPillTextColor="#000000"
            pillTextColor="#000000"
          />
        </div>

        {/* Hero Content */}
        <div className="justify-between md:flex px-6">
          <Container className="relative py-8 ml-auto sm:pt-16 sm:pb-24">
            <div ref={heroRef} className="mx-auto max-w-2xl lg:px-12 lg:max-w-4xl">
              <GradualSpacing
                textClassName="justify-start"
                visibility={isInView}
                className="max-w-2xl text-5xl font-normal tracking-tighter text-blue-400 sm:text-7xl font-manrope"
                text={"Smart Campus"}
              />
              <GradualSpacing
                textClassName="justify-start"
                visibility={isInView}
                className="max-w-2xl text-5xl font-normal tracking-tighter text-blue-400 sm:text-7xl font-manrope"
                text={"Placement Platform"}
              />

              <div className="mt-6 space-y-6 tracking-tight text-gray-400 sm:text-xl font-manrope text-md">
                <p>
                  Revolutionize your campus placement process with AI-powered automation. 
                  Students get personalized guidance while placement cells streamline 
                  company coordination and eligibility verification.
                </p>
                <p>
                  From automated eligibility checks to AI-generated interview preparation, 
                  our platform ensures every student gets the best opportunity to land 
                  their dream job.
                </p>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button className="flex gap-2 justify-center items-center py-3 px-8 text-lg tracking-tighter text-center bg-blue-500 rounded-md ring-2 ring-offset-2 transition-all hover:ring-transparent group/button w-fit font-manrope text-md text-white ring-blue-400/80 ring-offset-black hover:scale-[1.02] active:scale-[0.98] hover:bg-blue-600 active:ring-blue-400/70">
                  Join as Student
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover/button:[animation-delay:.2s] group-hover/button:animate-shineButton rounded-[inherit] bg-[length:200%_100%] bg-[linear-gradient(110deg,transparent,35%,rgba(255,255,255,.7),75%,transparent)]"
                  />
                </button>
                
                <button className="flex gap-2 justify-center items-center py-3 px-8 text-lg tracking-tighter text-center border-2 border-blue-600 rounded-md transition-all hover:border-blue-400 group/button w-fit font-manrope text-md text-blue-300 hover:text-blue-200 hover:scale-[1.02] active:scale-[0.98]">
                  Placement Cell Login
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-y-6 gap-x-10 mt-10 sm:gap-y-10 sm:gap-x-16 sm:mt-16 sm:text-center lg:grid-cols-none lg:grid-flow-col lg:auto-cols-auto lg:justify-start lg:text-left">
                {[
                  ["Active Companies", "150+"],
                  ["Students Placed", "5,000+"],
                  ["Success Rate", "85%"],
                  ["Average Package", "₹12 LPA"],
                ].map(([name, value]) => (
                  <div key={name}>
                    <dt className="font-mono text-sm text-gray-400">{name}</dt>
                    <dd className="mt-0.5 text-2xl font-normal tracking-tight text-gray-200 font-manrope">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
          
          {/* Company Marquee */}
          <div className="hidden mr-auto md:block md:w-1/2">
            <CompanyMarquee />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CampusPlace</h3>
              <p className="text-gray-400">
                Revolutionizing campus placements with AI-powered automation and personalized guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Join Groups</li>
                <li>Upload Marksheets</li>
                <li>Check Eligibility</li>
                <li>Interview Prep</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Placement Cells</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Create Groups</li>
                <li>Manage Companies</li>
                <li>Track Applications</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@campusplace.com</li>
                <li>+91 98765 43210</li>
                <li>Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusPlace. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
