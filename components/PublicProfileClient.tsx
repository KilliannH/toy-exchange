"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Gamepad2,
  RefreshCw,
  Star,
  Trophy,
  Award,
  Heart,
  Book,
  Target,
  Crown,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  ToyBrick,
  Package
} from "lucide-react";
import { usePublicProfileClientTranslations } from "@/hooks/usePublicProfileClientTranslations";

interface User {
  id: string;
  name?: string;
  city?: string;
  createdAt: Date;
  toys: {
    id: string;
    title: string;
    images: { url: string }[];
    mode: string;
    createdAt: Date;
  }[];
}

interface Stats {
  toysCount: number;
  exchangesCount: number;
  donationsCount: number;
  avgRating: number;
  memberSince: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  reviewer: {
    id: string;
    name?: string;
  };
}

interface PublicProfileClientProps {
  user: User;
  stats: Stats;
  recentReviews: Review[];
}

export default function PublicProfileClient({ user, stats, recentReviews }: PublicProfileClientProps) {
  const t = usePublicProfileClientTranslations();
  const monthsSinceJoin = stats.memberSince !== t.header.defaultUser ? parseInt(stats.memberSince) : 0;

  const badges = [
    {
      name: t.badges.firstExchange,
      icon: <Award className="w-5 h-5" />,
      earned: stats.exchangesCount >= 1,
      description: t.badges.firstExchangeDesc
    },
    {
      name: t.badges.generous,
      icon: <Heart className="w-5 h-5" />,
      earned: stats.donationsCount >= 3,
      description: t.badges.generousDesc
    },
    {
      name: t.badges.collector,
      icon: <Book className="w-5 h-5" />,
      earned: stats.toysCount >= 10,
      description: t.badges.collectorDesc
    },
    {
      name: t.badges.ambassador,
      icon: <Star className="w-5 h-5" />,
      earned: stats.exchangesCount >= 20,
      description: t.badges.ambassadorDesc
    },
    {
      name: t.badges.expert,
      icon: <Target className="w-5 h-5" />,
      earned: stats.avgRating >= 4.5,
      description: t.badges.expertDesc
    },
    {
      name: t.badges.veteran,
      icon: <Crown className="w-5 h-5" />,
      earned: monthsSinceJoin >= 12,
      description: t.badges.veteranDesc
    }
  ];

  const earnedBadges = badges.filter(b => b.earned).length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return t.getTimeAgo(diffInHours);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative">

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          href="/toys"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.navigation.backToToys}
        </Link>

        {/* Profile header */}
        <div className="text-center mb-12">
          <div className="relative group inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-white text-4xl font-black">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className="object-cover w-full h-full"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "?"
              )}
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 to-purple-400/40 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>

          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">
            {t.getUserDisplayName(user.name)}
          </h1>

          {user.city && (
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{user.city}</span>
            </div>
          )}

          <p className="text-gray-300">
            {t.getMemberSince(stats.memberSince)}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats overview */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                {t.stats.title}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: t.stats.toys, value: stats.toysCount.toString(), icon: <Gamepad2 className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
                  { label: t.stats.exchanges, value: stats.exchangesCount.toString(), icon: <RefreshCw className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
                  { label: t.stats.donations, value: stats.donationsCount.toString(), icon: <Heart className="w-6 h-6" />, color: "from-pink-500 to-red-500" },
                  { label: t.stats.rating, value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : t.stats.notAvailable, icon: <Star className="w-6 h-6" />, color: "from-yellow-500 to-orange-500" }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className={`text-2xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent toys */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Package className="w-8 h-8" />
                {t.toys.title}
              </h2>

              {user.toys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.toys.map((toy) => (
                    <Link
                      key={toy.id}
                      href={`/toys/${toy.id}`}
                      className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="aspect-square bg-slate-800 rounded-xl mb-3 overflow-hidden">
                        {toy.images.length > 0 ? (
                          <img
                            src={toy.images[0].signedUrl ?? "/placeholder.png"}
                            alt={toy.title}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ToyBrick size={48} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {toy.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-lg ${toy.mode === 'DON'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-blue-500/20 text-blue-300'
                          }`}>
                          {t.getToyModeLabel(toy.mode)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(toy.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ToyBrick className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">{t.toys.noToys}</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            {recentReviews.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="w-8 h-8" />
                  {t.getRecentReviewsCount(recentReviews.length)}
                </h2>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                            {review.reviewer.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {t.getReviewerName(review.reviewer.name)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(review.createdAt)}
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {t.getBadgesProgress(earnedBadges, badges.length)}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className={`group p-3 rounded-2xl border text-center transition-all duration-300 hover:scale-105 relative cursor-pointer ${badge.earned
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300"
                        : "bg-white/5 border-white/10 text-gray-500"
                      }`}
                    title={badge.description}
                  >
                    <div className="text-xl mb-1 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {badge.icon}
                    </div>
                    <div className="text-xs font-medium">{badge.name}</div>
                    {badge.earned && (
                      <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-slate-900 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(earnedBadges / badges.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}