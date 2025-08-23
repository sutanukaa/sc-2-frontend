"use client";

import React, { useRef } from "react";
import clsx from "clsx";
import { MarqueeDemoVertical } from "./components/Scrolls";
import GradualSpacing from "./components/GradualSpacing";
import PillNav from "./components/PillNav";
import { useInView } from "framer-motion";
import {
  TopLeftShiningLight,
  TopRightShiningLight,
} from "./svgs/ShinyLighs";

export default function CampusPlacementHero() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
  ];
  
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="relative w-full min-h-full bg-black">
      <TopRightShiningLight />
      <TopLeftShiningLight />
      <div className="absolute -z-1 inset-0 h-[600px] w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Navigation */}
      <div className="relative z-20 pt-8 pb-4 px-6">
        <PillNav
          logo="/logo.png"
          logoAlt="CampusPlace Logo"
          items={navItems}
          activeHref="/"
          pillColor="#3b82f6"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>
      <div className="justify-between md:flex px-6">
        <Container className="relative py-8 ml-auto sm:pt-16 sm:pb-24">
          <div ref={ref} className="mx-auto max-w-2xl lg:px-12 lg:max-w-4xl">
            <GradualSpacing
              textClassName="justify-start"
              visibility={isInView}
              className="max-w-2xl text-5xl font-normal tracking-tighter text-white sm:text-7xl font-manrope"
              text={"Smart Campus"}
            />
            <GradualSpacing
              textClassName="justify-start"
              visibility={isInView}
              className="max-w-2xl text-5xl font-normal tracking-tighter text-white sm:text-7xl font-manrope"
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
              <button className="flex gap-2 justify-center items-center py-3 px-8 text-lg tracking-tighter text-center bg-gradient-to-br rounded-md ring-2 ring-offset-2 transition-all hover:ring-transparent group/button w-fit from-blue-500 to-purple-600 font-manrope text-md text-white ring-blue-500/80 ring-offset-black hover:scale-[1.02] active:scale-[0.98] active:ring-blue-500/70">
                Join as Student
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover/button:[animation-delay:.2s] group-hover/button:animate-shineButton rounded-[inherit] bg-[length:200%_100%] bg-[linear-gradient(110deg,transparent,35%,rgba(255,255,255,.7),75%,transparent)]"
                />
              </button>
              
              <button className="flex gap-2 justify-center items-center py-3 px-8 text-lg tracking-tighter text-center border-2 border-gray-600 rounded-md transition-all hover:border-gray-400 group/button w-fit font-manrope text-md text-gray-300 hover:text-white hover:scale-[1.02] active:scale-[0.98]">
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
        <div className="hidden mr-auto md:block md:w-1/2">
          <MarqueeDemoVertical />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 mx-auto opacity-20">
      </div>
    </div>
  );
}

export function Container({
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
