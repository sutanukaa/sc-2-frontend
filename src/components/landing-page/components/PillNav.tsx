"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeHref: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
}

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className,
  ease = "power2.easeOut",
  baseColor = "#000000",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#ffffff",
  pillTextColor = "#000000",
}: PillNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-full max-w-5xl mx-auto w-full",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        {logo ? (
          <img src={logo} alt={logoAlt} className="h-16 w-16 object-contain" />
        ) : (
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CP</span>
          </div>
        )}
        <span className="text-white font-bold text-2xl">CampusPlace</span>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
        {items.map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full"
            style={{
              color: activeHref === item.href || hoveredItem === item.href 
                ? hoveredPillTextColor 
                : '#9ca3af'
            }}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Active/Hover Background Pill */}
            {(activeHref === item.href || hoveredItem === item.href) && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: pillColor }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </motion.a>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Sign Up
        </motion.button>
      </div>
    </motion.nav>
  );
}
