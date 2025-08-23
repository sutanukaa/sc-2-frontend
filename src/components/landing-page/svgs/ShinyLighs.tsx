"use client";

export function TopRightShiningLight() {
  return (
    <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-3xl"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
}

export function TopLeftShiningLight() {
  return (
    <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent blur-3xl"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-radial from-purple-400/30 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
}
