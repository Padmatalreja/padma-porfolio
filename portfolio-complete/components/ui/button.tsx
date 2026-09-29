"use client";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "danger" | "gradient";

const variantStyles: Record<Variant, React.CSSProperties> = {
  default: {
    background:   "var(--brown-deep)",
    color:        "#F5EFE6",
    border:       "1px solid transparent",
    borderRadius: "9999px",
  },
  gradient: {
    background:   "var(--brown-deep)",
    color:        "#F5EFE6",
    border:       "1px solid transparent",
    borderRadius: "9999px",
  },
  outline: {
    background:   "transparent",
    color:        "var(--brown-deep)",
    border:       "1.5px solid var(--brown-deep)",
    borderRadius: "9999px",
  },
  ghost: {
    background:   "transparent",
    color:        "var(--text-secondary)",
    border:       "1px solid transparent",
    borderRadius: "var(--radius-md)",
  },
  danger: {
    background:   "var(--error-bg)",
    color:        "var(--error)",
    border:       "1px solid var(--error-border)",
    borderRadius: "var(--radius-md)",
  },
};

const hoverStyles: Record<Variant, React.CSSProperties> = {
  default:  { background: "var(--brown)", boxShadow: "var(--shadow-btn)" },
  gradient: { background: "var(--brown)", boxShadow: "var(--shadow-btn)" },
  outline:  { background: "var(--brown-deep)", color: "#F5EFE6" },
  ghost:    { background: "rgba(107,78,55,0.06)", color: "var(--text-primary)" },
  danger:   { background: "rgba(184,92,74,0.16)", borderColor: "var(--error)" },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  className,
  variant = "default",
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
      onMouseEnter={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, hoverStyles[variant]);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, variantStyles[variant]);
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function buttonVariantClass(variant: Variant = "default") {
  return cn(
    "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200"
  );
}
