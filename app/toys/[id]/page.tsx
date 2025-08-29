"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Heart, MessageSquare, Share2, AlertTriangle, ArrowLeft, RotateCcw, Handshake, Gem, Star, 
  ThumbsUp, Wrench, Package, Frown, ToyBrick, Send, Loader2, Gift,
  Bolt
} from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToyDetailPage() {
  const params = useParams();
  const { data: toy, error, isLoading } = useSWR(
    params?.id ? `/api/toys/${params.id}` : null,
    fetcher
  );

  const { data: session } = useSession();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  
  // New state for messaging
  const [messageContent, setMessageContent] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const images = toy?.images || [];
  const isAuthor = session?.user?.id === toy?.userId;

  useEffect(() => {
    const mainImageContainer = document.getElementById('main-image-container');
    if (images[currentImageIndex]?.offsetYPercentage !== undefined && mainImageContainer) {
      const containerHeight = mainImageContainer.offsetHeight;
      const pixelOffset = (images[currentImageIndex].offsetYPercentage / 100) * containerHeight;
      setDragY(pixelOffset);
    } else {
      setDragY(0);
    }
  }, [currentImageIndex, images]);

  // Drag functions - only available to the author
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAuthor) return;
    setIsDragging(true);
    setLastMouseY(e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - lastMouseY;
    setDragY(prev => prev + deltaY);
    setLastMouseY(e.clientY);
  };

  const handleMouseUp = async (e: React.MouseEvent | React.DragEvent) => {
    if (isDragging && images[currentImageIndex]) {
      const imageElement = e.target as HTMLElement;
      const containerHeight = imageElement.parentElement?.offsetHeight || 1;
      const newOffsetPercentage = (dragY / containerHeight) * 100;

      await fetch(`/api/images/${images[currentImageIndex].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offsetYPercentage: newOffsetPercentage })
      });
    }
    setIsDragging(false);
  };

  // New function to send a message
  const handleSendMessage = async () => {
    if (!session) {
        alert("Vous devez être connecté pour envoyer un message.");
        return;
    }

    if (!messageContent.trim()) {
        alert("Le message ne peut pas être vide.");
        return;
    }

    setIsSendingMessage(true);
    
    try {
        const res = await fetch(`/api/conversations/${toy.id}/messages?partnerId=${toy.userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: messageContent,
                receiverId: toy.userId
            })
        });

        if (res.ok) {
            alert("Message envoyé avec succès!");
            setMessageContent("");
            setShowContactForm(false);
        } else {
            const data = await res.json();
            alert(`Erreur lors de l'envoi du message: ${data.error}`);
        }
    } catch (err) {
        alert("Une erreur inattendue est survenue.");
        console.error(err);
    } finally {
        setIsSendingMessage(false);
    }
  };

  // Now, early return conditions
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400 animate-pulse">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Jouet introuvable</h2>
          <p className="text-red-300 mb-6">Ce trésor semble avoir disparu...</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={16} className="inline-block mr-2" /> Retour
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
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce text-purple-400">
              <Package size={48} />
            </div>
          </div>
          <p className="text-white/80 text-xl font-light">Déballage du trésor...</p>
        </div>
      </div>
    );
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "EXCHANGE":
        return <RotateCcw size={18} />;
      case "POINTS":
        return <Bolt size={18} />;
      case "DON":
        return <Gift size={18} />;
      default:
        return null;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return <Star size={24} />;
      case "Bon":
        return <ThumbsUp size={24} />;
      case "Moyen":
        return <Wrench size={24} />;
      default:
        return null;
    }
  };

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
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Retour à la galerie
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div id="main-image-container" className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group">
              <div className="aspect-square relative">
                {images.length > 0 ? (
                  <>
                    <div
                      className={`aspect-square relative overflow-hidden ${isAuthor ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      onMouseDown={isAuthor ? handleMouseDown : undefined}
                      onMouseMove={isAuthor ? handleMouseMove : undefined}
                      onMouseUp={isAuthor ? handleMouseUp : undefined}
                      onMouseLeave={isAuthor ? handleMouseUp : undefined}
                    >
                      <img
                        src={images[currentImageIndex]?.signedUrl}
                        alt={toy.title}
                        className="w-full h-auto min-h-full object-cover transition-transform duration-100"
                        style={{
                          transform: `translateY(${dragY}px) ${isDragging ? '' : 'scale(1.05)'}`,
                          userSelect: 'none'
                        }}
                        draggable={false}
                      />
                      {/* Overlay that only appears on hover, not during drag */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                        }`} />
                      {/* Image navigation */}
                      {images.length > 1 && !isDragging && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ArrowLeft size={20} className="transform rotate-180" />
                          </button>

                          {/* Image indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <div className="text-8xl animate-bounce text-gray-400">
                      <ToyBrick size={96} />
                    </div>
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
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${index === currentImageIndex
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
                    <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${toy.mode === "EXCHANGE"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : toy.mode === "POINTS"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}>
                      {getModeIcon(toy.mode)} {toy.mode === "EXCHANGE" ? "Échange" : toy.mode === "POINTS" ? "Points" : "Don"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${isLiked
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/10 text-gray-400 border border-white/20 hover:text-red-400"
                    }`}
                >
                  <Heart size={24} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {toy.description}
              </p>

              {/* Key details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                  <div className="text-2xl mb-2 text-purple-300">
                    <Gem size={32} />
                  </div>
                  <div className="text-purple-300 font-semibold">Âge conseillé</div>
                  <div className="text-white text-xl font-bold">{toy.ageMin}-{toy.ageMax} ans</div>
                </div>
                <div className={`rounded-2xl p-4 border ${toy.condition === "Excellent"
                  ? "bg-green-500/10 border-green-500/20"
                  : toy.condition === "Bon"
                    ? "bg-blue-500/10 border-blue-500/20"
                    : "bg-orange-500/10 border-orange-500/20"
                  }`}>
                  <div className="text-2xl mb-2 text-white">
                    {getConditionIcon(toy.condition)}
                  </div>
                  <div className={`font-semibold ${toy.condition === "Excellent" ? "text-green-300" :
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
                  <div className="text-2xl text-cyan-400 animate-pulse">
                    <ToyBrick size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              {/* Le bouton de contact n'est affiché que si l'utilisateur est connecté et n'est pas l'auteur */}
              {session && !isAuthor && (
                <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-8 py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                    <MessageSquare size={28} />
                    {showContactForm ? "Masquer le contact" : "Contacter le propriétaire"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              )}
              {/* Le bouton s'inscrire s'il n'y a pas de session active */}
              {!session && (
                  <Link 
                      href="/register" 
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center"
                  >
                      <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                        <MessageSquare size={28} />
                        S'inscrire pour contacter
                      </span>
                  </Link>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <Share2 size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  Partager
                </button>

                <button className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <AlertTriangle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  Signaler
                </button>
              </div>
            </div>

            {/* Contact form */}
            {showContactForm && (
              <div className="bg-black/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 space-y-6 animate-slide-down">
                <div className="text-center">
                  <div className="text-4xl mb-3 text-emerald-400">
                    <MessageSquare size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Contactez {toy.user?.name || "le propriétaire"}</h3>
                  <p className="text-gray-400">Envoyez un message pour proposer un échange</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <textarea
                      placeholder="Bonjour ! Je suis intéressé(e) par votre jouet..."
                      rows={4}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
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
                    <button 
                      onClick={handleSendMessage}
                      disabled={isSendingMessage}
                      className="group relative overflow-hidden flex-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSendingMessage ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Send size={20} />
                        )}
                        {isSendingMessage ? "Envoi..." : "Envoyer le message"}
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
                <ToyBrick size={24} />
                Jouets similaires
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Placeholder similar toys */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      <ToyBrick size={32} />
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