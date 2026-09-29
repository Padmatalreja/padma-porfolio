"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade" | "scale";
  className?: string;
}

/** Basic scroll-reveal — fades + slides in when element enters viewport */
export function MotionReveal({ children, delay = 0, direction = "up", className }: Props) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translateMap = {
    up:    "translateY(22px)",
    left:  "translateX(-22px)",
    right: "translateX(22px)",
    fade:  "none",
    scale: "scale(0.94)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "none" : translateMap[direction],
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                     transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger reveal — children animate in one by one */
export function StaggerReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`stagger-children${visible ? " in-view" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}

/** Animated hairline rule that draws from left to right on scroll */
export function LineDraw({
  width = 64,
  className,
  delay = 0,
}: {
  width?: number;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height:           "1.5px",
        background:       "var(--tan)",
        width:            visible ? `${width}px` : 0,
        transition:       `width 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        transitionDelay:  `${delay}s`,
      }}
    />
  );
}

/** Counts up from 0 to a target number when it enters view */
export function CountUp({
  target,
  suffix = "",
  className,
  style,
}: {
  target: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref     = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || target === 0) return;
    const duration = 1200;
    const steps    = Math.min(target, 60);
    const stepTime = duration / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span ref={ref} className={className} style={style}>
      {count}{suffix}
    </span>
  );
}

/** Tilt card — subtle 3D perspective shift following the cursor */
export function TiltCard({
  children,
  className,
  style,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(4px)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt${className ? ` ${className}` : ""}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
