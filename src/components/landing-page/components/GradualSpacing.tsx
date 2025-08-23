import React from "react";

interface GradualSpacingProps {
  text: string;
  className?: string;
  textClassName?: string;
  visibility?: boolean;
}

export default function GradualSpacing({
  text,
  className = "",
  textClassName = "",
  visibility = true,
}: GradualSpacingProps) {
  return (
    <div className={className}>
      <div className={textClassName}>
        {text.split(" ").map((word, i) => (
          <span
            key={i}
            className={
              "inline-block transition-all duration-700" +
              (visibility ? " opacity-100 translate-y-0" : " opacity-0 translate-y-8")
            }
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
