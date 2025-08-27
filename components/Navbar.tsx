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
        <Link href="/post">Poster</Link>
        <Link href="/profile">Profil</Link>
        <div className="ml-auto">
          {session ? (
            <>
              <span className="mr-2">Bonjour {session.user?.name}</span>
              <button onClick={() => signOut()} className="text-red-500">Se déconnecter</button>
            </>
          ) : (
            <>
              <button onClick={() => signIn("credentials")} className="text-blue-600">
                Se connecter
              </button>
              <Link href="/register" className="text-green-600 ml-4">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
