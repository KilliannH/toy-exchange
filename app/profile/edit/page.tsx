"use client";

import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Check, User, MapPin, Search, Lightbulb, Target, Home, Ruler, ShieldCheck, Save, Loader2 } from "lucide-react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import toast from "react-hot-toast";
import ImageUploadCard from "@/components/ImageUploadCard";
import { useEditProfileTranslations } from "@/hooks/useEditProfileTranslations";

export default function EditProfilePage() {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState<File | null>(null);
    const [radiusKm, setRadiusKm] = useState(10);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const t = useEditProfileTranslations();

    // Google Places Autocomplete hook
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            types: ["(cities)"],
            componentRestrictions: { country: "fr" },
        },
        debounce: 300, // Ajoute un petit délai pour éviter des appels API trop fréquents
    });

    useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                setName(data.name || "");
                setCity(data.city || "");
                setImage(data.image || null);
                setRadiusKm(data.radiusKm || 10);
                setLat(data.lat || null);
                setLng(data.lng || null);
                setInitialLoading(false);
                // Mettre à jour l'input de la Combobox avec la ville par défaut
                setValue(data.city || "");
            });
    }, [setValue]);

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
            toast.error(t.messages.cityNotFound);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = image;

        // Si un nouveau fichier a été choisi → upload vers GCS
        if (file) {
            const res = await fetch("/api/upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            });

            if (!res.ok) {
                toast.error(t.messages.uploadError);
                setLoading(false);
                return;
            }

            const { url, publicUrl } = await res.json();

            // Upload physique
            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            finalImageUrl = publicUrl; // URL finale pour la DB
        }

        // PATCH du profil
        await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, city, radiusKm, lat, lng, image: finalImageUrl }),
        });

        setSaved(true);
        setLoading(false);
        setTimeout(() => setSaved(false), 3000);
    }


    if (initialLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-20 h-20 text-purple-400 animate-spin mb-4 mx-auto" />
                    <p className="text-white/80 text-lg">{t.loading.profile}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 relative">

            <div className="relative z-10 pt-24 pb-12 px-6 max-w-3xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-8 group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    {t.navigation.backToProfile}
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4 text-yellow-400 animate-bounce">
                        <Edit size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        {t.header.title}
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        {t.header.subtitle}
                    </p>
                </div>

                {/* Success banner */}
                {saved && (
                    <div className="mb-8 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 text-center animate-slide-down">
                        <div className="flex items-center justify-center gap-3 text-emerald-300">
                            <Check className="w-6 h-6 animate-bounce" />
                            <span className="font-semibold">{t.success.profileUpdated}</span>
                        </div>
                    </div>
                )}

                {/* Main form */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-3">{t.form.profilePhoto}</label>
                                <ImageUploadCard image={image} setImage={setImage} setFile={setFile} />
                            </div>
                            {/* Name field */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-400" />
                                    {t.form.fullName}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.form.namePlaceholder}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>

                            {/* City Combobox */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Home className="w-5 h-5 text-gray-400" />
                                    {t.form.city}
                                </label>
                                <Combobox value={city} onChange={handleSelect}>
                                    <Combobox.Input
                                        as="input"
                                        className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                        displayValue={(city: string) => city}
                                        onChange={(event) => {
                                            setValue(event.target.value);
                                            setCity(event.target.value);
                                            setLat(null);
                                            setLng(null);
                                        }}
                                        placeholder={t.form.cityPlaceholder}
                                        disabled={!ready}
                                    />
                                    <Combobox.Options className="absolute mt-2 z-10 w-full rounded-2xl bg-black/80 backdrop-blur-lg border border-white/20 text-white shadow-lg max-h-60 overflow-y-auto">
                                        {status === "OK" && data.map(({ place_id, description }) => (
                                            <Combobox.Option
                                                key={place_id}
                                                value={description}
                                                className="p-3 cursor-pointer rounded-xl hover:bg-white/10 transition-colors"
                                            >
                                                {description}
                                            </Combobox.Option>
                                        ))}
                                        {status === "OK" && data.length === 0 && (
                                            <p className="p-3 text-gray-400">{t.form.noResults}</p>
                                        )}
                                    </Combobox.Options>
                                </Combobox>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>

                            {/* Radius slider */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    {t.form.searchRadius}
                                </label>
                                <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white font-semibold">{t.getRadiusText(radiusKm)}</span>
                                        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {t.form.exchangeZone}
                                        </div>
                                    </div>

                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={radiusKm}
                                        onChange={(e) => setRadiusKm(Number(e.target.value))}
                                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                    />

                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>1 km</span>
                                        <span>{t.form.proximity}</span>
                                        <span>100 km</span>
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !name || !city}
                                className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t.loading.saving}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {t.form.saveButton}
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Preview section */}
                    <div className="space-y-6">
                        {/* Preview card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                {t.preview.title}
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-cyan-400 to-purple-400">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={name || "Avatar"}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-xl">
                                                    {t.getNameInitial(name)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">
                                                {name || t.preview.nameNotDefined}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {city || t.preview.cityNotDefined}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-cyan-400" />
                                        <div>
                                            <div className="text-cyan-300 font-semibold">{t.preview.exchangeZoneTitle}</div>
                                            <div className="text-white font-bold text-lg">{t.getZoneDescription(radiusKm)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips section */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="w-6 h-6" />
                                {t.tips.title}
                            </h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <Target className="w-5 h-5 text-blue-300" />,
                                        title: t.tips.visibleName,
                                        desc: t.tips.visibleNameDesc,
                                        color: "blue"
                                    },
                                    {
                                        icon: <Home className="w-5 h-5 text-green-300" />,
                                        title: t.tips.preciseCity,
                                        desc: t.tips.preciseCityDesc,
                                        color: "green"
                                    },
                                    {
                                        icon: <Ruler className="w-5 h-5 text-purple-300" />,
                                        title: t.tips.optimalRadius,
                                        desc: t.tips.optimalRadiusDesc,
                                        color: "purple"
                                    }
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                        <div className="text-xl">{tip.icon}</div>
                                        <div className="flex-1">
                                            <div className={`text-${tip.color}-300 font-medium text-sm`}>{tip.title}</div>
                                            <div className="text-gray-400 text-xs">{tip.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy notice */}
                        <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl text-yellow-300">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-yellow-300 font-semibold mb-2">{t.privacy.title}</h4>
                                    <p className="text-yellow-200/80 text-sm leading-relaxed">
                                        {t.privacy.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom slider styles */}
            <style jsx>{`
                .slider {
                    background: linear-gradient(to right, #06b6d4 0%, #8b5cf6 100%);
                }
                
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                    transition: all 0.2s ease;
                }
                
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
                }
                
                .slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                }

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
                    animation: slide-down 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}