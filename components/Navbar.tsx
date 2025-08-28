"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex gap-6 items-center">
        <Link href="/">Accueil</Link>
        <Link href="/toys">Jouets</Link>

        {/* Affiché uniquement si connecté */}
        {session?.user && (
          <>
            <Link href="/profile">Profil</Link>
            <Link href="/post">Poster</Link>
            <Link href="/dashboard">Dashboard</Link>
          </>
        )}

        <div className="ml-auto">
          {session ? (
            <>
              <span className="mr-2">👋 {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-500 hover:underline"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn()}
                className="text-blue-600 hover:underline"
              >
                Se connecter
              </button>
              <Link href="/register" className="ml-4 text-green-600 hover:underline">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
