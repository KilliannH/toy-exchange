"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Leaf, Gem, Rocket, Pen, Handshake, Gift, Dice5, Palette, Puzzle, ToyBrick, Train, Dices, Sparkles } from "lucide-react";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.02 + 'px',
            top: mousePosition.y * 0.02 + 'px',
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce"
          style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-float text-white/50"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '6s'
            }}
          >
            {/* Replacing emojis with Lucide React icons */}
            {i === 0 && <ToyBrick size={48} />}
            {i === 1 && <Dices size={48} />}
            {i === 2 && <Palette size={48} />}
            {i === 3 && <Train size={48} />}
            {i === 4 && <Dice5 size={48} />}
            {i === 5 && <Puzzle size={48} />}
          </div>
        ))}
      </div>

      {/* Hero section */}
      <section className="relative z-10 text-center py-32 px-6">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
              ToyExchange
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full animate-pulse" />
          </div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed text-center">
            Révolutionnez l&apos;échange de jouets{" "}
            <span
              className="inline-flex align-middle"
            >
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
              Moins de gaspillage, plus de magie partagée
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              href="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 transform"
            >
              <span className="relative z-10">Commencer l'aventure</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/register"
              className="group bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span className="group-hover:text-cyan-300 transition-colors">Découvrir les jouets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Pourquoi ToyExchange ?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Leaf size={48} className="text-green-400" />,
                title: "Planète préservée",
                description: "Chaque échange évite la production d'un nouveau jouet et réduit l'empreinte carbone de votre famille.",
                gradient: "from-green-400 to-emerald-600"
              },
              {
                icon: <Gem size={48} className="text-blue-400" />,
                title: "Budget maîtrisé",
                description: "Économisez jusqu'à 80% sur les jouets tout en offrant des expériences variées à vos enfants.",
                gradient: "from-blue-400 to-cyan-600"
              },
              {
                icon: <Rocket size={48} className="text-purple-400" />,
                title: "Réseau parents",
                description: "Rejoignez une communauté engagée de parents qui partagent vos valeurs de durabilité.",
                gradient: "from-purple-400 to-pink-600"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl"
                  style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

                <div className="relative">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-white">
            Comment ça marche ?
          </h2>

          <div className="grid gap-12 md:gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Publiez", icon: <Pen size={32} />, desc: "Ajoutez les jouets que vous souhaitez échanger" },
              { step: "2", title: "Négociez", icon: <Handshake size={32} />, desc: "Discutez avec d'autres parents pour organiser l'échange" },
              { step: "3", title: "Échangez", icon: <Gift size={32} />, desc: "Rencontrez-vous et réalisez l'échange en toute simplicité" }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <span className="relative z-10">{item.step}</span>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 text-center py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Rejoignez la révolution du partage
          </h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Commencez aujourd'hui à échanger vos jouets et découvrez de nouveaux trésors pour vos enfants
          </p>

          <div className="relative inline-block group">
            <Link
              href="/register"
              className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 text-xl block"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Démarrer maintenant <Rocket size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Logo et description */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ToyExchange
                </span>
              </Link>
              <p className="text-gray-400 max-w-md leading-relaxed">
                La plateforme qui révolutionne l'échange de jouets entre parents.
                Moins de gaspillage, plus de partage, pour un avenir durable.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
              <div className="space-y-2">
                <Link href="/toys" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Parcourir les jouets
                </Link>
                <Link href="/post" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Ajouter un jouet
                </Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Mon tableau de bord
                </Link>
                <Link href="/profile" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Mon profil
                </Link>
              </div>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <div className="space-y-2">
                <Link href="/legal/privacy" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="/legal/terms" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Conditions générales
                </Link>
                <Link href="/legal/mentions" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Mentions légales
                </Link>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 ToyExchange. Tous droits réservés. Fait avec 💚 pour une planète plus verte.</p>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}