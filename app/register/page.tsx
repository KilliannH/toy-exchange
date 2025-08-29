"use client";

import { useState } from "react";
import { User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, Trophy, Gift, Handshake, Gamepad2, Tent, Star } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            setStep(3); // Success step
            setTimeout(() => {
                alert("Compte créé 🎉 vous pouvez maintenant vous connecter");
                setName("");
                setEmail("");
                setPassword("");
                setStep(1);
            }, 2000);
        } else {
            const data = await res.json();
            alert(data.error || "Erreur lors de l'inscription");
        }

        setLoading(false);
    }

    const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

    const passwordStrength = 
        password.length < 4 ? '🔴 Faible' :
        password.length < 6 ? '🟡 Moyen' :
        password.length < 8 ? '🟢 Bon' : '💪 Excellent';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center p-6">
            {/* Dynamic background orbs */}
            <div className="absolute inset-0 opacity-25">
                <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

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
                        {/* Using Lucide React icons instead of emojis */}
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
                                        <Tent size={64} className="mx-auto" />
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
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                                                step >= stepNum 
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                                    : 'bg-white/5 text-gray-400 border border-white/10'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                                step >= stepNum ? 'bg-emerald-500' : 'bg-white/20'
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
                                                onClick={() => name && email ? setStep(2) : null}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                                disabled={!name || !email}
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
                                                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                                                                password.length > i * 2 
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

                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
                                                >
                                                    <ArrowLeft size={16} className="inline-block mr-1" /> Retour
                                                </button>
                                                
                                                <button 
                                                    onClick={handleSubmit}
                                                    disabled={loading || password.length < 8}
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
}