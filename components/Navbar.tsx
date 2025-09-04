"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Package, Plus, BarChart3, LogOut, Menu, User, MessageSquare, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: unreadData } = useSWR(session ? '/api/messages/unread' : null, fetcher);
  const { data: avatarData } = useSWR(session ? "/api/profile/avatar" : null, fetcher);
  const unreadCount = unreadData?.count || 0;

  const handleSignOut = async () => {
    // Call signOut, then force a hard refresh to clear all state
    await signOut({ redirect: false }); // Prevents NextAuth from doing its own redirect
    router.push('/'); // Manually push to the homepage
    setMobileMenuOpen(false); // Close mobile menu
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2'
        : 'bg-transparent py-4'
        }`}>
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Image
              src="/circus-tent.svg"
              alt="ToyExchange logo"
              width={32}
              height={32}
              className="w-8 h-8 -translate-y-1.5"
            />
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">ToyExchange</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {session?.user && (
              <>
                <Link
                  href="/toys"
                  className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
                >
                  <Package size={18} />
                  Jouets
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  href="/post"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Poster
                </Link>
                <Link
                  href="/messages"
                  className="text-white/80 hover:text-white font-medium hover:scale-105 transition-all duration-200 relative group flex items-center gap-2"
                >
                  <MessageSquare size={18} />
                  Messages
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-ping" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </>
                  )}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
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

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="relative group w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400 relative z-10">
                      {avatarData?.image ? (
                        <img
                          src={avatarData.image}
                          alt={session.user?.name || "Avatar"}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 mobile-menu-button relative z-60"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Image
                src="/circus-tent.svg"
                alt="ToyExchange logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ToyExchange</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 hover:text-white p-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {session ? (
              <>
                {/* User Profile Section */}
                <div className="px-6 mb-6">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-white font-medium group-hover:text-cyan-300 transition-colors duration-300">
                        {session.user?.name || session.user?.email?.split('@')[0]}
                      </div>
                      <div className="text-gray-400 text-sm">Voir le profil</div>
                    </div>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 px-6 mb-6">

                  <Link
                    href="/toys"
                    className="flex items-center gap-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-4 transition-all duration-300 group"
                    onClick={closeMobileMenu}
                  >
                    <Package size={20} className="text-purple-400" />
                    <span className="font-medium">Jouets</span>
                  </Link>

                  <Link
                    href="/messages"
                    className="flex items-center gap-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-4 transition-all duration-300 group relative"
                    onClick={closeMobileMenu}
                  >
                    <MessageSquare size={20} className="text-blue-400" />
                    <span className="font-medium">Messages</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-4 transition-all duration-300 group"
                    onClick={closeMobileMenu}
                  >
                    <BarChart3 size={20} className="text-green-400" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </div>

                {/* CTA Button */}
                <div className="px-6 mb-6">
                  <Link
                    href="/post"
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <Plus size={20} />
                    Poster un jouet
                  </Link>
                </div>
              </>
            ) : (
              // Non-authenticated state
              <div className="px-6 space-y-4">
                <button
                  onClick={() => {
                    signIn();
                    closeMobileMenu();
                  }}
                  className="w-full text-white/80 hover:text-white font-medium transition-colors duration-200 py-4 px-6 hover:bg-white/10 rounded-xl text-left"
                >
                  Se connecter
                </button>
                <Link
                  href="/register"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-center"
                  onClick={closeMobileMenu}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          {session && (
            <div className="border-t border-white/10 p-6">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl p-4 w-full transition-all duration-300 group"
              >
                <LogOut size={20} />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}