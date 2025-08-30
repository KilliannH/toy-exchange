"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Lock, Sparkles, Gamepad2, ToyBrick, Gem, Rocket, Sun, Star, Tent, CheckCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-10 animate-float"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '8s'
            }}
          >
            {/* Using Lucide React icons instead of emojis */}
            {i === 0 && <Lock size={24} />}
            {i === 1 && <Sparkles size={24} />}
            {i === 2 && <Gamepad2 size={24} />}
            {i === 3 && <ToyBrick size={24} />}
            {i === 4 && <Gem size={24} />}
            {i === 5 && <Rocket size={24} />}
            {i === 6 && <Sun size={24} />}
            {i === 7 && <Star size={24} />}
          </div>
        ))}
      </div>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-lg pt-15">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 text-cyan-400">
              <Tent size={64} className="mx-auto" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Bon retour !
            </h1>
            <p className="text-gray-300 font-light">
              Connectez-vous pour accéder à vos jouets
            </p>
          </div>

          <div className="space-y-6">
            {/* Email field */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Password field */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Submit button */}
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Rocket size={20} /> Se connecter
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-gray-400 text-sm font-medium">ou</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Google sign in */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="group relative overflow-hidden w-full bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="group-hover:text-cyan-300 transition-colors duration-300">
              Continuer avec Google
            </span>
          </button>

          {/* Footer links */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200">
                Créer un compte
              </a>
            </p>
            <p className="text-gray-500 text-xs">
              <a href="/forgot-password" className="hover:text-gray-400 transition-colors duration-200">
                Mot de passe oublié ?
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-25px) rotate(10deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
          75% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}