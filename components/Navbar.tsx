"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Home, Package, Plus, BarChart3, LogOut, Menu, User, MessageSquare } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const { data: unreadData } = useSWR(session ? '/api/messages/unread' : null, fetcher);
  const unreadCount = unreadData?.count || 0;

  const handleSignOut = async () => {
    // Call signOut, then force a hard refresh to clear all state
    await signOut({ redirect: false }); // Prevents NextAuth from doing its own redirect
    router.push('/'); // Manually push to the homepage
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2'
      : 'bg-transparent py-4'
      }`}>
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          aria-label="ToyExchange - Accueil"
        >
          <Image
            src="/logo-cropped-inverted.png"
            alt="ToyExchange"
            width={420}
            height={420}
            priority
            className="h-9 w-9"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">

          {session?.user && (
            <>
              <Link
                href="/"
                className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
              >
                <Home size={18} />
                Accueil
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/toys"
                className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
              >
                <Package size={18} />
                Jouets
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
              {/* Bouton pour poster un jouet */}
              <Link
                href="/post"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={18} />
                Poster
              </Link>

              {/* Lien pour les messages avec pastille de notification */}
              <Link
                href="/messages"
                className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
              >
                <MessageSquare size={18} />
                Messages
                {unreadCount > 0 && (
                  <>
                    {/* Pastille clignotante */}
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-ping" />
                    {/* Pastille pleine */}
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  </>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Lien pour le dashboard */}
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
              >
                <BarChart3 size={18} />
                Dashboard
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  <User size={16} />
                </div>
                <span className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors duration-300">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="group text-white/70 hover:text-red-400 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                title="Se déconnecter"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn()}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 px-4 py-2 hover:bg-white/10 rounded-lg"
              >
                Se connecter
              </button>
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-white p-2">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}