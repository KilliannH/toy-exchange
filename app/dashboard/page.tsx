"use client";

import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useState } from "react";
import EditToyForm from "@/components/EditToyForm";
import {
  AlertTriangle,
  Loader2,
  BarChart3,
  RefreshCw,
  MessageSquare,
  Star,
  Gamepad2,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Heart,
  ToyBrick,
  X,
  User,
  Calendar,
  ThumbsUp
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDashboardTranslations } from '@/hooks/useDashboardTranslations';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Normalise n'importe quelle réponse en tableau
function toArray<T = any>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  // Cas API qui renvoie {data: [...]}
  if (Array.isArray(data?.data)) return data.data as T[];
  return [];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useDashboardTranslations();

  const { data: toysData, error: toysError, isLoading: toysLoading } = useSWR("/api/toys/mine", fetcher);
  const { data: stats } = useSWR("/api/profile/stats", fetcher);

  const { data: exchangesData, error: exchangesError, isLoading: exchangesLoading } = useSWR(
    "/api/exchanges/mine",
    fetcher
  );

  const { data: favoritesData, error: favoritesError, isLoading: favoritesLoading } = useSWR(
    session ? "/api/favorites" : null,
    fetcher
  );

  // Charger les reviews pour la popup
  const { data: reviewsData } = useSWR("/api/reviews/mine", fetcher);

  // Normalisation en tableaux
  const toysArr = toArray(toysData);
  const exchangesArr = toArray(exchangesData);
  const favoritesArr = toArray(favoritesData);
  const reviewsArr = toArray(reviewsData);

  const [editingToy, setEditingToy] = useState<any | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  async function handleDelete(toyId: string) {
    if (!confirm(t.myToys.confirmDelete)) return;
    const res = await fetch(`/api/toys/${toyId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t.myToys.deleteError);
    } else {
      toast.success(t.myToys.deleteSuccess);
      mutate(
        "/api/toys/mine",
        (prev: any) => toArray(prev).filter((toy: any) => toy.id !== toyId),
        false
      );
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (toysError || exchangesError || favoritesError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">{t.errorTitle}</h2>
          <p className="text-red-300">{t.dataLoadError}</p>
        </div>
      </div>
    );
  }

  if (
    toysLoading || !toysData ||
    exchangesLoading || (session && !exchangesData) ||
    favoritesLoading || (session && !favoritesData)
  ) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg">{t.loadingTreasures}</p>
        </div>
      </div>
    );
  }

  const toysCount = stats?.toysCount ?? toysArr.length ?? 0;
  const exchangesCount = stats?.exchangesCount ?? exchangesArr.length ?? 0;
  const unreadMessages = stats?.unreadMessages ?? 0;
  const avgRating = typeof stats?.avgRating === "number" ? stats.avgRating.toFixed(1) : "N/A";
  const points = stats?.points ?? session?.user?.points ?? 0;

  // Configuration des cards avec actions
  const statsCards = [
    {
      label: t.stats.myToys,
      value: toysCount,
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      action: () => scrollToSection('mes-jouets')
    },
    {
      label: t.stats.activeExchanges,
      value: exchangesCount,
      icon: <RefreshCw className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      action: () => scrollToSection('mes-echanges')
    },
    {
      label: t.stats.messages,
      value: unreadMessages,
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      action: () => router.push('/messages')
    },
    {
      label: t.stats.averageRating,
      value: avgRating,
      icon: <Star className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      action: () => setShowReviewsModal(true)
    },
    {
      label: t.stats.myPoints,
      value: points,
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-emerald-500 to-green-500",
      action: () => router.push('/points')
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-900 relative">
        {/* Animated background */}

        <div className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 font-light">
              {t.pageSubtitle}
            </p>
          </div>

          {/* Stats cards - Now clickable */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {statsCards.map((stat, i) => (
              <div
                key={i}
                onClick={stat.action}
                className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300 ${stat.action ? 'cursor-pointer' : ''
                  }`}
              >
                <div className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
                {stat.action && stat.label !== t.stats.myPoints && (
                  <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.getClickAction(stat.label)}
                  </div>
                )}
                {stat.label === t.stats.myPoints && (
                  <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.getClickAction(stat.label, true)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Editing form */}
          {editingToy && (
            <div className="mb-8 bg-black/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8">
              <EditToyForm toy={editingToy} onClose={() => setEditingToy(null)} />
            </div>
          )}

          {/* === SECTION: Mes jouets === */}
          <div className="mt-8" id="mes-jouets">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">{t.getSectionTitle('myToys', toysArr.length)}</h2>
              <Link
                href="/post"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t.myToys.addToy}
              </Link>
            </div>

            {toysArr.length === 0 ? (
              <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="text-8xl mb-6 text-gray-500">
                  <Gamepad2 size={96} className="mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{t.myToys.emptyTitle}</h2>
                <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                  {t.myToys.emptyDescription}
                </p>
                <Link
                  href="/post"
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {t.myToys.addFirstToy}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {toysArr.map((toy: any, index: number) => (
                  <div
                    key={toy.id}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                    <div className="relative z-10">
                      {/* Toy header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                            {toy.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {toy.description}
                          </p>
                        </div>
                        <div className="ml-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                          <Gamepad2 className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Toy details */}
                      <div className="flex items-center gap-4 mb-6">
                        {(toy.ageMin != null || toy.ageMax != null) && (
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                            {toy.ageMin ?? "?"}-{toy.ageMax ?? "?"} {t.myToys.years}
                          </span>
                        )}
                        {toy.condition && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-orange-500/10 border-orange-500/20 font-medium text-orange-300">
                            {t.getConditionLabel(toy.condition)}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/toys/${toy.id}`}
                          className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{t.myToys.viewDetails}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingToy(toy)}
                            className="group/btn p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg transition-all duration-200"
                            title={t.myToys.edit}
                          >
                            <Edit className="w-4 h-4 text-yellow-400 group-hover/btn:scale-110 transition-transform duration-200" />
                          </button>

                          <button
                            onClick={() => handleDelete(toy.id)}
                            className="group/btn p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all duration-200"
                            title={t.myToys.delete}
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Mes favoris */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">{t.getSectionTitle('favorites', favoritesArr.length)}</h2>
            </div>

            {favoritesLoading ? (
              <div className="text-center text-gray-400">{t.favorites.loading}</div>
            ) : favoritesError ? (
              <div className="text-center text-red-400">{t.favorites.error}</div>
            ) : favoritesArr.length === 0 ? (
              <div className="text-center py-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <Heart size={96} className="text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">{t.favorites.emptyTitle}</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {t.favorites.emptyDescription}
                </p>
                <Link
                  href="/toys"
                  className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <ToyBrick size={20} />
                  {t.favorites.discoverToys}
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favoritesArr.map((fav: any) => {
                  const img0 = fav?.toy?.images?.[0];
                  const signedUrl = img0?.signedUrl;
                  const title = fav?.toy?.title ?? t.favorites.toy;
                  const ownerName = fav?.toy?.user?.name || fav?.toy?.user?.email || t.favorites.member;
                  const toyId = fav?.toy?.id;

                  return (
                    <div
                      key={fav.id ?? `${toyId}-${title}`}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white/10">
                          {signedUrl ? (
                            <img
                              src={signedUrl}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <ToyBrick className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            {t.getOfferedBy(ownerName)}
                          </p>
                          {toyId && (
                            <Link
                              href={`/toys/${toyId}`}
                              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              {t.favorites.viewDetails}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section Mes échanges */}
          <div className="mt-16" id="mes-echanges">
            <h2 className="text-3xl font-bold text-white mb-8">{t.getSectionTitle('exchanges', exchangesArr.length)}</h2>

            {exchangesLoading ? (
              <div className="text-center text-gray-400">{t.exchanges.loading}</div>
            ) : exchangesError ? (
              <div className="text-center text-red-400">{t.exchanges.error}</div>
            ) : exchangesArr.length === 0 ? (
              <div className="text-center text-gray-400">{t.exchanges.empty}</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {exchangesArr.map((ex: any) => {
                  const toyTitle = ex?.toy?.title ?? t.favorites.toy;
                  const toyId = ex?.toy?.id;
                  const requesterName = ex?.requester?.name || ex?.requester?.email || t.favorites.member;
                  const status: string = ex?.status ?? "PENDING";
                  const myId = session?.user?.id;

                  let partnerId: string | undefined;
                  if (ex?.requesterId === myId) {
                    partnerId = ex?.toy?.user?.id; // je suis le demandeur → partenaire = propriétaire du jouet
                  } else {
                    partnerId = ex?.requesterId; // je suis le propriétaire → partenaire = demandeur
                  }

                  return (
                    <div
                      key={ex.id ?? `${toyId}-ex`}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-white mb-2">
                        {toyTitle}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {t.getProposedBy(requesterName)}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : status === "ACCEPTED"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : status === "REJECTED"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            }`}
                        >
                          {t.getExchangeStatus(status)}
                        </span>
                      </div>

                      {toyId && partnerId && (
                        <Link
                          href={`/messages/${toyId}?partnerId=${partnerId}`}
                          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {t.exchanges.openConversation}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Reviews */}
      {showReviewsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-yellow-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowReviewsModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="text-6xl text-yellow-400 mb-4">
                <Star size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                {t.reviews.getModalTitle(reviewsArr.length)}
              </h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {avgRating} ⭐
              </div>
            </div>

            {reviewsArr.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">{t.reviews.empty}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsArr.slice(0, 10).map((review: any, index: number) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {review.reviewer?.name || t.reviews.user}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.formatTimeAgo(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-300 text-sm">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}