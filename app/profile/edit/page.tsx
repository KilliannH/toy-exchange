"use client";

import { useState, useEffect } from "react";

export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setCity(data.city || "");
        setRadiusKm(data.radiusKm || 10);
        setInitialLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city, radiusKm }),
    });
    
    setSaved(true);
    setLoading(false);
    
    setTimeout(() => setSaved(false), 3000);
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white/80 text-lg">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-3xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-8 group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au profil
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce">✏️</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Modifier mon profil
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Personnalisez votre expérience d'échange
          </p>
        </div>

        {/* Success banner */}
        {saved && (
          <div className="mb-8 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 text-center animate-slide-down">
            <div className="flex items-center justify-center gap-3 text-emerald-300">
              <div className="text-2xl animate-bounce">✅</div>
              <span className="font-semibold">Profil mis à jour avec succès !</span>
            </div>
          </div>
        )}

        {/* Main form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="space-y-6">
              {/* Name field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="Comment souhaitez-vous être appelé ?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* City field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">🏙️</span>
                  Ville
                </label>
                <input
                  type="text"
                  placeholder="Dans quelle ville habitez-vous ?"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Radius slider */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  Rayon de recherche
                </label>
                <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">{radiusKm} kilomètres</span>
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Zone d'échange
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1 km</span>
                    <span>Proximité</span>
                    <span>100 km</span>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">💾</span>
                      Sauvegarder les modifications
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Preview section */}
          <div className="space-y-6">
            {/* Preview card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                Aperçu du profil
              </h2>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {name || "Nom non défini"}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {city || "Ville non définie"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📍</div>
                    <div>
                      <div className="text-cyan-300 font-semibold">Zone d'échange</div>
                      <div className="text-white font-bold text-lg">{radiusKm} km autour de vous</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Conseils
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    icon: "🎯",
                    title: "Nom visible",
                    desc: "Utilisez votre vrai prénom pour inspirer confiance",
                    color: "blue"
                  },
                  {
                    icon: "🏘️",
                    title: "Ville précise",
                    desc: "Facilitez les rencontres avec une localisation exacte",
                    color: "green"
                  },
                  {
                    icon: "📏",
                    title: "Rayon optimal",
                    desc: "10-30km offre un bon équilibre choix/proximité",
                    color: "purple"
                  }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="text-xl">{tip.icon}</div>
                    <div className="flex-1">
                      <div className={`text-${tip.color}-300 font-medium text-sm`}>{tip.title}</div>
                      <div className="text-gray-400 text-xs">{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy notice */}
            <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="text-yellow-300 font-semibold mb-2">Confidentialité</h4>
                  <p className="text-yellow-200/80 text-sm leading-relaxed">
                    Vos informations ne sont visibles que par les autres membres lors d'échanges confirmés. 
                    Votre email reste toujours privé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #06b6d4 0%, #8b5cf6 100%);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}