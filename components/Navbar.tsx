"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          ToyExchange
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group"
          >
            Accueil
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
          </Link>
          
          <Link 
            href="/toys" 
            className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group"
          >
            Jouets
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Authenticated user links */}
          {session?.user && (
            <>
              <Link 
                href="/post" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                + Poster
              </Link>
              
              <Link 
                href="/dashboard" 
                className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group"
              >
                Dashboard
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </>
          )}
        </div>

        {/* User section */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {/* User info - clickable profile */}
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {(session.user?.name || session.user?.email)?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors duration-300">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
              </Link>
              
              {/* Logout button */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group text-white/70 hover:text-red-400 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                title="Se déconnecter"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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

        {/* Mobile menu button (you can expand this for mobile nav) */}
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}