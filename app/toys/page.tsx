"use client";

import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";
import { Search, RefreshCw, Eye, Users, HandCoins } from "lucide-react"; // icons lucide

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToysPage() {
    const { data: toys, error, isLoading } = useSWR("/api/toys", fetcher);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
                    <div className="flex justify-center mb-6">
                        <RefreshCw className="w-16 h-16 text-red-400 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Erreur</h2>
                    <p className="text-red-300 mb-4">Impossible de charger les jouets</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading || !toys) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="w-10 h-10 text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-white/80 text-lg">Chargement des jouets...</p>
                </div>
            </div>
        );
    }

    const filteredToys = toys.filter((toy: any) => {
        const matchesSearch =
            toy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            toy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || toy.mode === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-900 relative">
            <div className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        Galerie des Jouets
                    </h1>
                    <p className="text-lg text-gray-400">
                        Découvrez {toys.length} jouets prêts à être échangés
                    </p>
                </div>

                {/* Search and filters */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search bar */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Rechercher un jouet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-3">
                            {[
                                { key: "all", label: "Tout", icon: Eye },
                                { key: "EXCHANGE", label: "Échange", icon: RefreshCw },
                                { key: "DON", label: "Don", icon: Users },
                                { key: "POINTS", label: "Points", icon: HandCoins },
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${filter === filterOption.key
                                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                                        }`}
                                >
                                    <filterOption.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{filterOption.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-300">
                        <span className="text-cyan-400 font-bold text-lg">
                            {filteredToys.length}
                        </span>{" "}
                        résultat{filteredToys.length > 1 ? "s" : ""}
                    </p>
                </div>

                {/* Toys grid */}
                {filteredToys.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        Aucun jouet trouvé.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredToys.map((toy: any) => (
                            <div
                                key={toy.id}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:scale-105 transition-all duration-500 relative"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
                                    {toy.images?.[0] ? (
                                        <div className="relative h-full">
                                            <img
                                                src={toy.images[0].signedUrl}
                                                alt={toy.title}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                style={{
                                                    objectPosition: `center ${toy.images[0].offsetY ?? 50}%`, // 👈 utilisation offsetY
                                                }}
                                            />
                                            {toy.images[1] && (
                                                <img
                                                    src={toy.images[1].signedUrl}
                                                    alt={toy.title}
                                                    className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        objectPosition: `center ${toy.images[1].offsetY ?? 50}%`, // idem
                                                    }}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🎮</div>
                                        </div>
                                    )}
                                </div>

                                {/* Mode badge */}
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${toy.mode === "exchange"
                                                ? "bg-blue-500/80 text-blue-100 border-blue-400/50"
                                                : toy.mode === "lend"
                                                    ? "bg-green-500/80 text-green-100 border-green-400/50"
                                                    : "bg-yellow-500/80 text-yellow-100 border-yellow-400/50"
                                            }`}
                                    >
                                        {toy.mode === "exchange" ? "🔄" : toy.mode === "lend" ? "🤝" : "💰"}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                        <Link href={`/toys/${toy.id}`} className="hover:underline">
                                            {toy.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {toy.description}
                                    </p>
                                    <Link
                                        href={`/toys/${toy.id}`}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Voir détails
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
