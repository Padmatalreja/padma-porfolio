import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
      style={{
        background: "rgba(201,168,118,0.12)",
        border: "1px solid rgba(201,168,118,0.28)",
        color: "var(--purple-light)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
