// Utility function for className concatenation (like clsx/twMerge)
export function cn(...args: (string | undefined | null | false)[]): string {
  return args.filter(Boolean).join(" ");
}
