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
    Target
} from "lucide-react";

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

    const monthsSinceJoin = stats.memberSince !== "Nouveau" ? parseInt(stats.memberSince) : 0;

    const badges: Badge[] = [
        {
            name: "Premier échange",
            icon: <Award className="w-6 h-6" />,
            earned: stats.exchangesCount >= 1,
            description: "Réalisez votre premier échange"
        },
        {
            name: "Généreux",
            icon: <Heart className="w-6 h-6" />,
            earned: stats.donationsCount >= 3,
            description: "Donnez 3 jouets"
        },
        {
            name: "Collectionneur",
            icon: <Book className="w-6 h-6" />,
            earned: stats.toysCount >= 10,
            description: "Postez 10 jouets"
        },
        {
            name: "Ambassadeur",
            icon: <Star className="w-6 h-6" />,
            earned: stats.exchangesCount >= 20,
            description: "Réalisez 20 échanges"
        },
        {
            name: "Expert",
            icon: <Target className="w-6 h-6" />,
            earned: stats.avgRating >= 4.5,
            description: "Obtenez une note moyenne de 4.5+"
        },
        {
            name: "Vétéran",
            icon: <Crown className="w-6 h-6" />,
            earned: monthsSinceJoin >= 12,
            description: "Membre depuis plus d'un an"
        }
    ];

    const earnedBadges = badges.filter(b => b.earned).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto">
                {/* Profile header */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse" />
                    </div>

                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        Mon Profil
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        Gérez vos informations personnelles
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main profile info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal info card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <User className="w-8 h-8" />
                                    Informations personnelles
                                </h2>
                                <a
                                    href="/profile/edit"
                                    className="group bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2 ml-8"
                                >
                                    <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                    Modifier
                                </a>
                            </div>

                            <div className="grid gap-6">
                                {[
                                    {
                                        label: "Nom complet",
                                        value: user.name || "Non renseigné",
                                        icon: <User className="w-8 h-8" />,
                                        color: "from-blue-400 to-cyan-400",
                                        isEmpty: !user.name
                                    },
                                    {
                                        label: "Adresse email",
                                        value: user.email,
                                        icon: <Mail className="w-8 h-8" />,
                                        color: "from-purple-400 to-pink-400",
                                        isEmpty: false
                                    },
                                    {
                                        label: "Ville",
                                        value: user.city || "Non renseigné",
                                        icon: <MapPin className="w-8 h-8" />,
                                        color: "from-green-400 to-emerald-400",
                                        isEmpty: !user.city
                                    }
                                ].map((field, index) => (
                                    <div key={index} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                                {field.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-400 font-medium mb-1">
                                                    {field.label}
                                                </div>
                                                <div className={`text-lg font-semibold ${field.isEmpty
                                                    ? "text-gray-500 italic"
                                                    : `bg-gradient-to-r ${field.color} bg-clip-text text-transparent`
                                                    }`}>
                                                    {field.value}
                                                </div>
                                            </div>
                                            {field.isEmpty && (
                                                <AlertTriangle className="w-6 h-6 text-yellow-400 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preferences card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                                <Settings className="w-8 h-8" />
                                Préférences
                            </h2>

                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-8 h-8 text-cyan-400 animate-pulse" />
                                    <div className="flex-1">
                                        <div className="text-sm text-cyan-300 font-medium mb-1">
                                            Rayon de recherche
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {user.radiusKm ? `${user.radiusKm} km` : "10 km"}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {user.radiusKm ? "Personnalisé" : "Valeur par défaut"}
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.radiusKm || 10}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar stats */}
                    <div className="space-y-6">
                        {/* Activity stats */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6" />
                                Statistiques
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: "Jouets postés", value: stats.toysCount.toString(), icon: <Gamepad2 className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
                                    { label: "Échanges réalisés", value: stats.exchangesCount.toString(), icon: <RefreshCw className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
                                    { label: "Note moyenne", value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A", icon: <Star className="w-6 h-6" />, color: "from-yellow-500 to-orange-500" },
                                    { label: "Membre depuis", value: stats.memberSince, icon: <Calendar className="w-6 h-6" />, color: "from-purple-500 to-pink-500" }
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
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Trophy className="w-6 h-6" />
                                Badges
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
                                    {earnedBadges}/{badges.length} badges débloqués
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
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Zap className="w-6 h-6" />
                                Actions rapides
                            </h3>

                            <div className="space-y-3">
                                <a
                                    href="/toys"
                                    className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Search className="w-5 h-5" />
                                    Parcourir les jouets
                                </a>

                                <a
                                    href="/post"
                                    className="group w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter un jouet
                                </a>

                                <a
                                    href="/dashboard"
                                    className="group w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    Mon dashboard
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
                            Membre actif de la communauté !
                        </h3>
                        <div className="text-4xl text-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}>
                            <CheckCircle size={48} className="mx-auto" />
                        </div>
                    </div>
                    <p className="text-gray-300 mb-6">
                        Merci de contribuer à un monde plus durable grâce au partage de jouets
                    </p>

                    {/* Progress to next level */}
                    <div className="max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Niveau {stats.exchangesCount >= 20 ? "Ambassadeur" : "Explorateur"}</span>
                            <span>{stats.exchangesCount}/{stats.exchangesCount >= 20 ? 50 : 20} échanges</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse"
                                style={{
                                    width: `${Math.min((stats.exchangesCount / (stats.exchangesCount >= 20 ? 50 : 20)) * 100, 100)}%`
                                }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats.exchangesCount >= 20
                                ? `${Math.max(0, 50 - stats.exchangesCount)} échanges pour "Expert"`
                                : `${Math.max(0, 20 - stats.exchangesCount)} échanges pour "Ambassadeur"`
                            } <TrendingUp className="inline-block w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                        <TrendingUp className="w-8 h-8" />
                        Activité récente
                    </h2>

                    <div className="text-center py-8">

                        <p className="text-gray-400">
                            L'historique d'activité sera disponible prochainement
                        </p>
                    </div>
                </div>
            </div >
        </div >
    );
}