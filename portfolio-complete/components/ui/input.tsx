"use client";
import { cn } from "@/lib/utils";

export const Input = ({
  className,
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
      "placeholder:text-[var(--text-muted)]",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      outline: "none",
      ...style,
    }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "var(--purple-mid)";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
      props.onFocus?.(e);
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.boxShadow = "none";
      props.onBlur?.(e);
    }}
  />
);
