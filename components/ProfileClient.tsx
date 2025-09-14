"use client";

import {
    User,
    Mail,
    MapPin,
    Settings,
    Gamepad2,
    RefreshCw,
    Star,
    Calendar,
    Trophy,
    Zap,
    Search,
    Plus,
    BarChart3,
    Edit,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    Crown,
    Award,
    Heart,
    Book,
    Lightbulb,
    Target,
    Shield,
    Trash2,
    AlertCircle,
    X,
    MessageCircle,
    Package,
    ArrowRightLeft,
    Clock,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useProfileClientTranslations } from "@/hooks/useProfileClientTranslations";

interface User {
    id: string;
    name?: string;
    email: string;
    city?: string;
    radiusKm?: number;
}

interface Stats {
    toysCount: number;
    exchangesCount: number;
    donationsCount: number;
    avgRating: number;
    memberSince: string;
}

interface Activity {
    type: 'post' | 'exchange' | 'message';
    action: string;
    toy: string;
    time: string;
}

interface Badge {
    name: string;
    icon: JSX.Element;
    earned: boolean;
    description: string;
}

interface ProfileClientProps {
    user: User;
    stats: Stats;
}

export default function ProfileClient({ user, stats }: ProfileClientProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const t = useProfileClientTranslations();

    const monthsSinceJoin = stats.memberSince !== t.achievement.levelExplorer ? parseInt(stats.memberSince) : 0;

    // Charger les activités récentes
    useEffect(() => {
        async function fetchActivities() {
            try {
                const response = await fetch('/api/profile/activity');
                if (response.ok) {
                    const data = await response.json();
                    setActivities(data);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des activités:', error);
            } finally {
                setLoadingActivities(false);
            }
        }

        fetchActivities();
    }, []);

    // Fonction pour obtenir l'icône selon le type d'activité
    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'post':
                return <Package className="w-5 h-5 text-blue-400" />;
            case 'exchange':
                return <ArrowRightLeft className="w-5 h-5 text-green-400" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-purple-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    // Fonction pour formater le temps relatif
    const formatTimeAgo = (timeString: string) => {
        const time = new Date(timeString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
        return t.getTimeAgo(diffInHours);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== t.deleteModal.deleteWord) return;

        setIsDeleting(true);

        try {
            const response = await fetch("/api/users/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Rediriger vers la page d'accueil après suppression
                window.location.href = "/";
            } else {
                throw new Error("Erreur lors de la suppression");
            }
        } catch (error) {
            alert(t.deleteModal.deleteError);
            setIsDeleting(false);
        }
    };

    const badges: Badge[] = [
        {
            name: t.badges.firstExchange,
            icon: <Award className="w-6 h-6" />,
            earned: stats.exchangesCount >= 1,
            description: t.badges.firstExchangeDesc
        },
        {
            name: t.badges.generous,
            icon: <Heart className="w-6 h-6" />,
            earned: stats.donationsCount >= 3,
            description: t.badges.generousDesc
        },
        {
            name: t.badges.collector,
            icon: <Book className="w-6 h-6" />,
            earned: stats.toysCount >= 10,
            description: t.badges.collectorDesc
        },
        {
            name: t.badges.ambassador,
            icon: <Star className="w-6 h-6" />,
            earned: stats.exchangesCount >= 20,
            description: t.badges.ambassadorDesc
        },
        {
            name: t.badges.expert,
            icon: <Target className="w-6 h-6" />,
            earned: stats.avgRating >= 4.5,
            description: t.badges.expertDesc
        },
        {
            name: t.badges.veteran,
            icon: <Crown className="w-6 h-6" />,
            earned: monthsSinceJoin >= 12,
            description: t.badges.veteranDesc
        }
    ];

    const earnedBadges = badges.filter(b => b.earned).length;

    return (
        <>
            <div className="min-h-screen bg-slate-900 relative overflow-hidden">
                <div className="z-10 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    {/* Profile header */}
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <div className="relative group inline-block mb-6">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-r from-cyan-400 to-purple-400">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || user.email || "Avatar"}
                                        width={128}
                                        height={128}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white text-3xl sm:text-4xl lg:text-5xl font-black">
                                        {user?.name?.charAt(0)?.toUpperCase() ||
                                            user?.email?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 to-purple-400/40 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-3 sm:mb-4">
                            {t.header.title}
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-light">
                            {t.header.subtitle}
                        </p>
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main profile info (2 cols on md+, 2 cols span on lg) */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Personal info card */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                                        {t.personalInfo.title}
                                    </h2>
                                    <a
                                        href="/profile/edit"
                                        className="group bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                        {t.personalInfo.editButton}
                                    </a>
                                </div>

                                <div className="grid gap-4 sm:gap-6">
                                    {[
                                        {
                                            label: t.personalInfo.fullName,
                                            value: user.name || t.personalInfo.notProvided,
                                            icon: <User className="w-6 h-6 sm:w-8 sm:h-8" />,
                                            color: "from-blue-400 to-cyan-400",
                                            isEmpty: !user.name,
                                        },
                                        {
                                            label: t.personalInfo.email,
                                            value: user.email,
                                            icon: <Mail className="w-6 h-6 sm:w-8 sm:h-8" />,
                                            color: "from-purple-400 to-pink-400",
                                            isEmpty: false,
                                        },
                                        {
                                            label: t.personalInfo.city,
                                            value: user.city || t.personalInfo.notProvided,
                                            icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
                                            color: "from-green-400 to-emerald-400",
                                            isEmpty: !user.city,
                                        },
                                    ].map((field, index) => (
                                        <div
                                            key={index}
                                            className="group bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                                    {field.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs sm:text-sm text-gray-400 font-medium mb-1">
                                                        {field.label}
                                                    </div>
                                                    <div
                                                        className={`text-base sm:text-lg font-semibold ${field.isEmpty
                                                                ? "text-gray-500 italic"
                                                                : `bg-gradient-to-r ${field.color} bg-clip-text text-transparent`
                                                            }`}
                                                    >
                                                        {field.value}
                                                    </div>
                                                </div>
                                                {field.isEmpty && (
                                                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preferences + Danger zone */}
                            <div className="space-y-6">
                                {/* Preferences */}
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-3 mb-4 sm:mb-6">
                                        <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
                                        {t.preferences.title}
                                    </h2>
                                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 sm:p-6">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                                            <div className="flex-1">
                                                <div className="text-xs sm:text-sm text-cyan-300 font-medium mb-1">
                                                    {t.preferences.searchRadius}
                                                </div>
                                                <div className="text-lg sm:text-2xl font-bold text-white">
                                                    {user.radiusKm ? `${user.radiusKm} km` : "10 km"}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {user.radiusKm
                                                        ? t.preferences.custom
                                                        : t.preferences.defaultValue}
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.radiusKm || 10}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Danger zone */}
                                <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-4 sm:p-6 lg:p-8">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                                        <h2 className="text-lg sm:text-2xl font-bold text-red-400">
                                            {t.dangerZone.title}
                                        </h2>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2 hover:scale-105"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover:shake" />
                                            {t.dangerZone.deleteButton}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (stats, badges, actions) */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Activity stats */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {t.stats.title}
                                </h3>

                                <div className="space-y-4 text-base sm:text-xl">
                                    {[
                                        { label: t.stats.toysPosted, value: stats.toysCount.toString(), icon: <Gamepad2 className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
                                        { label: t.stats.exchangesCompleted, value: stats.exchangesCount.toString(), icon: <RefreshCw className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
                                        { label: t.stats.averageRating, value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : t.stats.notAvailable, icon: <Star className="w-6 h-6" />, color: "from-yellow-500 to-orange-500" },
                                        { label: t.stats.memberSince, value: stats.memberSince, icon: <Calendar className="w-6 h-6" />, color: "from-purple-500 to-pink-500" }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                                {stat.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-400">{stat.label}</div>
                                                <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {t.badges.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {badges.map((badge, i) => (
                                        <div
                                            key={i}
                                            className={`group p-4 rounded-2xl border text-center transition-all duration-300 hover:scale-105 relative cursor-pointer ${badge.earned
                                                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300"
                                                : "bg-white/5 border-white/10 text-gray-500"
                                                }`}
                                            title={badge.description}
                                        >
                                            <div className="text-2xl mb-1 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                                {badge.icon}
                                            </div>
                                            <div className="text-xs font-medium">{badge.name}</div>
                                            {badge.earned && (
                                                <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-slate-900 rounded-full animate-bounce" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-sm text-gray-400">
                                        {t.getBadgesProgress(earnedBadges, badges.length)}
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(earnedBadges / badges.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-3 sm:px-4 py-2 sm:py-3">
                                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {t.quickActions.title}
                                </h3>

                                <div className="space-y-3">
                                    <a
                                        href="/toys"
                                        className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-5 h-5" />
                                        {t.quickActions.browseToys}
                                    </a>

                                    <a
                                        href="/post"
                                        className="group w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {t.quickActions.addToy}
                                    </a>

                                    <a
                                        href="/dashboard"
                                        className="group w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                        {t.quickActions.dashboard}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

            {/* Achievement banner */}
            <div className="mt-12 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-4xl text-emerald-400 animate-bounce">
                        <Trophy size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {t.achievement.title}
                    </h3>
                    <div className="text-4xl text-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <CheckCircle size={48} className="mx-auto" />
                    </div>
                </div>
                <p className="text-gray-300 mb-6">
                    {t.achievement.subtitle}
                </p>

                {/* Progress to next level */}
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{t.achievement.levelLabel} {t.getUserLevel(stats.exchangesCount)}</span>
                        <span>{t.getNextLevelProgress(stats.exchangesCount)}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse"
                            style={{
                                width: `${Math.min((stats.exchangesCount / t.getNextLevelTarget(stats.exchangesCount)) * 100, 100)}%`
                            }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {t.getNextLevelRemaining(stats.exchangesCount)} <TrendingUp className="inline-block w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Recent activity */}
            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                    <TrendingUp className="w-8 h-8" />
                    {t.activity.title}
                </h2>

                {loadingActivities ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        <span className="ml-3 text-gray-400">{t.activity.loading}</span>
                    </div>
                ) : activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 group-hover:scale-110 transition-transform duration-300">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                                                {activity.action}
                                            </h4>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {formatTimeAgo(activity.time)}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm truncate">
                                            {activity.toy}
                                        </p>
                                        <div className={`mt-2 inline-block px-2 py-1 rounded-lg text-xs font-medium ${activity.type === 'post'
                                            ? 'bg-blue-500/20 text-blue-300'
                                            : activity.type === 'exchange'
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-purple-500/20 text-purple-300'
                                            }`}>
                                            {t.getActivityType(activity.type)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Lien vers l'historique complet */}
                        <div className="text-center pt-4">
                            <a
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors group"
                            >
                                {t.activity.viewAll}
                                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                            {t.activity.noActivity}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {t.activity.startByAdding}
                        </p>
                        <a
                            href="/post"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            <Plus className="w-4 h-4" />
                            {t.activity.addToy}
                        </a>
                    </div>
                )}
            </div>
        </div >
            </div >

        {/* Modal de confirmation de suppression */ }
    {
        showDeleteModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full relative">
                    <button
                        onClick={() => {
                            setShowDeleteModal(false);
                            setDeleteConfirmation("");
                        }}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="text-6xl text-red-400 mb-4">
                            <AlertTriangle size={64} className="mx-auto animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-400 mb-2">
                            {t.deleteModal.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                            {t.deleteModal.subtitle}
                        </p>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                        <p className="text-red-200 text-sm mb-4">
                            {t.deleteModal.aboutToDelete}
                        </p>
                        <ul className="text-red-200/80 text-xs space-y-1">
                            {t.getDeleteConfirmationItems(stats, earnedBadges).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t.deleteModal.confirmInstruction} <span className="font-bold text-red-400">{t.deleteModal.deleteWord}</span>
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="w-full bg-slate-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            placeholder={t.deleteModal.placeholder}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeleteConfirmation("");
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            {t.deleteModal.cancel}
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== t.deleteModal.deleteWord || isDeleting}
                            className={`flex-1 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${deleteConfirmation === t.deleteModal.deleteWord && !isDeleting
                                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t.deleteModal.deleting}
                                </>
                            ) : (
                                <>
                                    {t.deleteModal.deleteButton}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
        </>
    );
}