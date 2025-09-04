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

    const monthsSinceJoin = stats.memberSince !== "Nouveau" ? parseInt(stats.memberSince) : 0;

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

        if (diffInHours < 1) return "Il y a quelques minutes";
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInHours < 48) return "Hier";
        const diffInDays = Math.floor(diffInHours / 24);
        return `Il y a ${diffInDays} jours`;
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "SUPPRIMER") return;

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
            alert("Une erreur s'est produite lors de la suppression du compte");
            setIsDeleting(false);
        }
    };

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
        <>
            <div className="min-h-screen bg-slate-900 relative">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
                </div>

                <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto">
                    {/* Profile header */}
                    <div className="text-center mb-12">
                        <div className="relative group inline-block mb-6">
                            <div className="w-32 h-32 rounded-full shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-r from-cyan-400 to-purple-400">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || user.email || "Avatar"}
                                        width={128}
                                        height={128}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white text-4xl font-black">
                                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 to-purple-400/40 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
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

                            {/* DANGER ZONE */}
                            <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-8 h-8 text-red-400" />
                                    <h2 className="text-2xl font-bold text-red-400">
                                        Zone de danger
                                    </h2>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-red-400 mt-1">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-red-300 mb-2">
                                                Supprimer mon compte
                                            </h3>
                                            <p className="text-red-200/80 text-sm mb-4 leading-relaxed">
                                                Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées :
                                            </p>
                                            <ul className="text-red-200/70 text-sm space-y-1 mb-6 ml-4">
                                                <li>• Tous vos jouets postés ({stats.toysCount})</li>
                                                <li>• Votre historique d'échanges ({stats.exchangesCount})</li>
                                                <li>• Vos notes et avis</li>
                                                <li>• Tous vos badges et réalisations</li>
                                                <li>• Vos informations personnelles</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2 hover:scale-105"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover:shake" />
                                            Supprimer mon compte
                                        </button>
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

                        {loadingActivities ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                                <span className="ml-3 text-gray-400">Chargement des activités...</span>
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
                                                    {activity.type === 'post'
                                                        ? 'Nouveau jouet'
                                                        : activity.type === 'exchange'
                                                            ? 'Échange'
                                                            : 'Message'
                                                    }
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
                                        Voir toute l'activité
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
                                    Aucune activité récente
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Commencez par ajouter votre premier jouet !
                                </p>
                                <a
                                    href="/post"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter un jouet
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
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
                                Supprimer définitivement ?
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Cette action ne peut pas être annulée
                            </p>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                            <p className="text-red-200 text-sm mb-4">
                                Vous êtes sur le point de supprimer :
                            </p>
                            <ul className="text-red-200/80 text-xs space-y-1">
                                <li>• {stats.toysCount} jouets postés</li>
                                <li>• {stats.exchangesCount} échanges réalisés</li>
                                <li>• {earnedBadges} badges gagnés</li>
                                <li>• Toutes vos données personnelles</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Pour confirmer, tapez <span className="font-bold text-red-400">SUPPRIMER</span>
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="w-full bg-slate-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Tapez SUPPRIMER"
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
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== "SUPPRIMER" || isDeleting}
                                className={`flex-1 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${deleteConfirmation === "SUPPRIMER" && !isDeleting
                                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        Supprimer définitivement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}