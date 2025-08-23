import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CampusPlace - Smart Campus Placement Platform",
  description: "Revolutionize your campus placement process with AI-powered automation. Students get personalized guidance while placement cells streamline company coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} font-manrope antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
