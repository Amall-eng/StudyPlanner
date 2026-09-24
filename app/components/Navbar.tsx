"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Check, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/courses", label: "Courses" },
    { href: "/assessments", label: "Assessments" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const linkClass = (href: string) =>
    [
      "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
      pathname === href
        ? "bg-indigo-500/15 text-white border border-indigo-400/25"
        : "text-gray-300 hover:text-white hover:bg-white/5",
    ].join(" ");

  return (
    <header className="w-full border-b border-white/10 bg-[#0b0f19]/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <span className="relative inline-flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500/90 ring-2 ring-[#0b0f19]">
              <Check className="h-2.5 w-2.5 text-white" />
            </span>
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            StudyPlanar
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white sm:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div id="mobile-navigation" className="sm:hidden">
          <div className="border-t border-white/10 bg-[#0b0f19]/95 backdrop-blur-md">
            <div className="mx-auto max-w-5xl px-4 py-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={linkClass(l.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}