"use client";

import { useState } from "react";
import { User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, Trophy, Gift, Handshake, Gamepad2, Tent, Star } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [city, setCity] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [acceptTerms, setAcceptTerms] = useState(false);

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
    });

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
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, city, lat, lng }),
        });

        if (res.ok) {
            setStep(3);
            setTimeout(() => {
                toast.success("Compte créé 🎉 vous pouvez maintenant vous connecter");
                setName("");
                setEmail("");
                setPassword("");
                setCity("");
                setLat(null);
                setLng(null);
                setStep(1);
            }, 2000);
        } else {
            const data = await res.json();
            toast.error(data.error || "Erreur lors de l'inscription");
        }

        setLoading(false);
    }

    const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

    const passwordStrength =
        password.length < 4 ? '🔴 Faible' :
            password.length < 6 ? '🟡 Moyen' :
                password.length < 8 ? '🟢 Bon' : '💪 Excellent';

    return (
        <div className="min-h-screen bg-slate-900 relative flex items-center justify-center pt-20 p-6">

            {/* Floating celebration elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-2xl opacity-15 animate-float"
                        style={{
                            left: `${5 + (i * 8)}%`,
                            top: `${15 + (i * 6)}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${6 + (i % 3)}s`
                        }}
                    >
                        {i === 0 && <CheckCircle className="text-emerald-400" />}
                        {i === 1 && <Sparkles className="text-cyan-400" />}
                        {i === 2 && <Trophy className="text-purple-400" />}
                        {i === 3 && <Sparkles className="text-pink-400" />}
                        {i === 4 && <Gift className="text-yellow-400" />}
                        {i === 5 && <Trophy className="text-green-400" />}
                        {i === 6 && <Gamepad2 className="text-blue-400" />}
                        {i === 7 && <Sparkles className="text-white" />}
                        {i === 8 && <Star className="text-red-400" />}
                        {i === 9 && <Handshake className="text-orange-400" />}
                        {i === 10 && <Sparkles className="text-fuchsia-400" />}
                        {i === 11 && <Tent className="text-lime-400" />}
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Main card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Progress bar */}
                    <div className="h-1 bg-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-700 ease-out"
                            style={{ width: progressWidth }}
                        />
                    </div>

                    <div className="p-8">
                        {step < 3 ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="text-6xl mb-4 text-emerald-400 animate-bounce">
                                        <Image src="/circus-tent.svg"
                                            alt="ToyExchange logo"
                                            width={64}
                                            height={64}
                                            className="mx-auto" />
                                    </div>
                                    <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                                        Rejoignez l'aventure !
                                    </h1>
                                    <p className="text-gray-300 font-light">
                                        Créez votre compte et commencez à échanger
                                    </p>
                                </div>

                                {/* Step indicators */}
                                <div className="flex justify-center gap-3 mb-8">
                                    {[1, 2].map((stepNum) => (
                                        <div
                                            key={stepNum}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${step >= stepNum
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-white/5 text-gray-400 border border-white/10'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= stepNum ? 'bg-emerald-500' : 'bg-white/20'
                                                }`}>
                                                {stepNum}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {stepNum === 1 ? 'Infos' : 'Sécurité'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    {step === 1 && (
                                        <>
                                            {/* Google Sign In Button */}
                                            <button
                                                onClick={() => signIn("google", { callbackUrl: "/onboarding/city" })}
                                                className="group relative overflow-hidden w-full bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-6"
                                            >
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                </div>
                                                <span className="group-hover:text-emerald-300 transition-colors duration-300">
                                                    Continuer avec Google
                                                </span>
                                            </button>

                                            {/* Divider */}
                                            <div className="flex items-center gap-4 my-6">
                                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                                <span className="text-gray-400 text-sm font-medium">ou avec votre email</span>
                                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            </div>

                                            {/* Name field */}
                                            <div className="relative group">
                                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                                    <User size={16} /> Comment vous appelez-vous ?
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Votre prénom"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                                    required
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>

                                            {/* City Combobox */}
                                            <div className="relative group">
                                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                                    <Tent size={16} /> Votre ville
                                                </label>
                                                <Combobox value={city} onChange={handleSelect}>
                                                    <Combobox.Input
                                                        as="input"
                                                        className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                                        displayValue={(city: string) => city}
                                                        onChange={(event) => setValue(event.target.value)}
                                                        placeholder="Rechercher une ville..."
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
                                                            <p className="p-3 text-gray-400">Aucun résultat</p>
                                                        )}
                                                    </Combobox.Options>
                                                </Combobox>
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>

                                            {/* Email field */}
                                            <div className="relative group">
                                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                                    <Mail size={16} /> Votre email
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="nom@exemple.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                                    required
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>

                                            <button
                                                onClick={() => name && email && city ? setStep(2) : null}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                                disabled={!name || !email || !city}
                                            >
                                                Suivant <ArrowRight size={16} className="inline-block ml-1" />
                                            </button>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            {/* Password field */}
                                            <div className="relative group">
                                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                                    <Lock size={16} /> Créez un mot de passe sécurisé
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Au moins 8 caractères"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                                                    required
                                                    minLength={8}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>

                                            {/* Password strength indicator */}
                                            <div className="space-y-2">
                                                <div className="flex gap-1">
                                                    {[...Array(4)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${password.length > i * 2
                                                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                                                                : 'bg-white/10'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    Force du mot de passe : {passwordStrength}
                                                </p>
                                            </div>

                                            {/* Checkbox for Terms of Service */}
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                <label className="flex items-start gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={acceptTerms}
                                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                                        className="w-5 h-5 mt-0.5 bg-white/5 border-2 border-white/20 rounded text-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 transition-all duration-300"
                                                    />
                                                    <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                                        J'accepte les{' '}
                                                        <Link
                                                            href="/legal/terms"
                                                            target="_blank"
                                                            className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                                        >
                                                            Conditions Générales d'Utilisation
                                                        </Link>
                                                        {' '}et la{' '}
                                                        <Link
                                                            href="/legal/privacy"
                                                            target="_blank"
                                                            className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                                        >
                                                            Politique de Confidentialité
                                                        </Link>
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
                                                >
                                                    <ArrowLeft size={16} className="inline-block mr-1" /> Retour
                                                </button>

                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={loading || password.length < 8 || !acceptTerms}
                                                    className="group relative overflow-hidden flex-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        {loading ? (
                                                            <>
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                Création...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles size={20} /> Créer mon compte
                                                            </>
                                                        )}
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Success step
                            <div className="text-center py-8">
                                <div className="text-8xl mb-6 text-emerald-400 animate-bounce">
                                    <CheckCircle size={96} className="mx-auto" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                                    Bienvenue dans la famille !
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    Votre compte a été créé avec succès
                                </p>
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                                        <CheckCircle size={32} className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        {step < 3 && (
                            <div className="text-center mt-8 space-y-3">
                                <p className="text-gray-400 text-sm">
                                    Déjà un compte ?{" "}
                                    <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
                                        Se connecter
                                    </a>
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <Lock size={12} />
                                    <span>Vos données sont protégées</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Benefits sidebar */}
                <div className="mt-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 text-center">
                        <Trophy size={20} className="inline-block mr-2" /> Pourquoi rejoindre ToyExchange ?
                    </h3>
                    <div className="space-y-4">
                        {[
                            { icon: <Gift size={20} />, text: "Réduisez votre impact environnemental", color: "from-green-400 to-emerald-500" },
                            { icon: <Handshake size={20} />, text: "Économisez sur les jouets", color: "from-yellow-400 to-orange-500" },
                            { icon: <Handshake size={20} />, text: "Connectez-vous avec des parents", color: "from-blue-400 to-cyan-500" },
                            { icon: <Gamepad2 size={20} />, text: "Accès illimité aux échanges", color: "from-purple-400 to-pink-500" }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                    {benefit.icon}
                                </div>
                                <span className={`font-medium bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                                    {benefit.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
                    25% { transform: translateY(-30px) rotate(10deg); opacity: 0.25; }
                    50% { transform: translateY(-15px) rotate(-10deg); opacity: 0.15; }
                    75% { transform: translateY(-25px) rotate(5deg); opacity: 0.20; }
                }
                
                .animate-float {
                    animation: float ease-in-out infinite;
                }

                .flex-2 {
                    flex: 2;
                }
            `}</style>
        </div>
    );