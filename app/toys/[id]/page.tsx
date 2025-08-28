"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToyDetailPage() {
  const params = useParams();
  const { data: toy, error, isLoading } = useSWR(
    params?.id ? `/api/toys/${params.id}` : null,
    fetcher
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    // Simulate random like state
    setIsLiked(Math.random() > 0.7);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 animate-pulse">💔</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Jouet introuvable</h2>
          <p className="text-red-300 mb-6">Ce trésor semble avoir disparu...</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !toy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">🎁</div>
          </div>
          <p className="text-white/80 text-xl font-light">Déballage du trésor...</p>
        </div>
      </div>
    );
  }

  const images = toy.images || [];
  console.log(images)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Dynamic background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-6xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-8 group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la galerie
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group">
              <div className="aspect-square relative">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]?.signedUrl}
                      alt={toy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Image navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Image indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentImageIndex ? "bg-white" : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <div className="text-8xl animate-bounce">🎮</div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex 
                        ? "ring-2 ring-cyan-400 scale-105" 
                        : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image.signedUrl}
                      alt={`${toy.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toy details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-3 leading-tight">
                    {toy.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                      toy.mode === "exchange" 
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                        : toy.mode === "lend" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}>
                      {toy.mode === "exchange" ? "🔄 Échange" : toy.mode === "lend" ? "🤝 Prêt" : "💰 Vente"}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    isLiked 
                      ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                      : "bg-white/10 text-gray-400 border border-white/20 hover:text-red-400"
                  }`}
                >
                  <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {toy.description}
              </p>

              {/* Key details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                  <div className="text-2xl mb-2">👶</div>
                  <div className="text-purple-300 font-semibold">Âge conseillé</div>
                  <div className="text-white text-xl font-bold">{toy.ageMin}-{toy.ageMax} ans</div>
                </div>
                <div className={`rounded-2xl p-4 border ${
                  toy.condition === "Excellent" 
                    ? "bg-green-500/10 border-green-500/20" 
                    : toy.condition === "Bon"
                    ? "bg-blue-500/10 border-blue-500/20"
                    : "bg-orange-500/10 border-orange-500/20"
                }`}>
                  <div className="text-2xl mb-2">
                    {toy.condition === "Excellent" ? "⭐" : toy.condition === "Bon" ? "👍" : "🔧"}
                  </div>
                  <div className={`font-semibold ${
                    toy.condition === "Excellent" ? "text-green-300" : 
                    toy.condition === "Bon" ? "text-blue-300" : "text-orange-300"
                  }`}>
                    État
                  </div>
                  <div className="text-white text-xl font-bold">{toy.condition}</div>
                </div>
              </div>

              {/* Owner info */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {toy.user?.name?.charAt(0) || toy.user?.email?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-cyan-300 font-semibold">Proposé par</div>
                    <div className="text-white font-bold">
                      {toy.user?.name || toy.user?.email?.split('@')[0] || "Utilisateur anonyme"}
                    </div>
                  </div>
                  <div className="text-2xl animate-pulse">🎪</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-8 py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                  <span className="text-2xl">💬</span>
                  {showContactForm ? "Masquer le contact" : "Contacter le propriétaire"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Partager
                </button>
                
                <button className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Signaler
                </button>
              </div>
            </div>

            {/* Contact form */}
            {showContactForm && (
              <div className="bg-black/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 space-y-6 animate-slide-down">
                <div className="text-center">
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Contactez {toy.user?.name || "le propriétaire"}</h3>
                  <p className="text-gray-400">Envoyez un message pour proposer un échange</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <textarea
                      placeholder="Bonjour ! Je suis intéressé(e) par votre jouet..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300"
                    >
                      Annuler
                    </button>
                    <button className="group relative overflow-hidden flex-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        🚀 Envoyer le message
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Related toys suggestion */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Jouets similaires
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Placeholder similar toys */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {['🧸', '🚂', '🎨'][i - 1]}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 text-sm">
                Voir tous les jouets similaires →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
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
          animation: slide-down 0.3s ease-out;
        }

        .flex-2 {
          flex: 2;
        }
      `}</style>
    </div>
  );
}