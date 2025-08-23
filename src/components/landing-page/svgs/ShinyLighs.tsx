import React from "react";

export function TopLeftShiningLight() {
  return (
    <svg width="300" height="300" className="absolute left-0 top-0 z-0 pointer-events-none" style={{filter: 'blur(60px)'}}>
      <circle cx="60" cy="60" r="80" fill="#60a5fa" fillOpacity="0.35" />
      <circle cx="120" cy="120" r="60" fill="#a78bfa" fillOpacity="0.25" />
    </svg>
  );
}

export function TopRightShiningLight() {
  return (
    <svg width="300" height="300" className="absolute right-0 top-0 z-0 pointer-events-none" style={{filter: 'blur(60px)'}}>
      <circle cx="240" cy="60" r="80" fill="#f472b6" fillOpacity="0.35" />
      <circle cx="180" cy="120" r="60" fill="#facc15" fillOpacity="0.25" />
    </svg>
  );
}
