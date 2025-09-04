"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import { MapPin, ArrowRight, Loader2, CheckCircle, Tent } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CityOnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    const {
        ready,
        value,
        suggestions: { status: suggestionsStatus, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            types: ["(cities)"],
            componentRestrictions: { country: "fr" },
        },
    });

    // Rediriger si pas connecté
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }
    }, [session, status, router]);

    const handleSelect = async (address: string) => {
        setValue(address, false);
        setCity(address);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = getLatLng(results[0]);
            setLat(lat);
            setLng(lng);
        } catch (error) {
            console.error("Erreur lors de la récupération des coordonnées :", error);
            toast.error("Erreur lors de la géolocalisation");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city || !lat || !lng) return;

        setLoading(true);
        
        try {
            const response = await fetch("/api/users/update-city", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, lat, lng }),
            });

            if (response.ok) {
                toast.success("Localisation enregistrée !");
                router.push("/dashboard");
            } else {
                const data = await response.json();
                toast.error(data.error || "Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-slate-900 pt-24 relative flex items-center justify-center p-6">
            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-2xl opacity-10 animate-float"
                        style={{
                            left: `${15 + (i * 15)}%`,
                            top: `${20 + (i * 10)}%`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: '6s'
                        }}
                    >
                        <MapPin size={24} />
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 text-cyan-400 animate-bounce">
                            <Image 
                                src="/circus-tent.svg"
                                alt="ToyExchange logo"
                                width={64}
                                height={64}
                                className="mx-auto" 
                            />
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                            Dernière étape !
                        </h1>
                        <p className="text-gray-300 font-light mb-2">
                            Salut <span className="text-cyan-400 font-semibold">{session.user?.name}</span> !
                        </p>
                        <p className="text-gray-400 text-sm">
                            Renseignez votre ville pour trouver des jouets près de chez vous
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* City Combobox */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Tent size={16} className="text-cyan-400" /> 
                                Dans quelle ville êtes-vous ?
                            </label>
                            <Combobox value={city} onChange={handleSelect}>
                                <Combobox.Input
                                    as="input"
                                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                    displayValue={(city: string) => city}
                                    onChange={(event) => setValue(event.target.value)}
                                    placeholder="Rechercher votre ville..."
                                    disabled={!ready}
                                    required
                                />
                                <Combobox.Options className="absolute mt-2 z-10 w-full rounded-2xl bg-black/90 backdrop-blur-lg border border-white/20 text-white shadow-lg max-h-60 overflow-y-auto">
                                    {suggestionsStatus === "OK" && data.map(({ place_id, description }) => (
                                        <Combobox.Option
                                            key={place_id}
                                            value={description}
                                            className="p-4 cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
                                        >
                                            <MapPin size={16} className="text-cyan-400" />
                                            {description}
                                        </Combobox.Option>
                                    ))}
                                    {suggestionsStatus === "OK" && data.length === 0 && (
                                        <p className="p-4 text-gray-400 text-center">Aucun résultat trouvé</p>
                                    )}
                                </Combobox.Options>
                            </Combobox>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>

                        {/* Info box */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-medium text-white mb-1">Pourquoi votre ville ?</p>
                                    <p className="text-gray-400">
                                        Nous l'utilisons pour vous montrer les jouets disponibles près de chez vous et faciliter les échanges locaux.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading || !city || !lat || !lng}
                            className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Terminer l'inscription
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Vos données de localisation sont sécurisées et ne sont utilisées que pour améliorer votre expérience
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-20px) rotate(10deg); }
                    50% { transform: translateY(-10px) rotate(-10deg); }
                    75% { transform: translateY(-15px) rotate(5deg); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}