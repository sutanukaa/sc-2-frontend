"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradualSpacingProps {
  text: string;
  className?: string;
  textClassName?: string;
  visibility?: boolean;
}

export default function GradualSpacing({
  text,
  className,
  textClassName,
  visibility = true,
}: GradualSpacingProps) {
  const letters = text.split("");
  
  return (
    <div className={cn("flex", textClassName)}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={visibility ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            delay: index * 0.05,
            duration: 0.5,
            ease: "easeOut",
          }}
          className={cn("inline-block", className)}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}
