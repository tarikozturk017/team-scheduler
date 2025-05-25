"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

function NavLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`hover:underline ${
        isActive ? "text-blue-900 font-bold underline" : "text-gray-700"
      }`}
    >
      {label}
    </Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-sm px-6 py-4 flex gap-6 border-b">
          <NavLink href="/" label="Dashboard" />
          <NavLink href="/employees" label="Employees" />
          <NavLink href="/shifts" label="Shifts" />
          <NavLink href="/shift-types" label="Shift Types" />
        </nav>
        <main className="p-6">{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
