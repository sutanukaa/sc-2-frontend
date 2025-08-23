"use client";

import React, { useRef, useEffect, useState } from "react";
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
  const [activeSection, setActiveSection] = useState("home");
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Account for fixed navbar height
      const targetPosition = element.offsetTop - navbarHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1200; // Increased duration for smoother animation
      let start: number | null = null;

      const animateScroll = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min(timestamp - start, duration);
        const ease = easeInOutQuart(progress / duration);
        
        window.scrollTo(0, startPosition + (distance * ease));
        
        if (progress < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  // Smoother easing function for animation
  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "features", "contact"];
      const navbarHeight = 80;
      const scrollPosition = window.scrollY + navbarHeight + 100; // Account for navbar and add buffer

      let currentSection = "home"; // Default to home

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const smoothHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", smoothHandleScroll, { passive: true });
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener("scroll", smoothHandleScroll);
    };
  }, []);

  const navItems = [
    { label: "Home", sectionId: "home" },
    { label: "About", sectionId: "about" },
    { label: "Features", sectionId: "features" },
    { label: "Contact", sectionId: "contact" },
  ];
  
  const heroRef = useRef(null);
  const isInView = useInView(heroRef);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Global Grid Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        {/* Primary Grid Pattern */}
        <div className="absolute inset-0 bg-transparent opacity-50 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Secondary Grid Pattern (larger) */}
        <div className="absolute inset-0 bg-transparent opacity-30 bg-[linear-gradient(to_right,#ffffff_2px,transparent_2px),linear-gradient(to_bottom,#ffffff_2px,transparent_2px)] bg-[size:16rem_16rem]"></div>
      </div>

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300">
        <div className="px-6 py-4">
          <NavigationBar
            logo="/logo.png"
            logoAlt="CampusPlace Logo"
            items={navItems}
            activeSection={activeSection}
            pillColor="#3b82f6"
            pillTextColor="#000000"
            onNavClick={scrollToSection}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative w-full min-h-screen bg-black/80 pt-20 z-20">
        <TopRightShiningLight />
        <TopLeftShiningLight />

        {/* Hero Content */}
        <div className="justify-between md:flex px-6">
          <Container className="relative py-8 ml-auto sm:pt-16 sm:pb-24 md:w-[45%] lg:w-[50%]">
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
          <div className="hidden md:block md:w-[55%] lg:w-[50%] md:ml-8 lg:ml-12 mr-auto">
            <CompanyMarquee />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection id="about" />

      {/* Features Section */}
      <FeaturesSection id="features" />

      {/* Footer */}
      <footer id="contact" className="bg-black/80 text-white py-12 pt-32 relative z-20">
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
