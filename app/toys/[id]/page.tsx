"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Heart, MessageSquare, Share2, AlertTriangle, ArrowLeft, RotateCcw, Handshake, Gem, Star,
  ThumbsUp, Wrench, Package, Frown, ToyBrick, Send, Loader2, Gift,
  Bolt, X, Copy, CheckCircle, Facebook, Mail, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useToyDetailTranslations } from "@/hooks/useToyDetailTranslations";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToyDetailPage() {
  const t = useToyDetailTranslations();
  const params = useParams();
  const { data: toy, error, isLoading, mutate: mutateToy } = useSWR(
    params?.id ? `/api/toys/${params.id}` : null,
    fetcher
  );
  const { data: session } = useSession();

  // Utilisez useSWR pour vérifier si le jouet est déjà dans les favoris
  const { data: isFavorite, mutate: mutateIsFavorite } = useSWR(
    session && toy ? `/api/favorites/${toy.id}` : null,
    fetcher
  );

  const isLiked = isFavorite?.isFavorite || false;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const { data: myToysData, isLoading: isLoadingMyToys } = useSWR(
    session ? "/api/toys/mine" : null,
    fetcher
  );

  // Normalise la réponse en tableau quelles que soient la forme/valeur
  const myToysArr = Array.isArray(myToysData)
    ? myToysData
    : Array.isArray(myToysData?.items)
      ? myToysData.items
      : [];
  const availableToys = myToysArr.filter((t: any) => t?.status === "AVAILABLE");
  const [selectedToyId, setSelectedToyId] = useState<string | null>(null);

  // New state for messaging
  const [messageContent, setMessageContent] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const images = toy?.images || [];
  const isAuthor = session?.user?.id === toy?.userId;

  const handleLike = async () => {
    if (!session) {
      toast.error(t.favorites.loginRequired);
      return;
    }

    const method = isLiked ? "DELETE" : "POST";

    // Mise à jour locale optimiste pour une réaction instantanée
    mutateIsFavorite({ isFavorite: !isLiked }, false);

    try {
      const res = await fetch(`/api/favorites/${toy.id}`, { method });

      if (res.ok) {
        toast.success(isLiked ? t.favorites.removedFromFavorites : t.favorites.addedToFavorites);
        // La revalidation a déjà eu lieu localement, pas besoin d'une autre mutation.
      } else {
        toast.error(t.favorites.updateError);
        // En cas d'erreur, on restaure l'état précédent
        mutateIsFavorite({ isFavorite: isLiked }, false);
      }
    } catch (err) {
      toast.error(t.favorites.networkError);
      mutateIsFavorite({ isFavorite: isLiked }, false);
    }
  };

  // New function to send a message
  const handleSendMessage = async () => {
    if (!session) {
      toast.error(t.messaging.loginRequired);
      return;
    }

    if (!messageContent.trim()) {
      toast.error(t.messaging.emptyMessage);
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
        toast.success(t.messaging.messageSent);
        setMessageContent("");
        setShowContactForm(false);
      } else {
        const data = await res.json();
        toast.error(t.getSendError(data.error));
      }
    } catch (err) {
      toast.error(t.messaging.unexpectedError);
      console.error(err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success(t.sharing.linkCopied);
        break;
      default:
        break;
    }
  };

  // Report function
  const handleReport = async () => {
    if (!reportReason) {
      toast.error(t.reporting.selectReason);
      return;
    }

    if (!reportMessage.trim()) {
      toast.error(t.reporting.describeProblemRequired);
      return;
    }

    setIsReporting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toyId: toy.id,
          reason: reportReason,
          message: reportMessage,
          reporterEmail: session?.user?.email
        })
      });

      if (res.ok) {
        toast.success(t.reporting.reportSent);
        setShowReportModal(false);
        setReportReason("");
        setReportMessage("");
      } else {
        const data = await res.json();
        toast.error(t.getReportingError(data.error));
      }
    } catch (err) {
      toast.error(t.reporting.reportError);
    } finally {
      setIsReporting(false);
    }
  };

  // Now, early return conditions
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400 animate-pulse">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">{t.toyNotFound}</h2>
          <p className="text-red-300 mb-6">{t.treasureDisappeared}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={16} className="inline-block mr-2" /> {t.back}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !toy) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce text-purple-400">
              <Package size={48} />
            </div>
          </div>
          <p className="text-white/80 text-xl font-light">{t.unboxingTreasure}</p>
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

  return (
    <>
      <div className="min-h-screen bg-slate-900 relative">

        <div className="relative z-10 pt-24 pb-12 px-6 max-w-6xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="mb-8 group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            {t.backToGallery}
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
                        className={`aspect-square relative overflow-hidden`}
                      >
                        <img
                          src={images[currentImageIndex]?.signedUrl}
                          alt={toy.title}
                          className="w-full h-auto min-h-full object-cover transition-transform duration-100"
                          style={{
                            transform: 'scale(1.05)',
                            userSelect: 'none'
                          }}
                          draggable={false}
                        />
                        {/* Overlay that only appears on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100'
                          }`} />
                        {/* Image navigation */}
                        {images.length > 1 && (
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
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${toy.mode === "EXCHANGE"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : toy.mode === "POINTS"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                      >
                        {getModeIcon(toy.mode)}{" "}
                        {t.getModeLabel(toy.mode)}
                      </span>

                      {/* Badge supplémentaire si mode = POINTS */}
                      {toy.mode === "POINTS" && (
                        <span className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          {toy.pointsCost ?? 0} {t.pointsCost}
                        </span>
                      )}

                      {/* Status badge */}
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${toy.status === "AVAILABLE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : toy.status === "RESERVED"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                      >
                        {t.getStatusLabel(toy.status)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike()}
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
                    <div className="text-purple-300 font-semibold">{t.recommendedAge}</div>
                    <div className="text-white text-xl font-bold">{toy.ageMin}-{toy.ageMax} {t.years}</div>
                  </div>
                  <div className={`rounded-2xl p-4 border bg-orange-500/10 border-orange-500/20`}>
                    <div className={`font-semibold text-orange-300`}>
                      {t.condition}
                    </div>
                    <div className="text-white text-xl font-bold">{t.getConditionLabel(toy.condition)}</div>
                  </div>
                </div>

                {/* Owner info */}
                <Link href={`/user/${toy.user?.id}`}>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          {toy.user?.name?.charAt(0) || toy.user?.email?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1">
                          <div className="text-cyan-300 font-semibold">{t.offeredBy}</div>
                          <div className="text-white font-bold group-hover:text-cyan-300 transition-colors">
                            {toy.user?.name || toy.user?.email?.split('@')[0] || t.anonymousUser}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {t.viewProfile}
                          </div>
                        </div>
                        <div className="text-2xl text-cyan-400 animate-pulse group-hover:scale-110 transition-transform duration-300">
                          <ToyBrick size={32} />
                        </div>
                      </div>
                    </div>
                  </Link>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                {/* Le bouton de contact n'est affiché que si l'utilisateur est connecté et n'est pas l'auteur */}
                {session && !isAuthor && toy.mode !== "EXCHANGE" && (
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-8 py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                      <MessageSquare size={28} />
                      {showContactForm ? t.hideContact : t.contactOwner}
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
                      {t.registerToContact}
                    </span>
                  </Link>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Share2 size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    {t.share}
                  </button>

                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    {t.report}
                  </button>
                </div>
              </div>

              {session && !isAuthor && toy.mode === "EXCHANGE" && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">{t.exchange.proposeExchange}</h3>

                  {isLoadingMyToys ? (
                    <p className="text-gray-400 text-sm">{t.exchange.loadingToys}</p>
                  ) : availableToys.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      {t.exchange.noAvailableToys}
                    </p>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!selectedToyId) {
                          toast.error(t.exchange.chooseToy);
                          return;
                        }

                        setIsSendingMessage(true);

                        const form = e.currentTarget as HTMLFormElement;
                        const message = (form.elements.namedItem("exchangeMessage") as HTMLInputElement).value;

                        const res = await fetch("/api/exchanges", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            toyId: toy.id,
                            proposedToyId: selectedToyId,
                            message,
                          }),
                        });

                        setIsSendingMessage(false);
                        if (res.ok) {
                          toast.success(t.exchange.proposalSent);
                          form.reset();
                          setSelectedToyId(null);
                        } else {
                          const err = await res.json();
                          toast.error("Erreur : " + err.error);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        {availableToys.map((t: any) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setSelectedToyId(t.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedToyId === t.id
                              ? "border-cyan-400 bg-cyan-500/10"
                              : "border-white/20 hover:border-cyan-300"
                              }`}
                          >
                            <img
                              src={t?.images?.[0]?.signedUrl ?? "/placeholder.png"}
                              alt={t.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="text-white">{t.title}</span>
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        name="exchangeMessage"
                        placeholder={t.exchange.optionalMessage}
                        className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 rounded-xl"
                      />

                      <button
                        type="submit"
                        disabled={isSendingMessage}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50"
                      >
                        {isSendingMessage ? t.messaging.sending : t.exchange.sendProposal}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Contact form */}
              {showContactForm && (
                <div className="bg-black/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 space-y-6 animate-slide-down">
                  <div className="text-center">
                    <div className="text-4xl mb-3 text-emerald-400">
                      <MessageSquare size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {t.getContactTitle(toy.user?.name)}
                    </h3>
                    <p className="text-gray-400">{t.messaging.contactSubtitle}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <textarea
                        placeholder={t.messaging.messagePlaceholder}
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
                        {t.messaging.cancel}
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
                          {isSendingMessage ? t.messaging.sending : t.messaging.sendMessage}
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
                  {t.similarToys.title}
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
                  {t.similarToys.viewAllSimilar}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="text-6xl text-cyan-400 mb-4">
                <Share2 size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                {t.sharing.shareTitle}
              </h3>
              <p className="text-gray-300 text-sm">
                {t.sharing.shareSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <Facebook className="w-5 h-5" />
                {t.sharing.shareOnFacebook}
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {t.sharing.copyLink}
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{t.sharing.directLink}</span>
                </div>
                <div className="text-xs text-gray-300 font-mono bg-black/20 p-2 rounded-lg break-all">
                  {shareUrl}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => {
                setShowReportModal(false);
                setReportReason("");
                setReportMessage("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="text-4xl text-red-400 mb-3">
                <AlertTriangle size={48} className="mx-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-1">
                {t.reporting.reportTitle}
              </h3>
              <p className="text-gray-300 text-xs">
                {t.reporting.reportSubtitle}
              </p>
            </div>

            {/* Scrollable content */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.reporting.reportReason}
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'scam', label: t.getReportReason('scam') },
                    { value: 'inappropriate', label: t.getReportReason('inappropriate') },
                    { value: 'condition', label: t.getReportReason('condition') },
                    { value: 'fake', label: t.getReportReason('fake') },
                    { value: 'other', label: t.getReportReason('other') }
                  ].map((reason) => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => setReportReason(reason.value)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-sm ${
                        reportReason === reason.value
                          ? "border-red-400 bg-red-500/10 text-red-300"
                          : "border-white/20 hover:border-red-300 text-gray-300"
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.reporting.describeProblem}
                </label>
                <textarea
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder={t.reporting.problemPlaceholder}
                  rows={3}
                  className="w-full bg-slate-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-red-300 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-red-200">
                    <p className="font-medium mb-1">{t.reporting.confidentialReport}</p>
                    <p className="text-red-200/80">
                      {t.reporting.sentTo} <span className="font-mono text-red-300">support@toy-exchange.org</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed footer buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 flex-shrink-0">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                  setReportMessage("");
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {t.reporting.cancel}
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || !reportMessage.trim() || isReporting}
                className={`flex-1 font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  reportReason && reportMessage.trim() && !isReporting
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isReporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.messaging.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.reporting.send}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}