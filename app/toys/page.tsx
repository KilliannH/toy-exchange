"use client";

import Link from "next/link";
import { mutate } from "swr";
import { useToysTranslations } from '@/hooks/useToysTranslations';
import { useMemo, useState, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { Search, RotateCcw, Gem, ToyBrick, X, ListFilter, Grid2X2, Gift, Bolt, Plus, Sparkles, MapPin } from "lucide-react";

type ToyImage = { signedUrl?: string; url?: string; };
type Toy = {
    id: string;
    title: string;
    description: string;
    mode: "EXCHANGE" | "POINTS" | "DON";
    ageMin?: number;
    ageMax?: number;
    condition?: string;
    images: ToyImage[];
};

type ToysResponse = {
    items: Toy[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToysPage() {
    const t = useToysTranslations();
    const [filter, setFilter] = useState<"all" | "EXCHANGE" | "POINTS" | "DON">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 20;
    const [ignoreGeo, setIgnoreGeo] = useState(false);

    const getKey = (pageIndex: number, previousPageData: ToysResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return `/api/toys?page=${pageIndex + 1}&limit=${limit}${ignoreGeo ? "&ignoreGeo=true" : ""}`;
    };
    const { data, error, isLoading, isValidating, setSize } = useSWRInfinite<ToysResponse>(getKey, fetcher, {
        revalidateFirstPage: false,
        keepPreviousData: true,
    });

    // Appelle mutate() au chargement initial
    useEffect(() => {
        // Si nous n'avons pas encore de données, on ne fait rien
        if (!data) return;

        // Récupérer les URLs signées et les autres données de la première page
        const firstPage = data[0];
        const toysWithCurrentUrls = firstPage.items.map(toy => {
            const imagesWithCurrentSignedUrls = toy.images.map(image => ({
                ...image,
                signedUrl: image.signedUrl, // Utilisez l'URL signée existante
            }));
            return {
                ...toy,
                images: imagesWithCurrentSignedUrls,
            };
        });

        // Appeler mutate pour mettre à jour localement le cache avec les URLs signées
        mutate(
            (prevData) => {
                if (!prevData) return prevData;
                return [
                    { ...prevData[0], items: toysWithCurrentUrls },
                    ...prevData.slice(1)
                ];
            },
            { revalidate: true } // Vraiment revalider après la mise à jour locale
        );

    }, []); // S'exécute uniquement au montage

    const pages = data || [];
    const toysArray = pages.flatMap(p => p?.items || []);
    const total = pages[0]?.total ?? 0;
    const isReachingEnd = !!pages[pages.length - 1] && !pages[pages.length - 1]?.hasMore;

    const loaderRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (isReachingEnd) return;
        const el = loaderRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isValidating) {
                setSize((s) => s + 1);
            }
        }, { rootMargin: "400px" });
        io.observe(el);
        return () => io.disconnect();
    }, [setSize, isReachingEnd, isValidating]);

    const filteredToys = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return toysArray.filter((toy) => {
            const matchesSearch =
                !term ||
                toy.title?.toLowerCase().includes(term) ||
                toy.description?.toLowerCase().includes(term);
            const matchesFilter = filter === "all" || toy.mode === filter;
            return matchesSearch && matchesFilter;
        });
    }, [toysArray, searchTerm, filter]);

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case "EXCHANGE":
                return <RotateCcw size={14} />;
            case "POINTS":
                return <Bolt size={14} />;
            case "DON":
                return <Gift size={14} />;
            default:
                return null;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
                    <div className="text-8xl mb-6 text-red-400">
                        <X size={96} className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4">{t.errorTitle}</h2>
                    <p className="text-red-300">{t.loadingFailed}</p>
                    <button
                        onClick={() => mutate()}
                        className="mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        {t.tryAgain}
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading && !data) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse text-purple-400">
                            <Gem size={36} />
                        </div>
                    </div>
                    <p className="text-white/80 text-xl font-light">{t.discoveryLoading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 relative">
            <div className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        {t.pageTitle}
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                        {t.getPageSubtitle(total)}
                    </p>
                </div>

                {/* Search and filters */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search bar */}
                        <div className="relative flex-1 group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-3">
                            {[
                                { key: "all", label: t.getFilterLabel("all"), icon: <ListFilter size={18} /> },
                                { key: "EXCHANGE", label: t.getFilterLabel("exchange"), icon: <RotateCcw size={18} /> },
                                { key: "POINTS", label: t.getFilterLabel("points"), icon: <Bolt size={18} /> },
                                { key: "DON", label: t.getFilterLabel("don"), icon: <Gift size={18} /> },
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key as any)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${filter === filterOption.key
                                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20"
                                        }`}
                                >
                                    <span className="text-sm">{filterOption.icon}</span>
                                    <span className="hidden sm:inline">{filterOption.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    {/* Gauche : compteur */}
                    {filteredToys.length > 0 ? (
                        <p className="text-gray-300">
                            {t.getResultsCount(filteredToys.length, total)}
                        </p>
                    ) : (
                        <div />
                    )}

                    {/* Droite : badge */}
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => setIgnoreGeo((prev) => !prev)}
                            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${ignoreGeo
                                ? "bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                                : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
                                }`}
                        >
                            {ignoreGeo ? (
                                <>
                                    <span>{t.showAllToys}</span>
                                    <X size={14} className="ml-2" />
                                </>
                            ) : (
                                <>
                                    <span>{t.filteredByCity}</span>
                                    <X size={14} className="ml-2" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toys grid */}
                {filteredToys.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6 text-gray-500">
                            <ToyBrick size={96} className="mx-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">{t.noResults}</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            {t.noResultsDescription}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredToys.map((toy: Toy, index: number) => (
                                <div
                                    key={toy.id}
                                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 relative"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Card glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        {/* Image section */}
                                        <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
                                            {toy.images?.[0]?.signedUrl ? (
                                                <div className="relative h-full">
                                                    <img
                                                        src={toy.images[0].signedUrl as string}
                                                        alt={toy.title}
                                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    {toy.images[1]?.signedUrl && (
                                                        <img
                                                            src={toy.images[1].signedUrl as string}
                                                            alt={toy.title}
                                                            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300 text-gray-400">
                                                        <ToyBrick size={64} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mode badge */}
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border flex items-center gap-1 ${toy.mode === "EXCHANGE"
                                                        ? "bg-blue-500/80 text-blue-100 border-blue-400/50"
                                                        : toy.mode === "POINTS"
                                                            ? "bg-green-500/80 text-green-100 border-green-400/50"
                                                            : "bg-yellow-500/80 text-yellow-100 border-yellow-400/50"
                                                        }`}
                                                >
                                                    {getModeIcon(toy.mode)}
                                                    <span className="text-white hidden sm:inline">
                                                        {t.getModeLabel(toy.mode)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                                                <Link href={`/toys/${toy.id}`} className="hover:underline">
                                                    {toy.title}
                                                </Link>
                                            </h2>
                                            <p className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                                                <MapPin size={14} className="text-cyan-400" />
                                                {toy.user?.city || t.unknownCity}
                                            </p>

                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                {toy.description}
                                            </p>

                                            {/* Age and condition tags */}
                                            <div className="flex items-center gap-2 mb-4">
                                                {(toy.ageMin != null || toy.ageMax != null) && (
                                                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 flex items-center gap-1">
                                                        <Gem size={12} /> {t.getAgeRange(toy.ageMin, toy.ageMax)}
                                                    </span>
                                                )}
                                                {toy.condition && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 border bg-orange-500/10 border-orange-500/20 font-medium text-orange-300">
                                                        {t.getConditionLabel(toy.condition)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action button */}
                                            <Link
                                                href={`/toys/${toy.id}`}
                                                className="group/btn w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                                            >
                                                <span>{t.viewDetails}</span>
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sentinel Infinite Scroll */}
                        <div ref={loaderRef} className="flex items-center justify-center py-8">
                            {!isReachingEnd && (
                                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                            )}
                            {isReachingEnd && (
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    {t.endOfList}
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Floating action button */}
            <Link
                href="/post"
                className="fixed bottom-8 right-8 group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50"
            >
                <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </Link>

            {/* Custom styles */}
            <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}