"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export type NavLink = { href: string; label: string };

interface Props {
  logo?: string | null;
  navLinks?: NavLink[];
  profileImage?: string | null;
  profileName?: string | null;
}

const DEFAULT_NAV: NavLink[] = [
  { href: "/about",      label: "About"      },
  { href: "/skills",     label: "Skills"     },
  { href: "/services",   label: "Services"   },
  { href: "/projects",   label: "Work"       },
  { href: "/experience", label: "Experience" },
  { href: "/education",  label: "Education"  },
  { href: "/contact",    label: "Contact"    },
];

/** Small circular avatar — profile photo or initials fallback */
function LogoAvatar({
  src,
  name,
  logoText,
}: {
  src?: string | null;
  name?: string | null;
  logoText?: string | null;
}) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : (logoText ?? "P");

  if (src) {
    return (
      <div
        className="relative h-9 w-9 overflow-hidden rounded-full shrink-0"
        style={{ border: "2px solid rgba(107,78,55,0.25)" }}
      >
        <Image
          src={src}
          alt={name ?? "Profile"}
          fill
          sizes="36px"
          className="object-cover object-top"
          unoptimized={src.startsWith("/uploads/")}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{
        background: "var(--tan)",
        color: "#F5EFE6",
        fontFamily: "var(--font-display)",
      }}
    >
      {initials}
    </div>
  );
}

export function SiteHeader({ logo = "PKT", navLinks, profileImage, profileName }: Props) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const links    = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(245,239,230,0.97)"
            : "rgba(245,239,230,0.85)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(107,78,55,0.12)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(74,55,40,0.06)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo — profile photo or initials */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2.5"
            aria-label="Home"
          >
            <LogoAvatar src={profileImage} name={profileName} logoText={logo} />
            {profileName && (
              <span
                className="hidden sm:block font-bold tracking-tight text-sm"
                style={{ color: "var(--brown-deep)", fontFamily: "var(--font-display)" }}
              >
                {profileName.split(" ")[0]}
              </span>
            )}
          </Link>

          {/* Desktop nav — uppercase tracked Inter */}
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary navigation"
          >
            {links.slice(0, 7).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 transition-colors duration-200"
                style={{
                  fontFamily:    "var(--font-sans)",
                  fontSize:      "0.68rem",
                  fontWeight:    600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: isActive(link.href)
                    ? "var(--brown-deep)"
                    : "var(--text-secondary)",
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute bottom-0.5 left-4 right-4 h-px"
                    style={{ background: "var(--tan)" }}
                  />
                )}
              </Link>
            ))}

            {/* CTA button — pill, brown fill */}
            <Link
              href="/contact"
              className="ml-4 inline-flex items-center rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "var(--brown-deep)",
                color:      "#F5EFE6",
                letterSpacing: "0.12em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--brown)";
                (e.currentTarget as HTMLElement).style.boxShadow  = "0 4px 16px rgba(74,55,40,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--brown-deep)";
                (e.currentTarget as HTMLElement).style.boxShadow  = "none";
              }}
            >
              Let&apos;s Talk
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="rounded-lg p-2 transition-colors lg:hidden"
            style={{ color: "var(--text-secondary)" }}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          style={{ background: "rgba(74,55,40,0.3)", backdropFilter: "blur(4px)" }}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer — focus-trapped dialog */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col lg:hidden transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          background:  "var(--bg-base)",
          borderLeft:  "1px solid var(--border)",
          transform:   open ? "translateX(0)" : "translateX(100%)",
        }}
        // Trap Tab focus inside the drawer when open
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "Escape") { setOpen(false); return; }
          if (e.key !== "Tab") return;
          const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last  = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
          } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
          }
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <LogoAvatar src={profileImage} name={profileName} logoText={logo} />
            {profileName && (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "1rem",
                  fontWeight: 700,
                  color:      "var(--brown-deep)",
                }}
              >
                {profileName.split(" ")[0]}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 mb-0.5 transition-all"
              style={{
                fontFamily:    "var(--font-sans)",
                fontSize:      "0.7rem",
                fontWeight:    600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isActive(link.href) ? "var(--brown-deep)" : "var(--text-secondary)",
                background:    isActive(link.href) ? "rgba(201,168,118,0.12)" : "transparent",
                borderRadius:  "6px",
                borderLeft:    isActive(link.href)
                  ? "2px solid var(--tan)"
                  : "2px solid transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 pb-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-full py-3 text-xs font-semibold uppercase tracking-widest transition-all"
            style={{
              background:    "var(--brown-deep)",
              color:         "#F5EFE6",
              letterSpacing: "0.12em",
            }}
          >
            Let&apos;s Talk
          </Link>
        </div>
      </div>

      <div className="h-[68px]" />
    </>
  );
}
