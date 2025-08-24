"use client";

import React from "react";
import Image from "next/image";
import { OAuthProvider } from "appwrite";
import { account } from "@/lib/appwrite";

interface NavItem {
  label: string;
  sectionId: string;
}

interface NavigationBarProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeSection: string;
  pillColor: string;
  pillTextColor: string;
  onNavClick: (sectionId: string) => void;
}

export default function NavigationBar({
  logo,
  logoAlt,
  items,
  activeSection,
  pillColor,
  pillTextColor,
  onNavClick,
}: NavigationBarProps) {
  const loginWithGoogle = async () => {
    try {
      // Use the redirect URI provided by Appwrite Console
      account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/auth/callback`, // success URL
        `${window.location.origin}/login` // failure URL (optional)
      );
    } catch (error) {
      console.error("OAuth login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  return (
    <nav className="flex items-center justify-between w-full">
      {/* Logo */}
      {logo && (
        <div className="flex items-center">
          <Image
            src={logo}
            alt={logoAlt || "Logo"}
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex items-center space-x-2">
        {items.map((item) => {
          const isActive = item.sectionId === activeSection;
          return (
            <button
              key={item.sectionId}
              onClick={() => onNavClick(item.sectionId)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
              style={{
                backgroundColor: isActive ? pillColor : "transparent",
                color: isActive ? pillTextColor : undefined,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Login and Signup Buttons */}
      <div className="flex items-center space-x-3">
        <button onClick={loginWithGoogle} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200">
          Login
        </button>
      </div>
    </nav>
  );
}
