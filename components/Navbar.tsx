"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/toys", label: "Jouets" },
  { href: "/post", label: "Poster" },
  { href: "/profile", label: "Profil" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex gap-6">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                active ? "text-blue-600 font-semibold" : "text-gray-700"
              } hover:text-blue-500`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
