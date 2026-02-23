"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "text-white font-semibold underline"
      : "text-gray-200 hover:text-white hover:underline";

  return (
    <header className="sticky top-0 z-50 border-b bg-black/30 backdrop-blur p-4">
      <nav className="mx-auto flex max-w-5xl justify-between">
        <Link href="/" className="font-bold">
          Study Planner
        </Link>

        <div className="flex gap-4 text-sm">
          <Link href="/courses" className={linkClass("/courses")}>
            Courses
          </Link>

          <Link href="/assessments" className={linkClass("/assessments")}>
            Assessments
          </Link>

          <Link href="/availability" className={linkClass("/availability")}>
            Availability
          </Link>

          <Link href="/plan" className={linkClass("/plan")}>
            Plan
          </Link>
        </div>
      </nav>
    </header>
  );
}