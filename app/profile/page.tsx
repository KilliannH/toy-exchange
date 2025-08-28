import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 animate-pulse">😵</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Profil introuvable</h2>
          <p className="text-red-300">Une erreur s'est produite lors du chargement</p>
        </div>
      </div>
    );
  }

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
                  <span className="text-3xl">👤</span>
                  Informations personnelles
                </h2>
                <a
                  href="/profile/edit"
                  className="group bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </a>
              </div>

              <div className="grid gap-6">
                {[
                  { 
                    label: "Nom complet", 
                    value: user.name || "Non renseigné", 
                    icon: "🏷️",
                    color: "from-blue-400 to-cyan-400",
                    isEmpty: !user.name 
                  },
                  { 
                    label: "Adresse email", 
                    value: user.email, 
                    icon: "📧",
                    color: "from-purple-400 to-pink-400",
                    isEmpty: false 
                  },
                  { 
                    label: "Ville", 
                    value: user.city || "Non renseigné", 
                    icon: "🏙️",
                    color: "from-green-400 to-emerald-400",
                    isEmpty: !user.city 
                  }
                ].map((field, index) => (
                  <div key={index} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 font-medium mb-1">
                          {field.label}
                        </div>
                        <div className={`text-lg font-semibold ${
                          field.isEmpty 
                            ? "text-gray-500 italic" 
                            : `bg-gradient-to-r ${field.color} bg-clip-text text-transparent`
                        }`}>
                          {field.value}
                        </div>
                      </div>
                      {field.isEmpty && (
                        <div className="text-yellow-400 animate-pulse">⚠️</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                <span className="text-3xl">⚙️</span>
                Préférences
              </h2>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl animate-pulse">📍</div>
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
                <span className="text-2xl">📊</span>
                Statistiques
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: "Jouets postés", value: "12", icon: "🎮", color: "from-blue-500 to-cyan-500" },
                  { label: "Échanges réalisés", value: "8", icon: "🔄", color: "from-green-500 to-emerald-500" },
                  { label: "Note moyenne", value: "4.8", icon: "⭐", color: "from-yellow-500 to-orange-500" },
                  { label: "Membre depuis", value: "6 mois", icon: "🗓️", color: "from-purple-500 to-pink-500" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
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
                <span className="text-2xl">🏆</span>
                Badges
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Premier échange", icon: "🥇", earned: true },
                  { name: "Généreux", icon: "💝", earned: true },
                  { name: "Ambassadeur", icon: "🌟", earned: false },
                  { name: "Expert", icon: "🎯", earned: false }
                ].map((badge, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:scale-105 ${
                      badge.earned 
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300" 
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                <a
                  href="/toys"
                  className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🔍</span>
                  Parcourir les jouets
                </a>
                
                <a
                  href="/post"
                  className="group w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-4 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="text-lg">➕</span>
                  Ajouter un jouet
                </a>
                
                <a
                  href="/dashboard"
                  className="group w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">📋</span>
                  Mon dashboard
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Membre actif de la communauté !
            </h3>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
          </div>
          <p className="text-gray-300 mb-6">
            Merci de contribuer à un monde plus durable grâce au partage de jouets
          </p>
          
          {/* Progress to next level */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Niveau Explorateur</span>
              <span>12/20 échanges</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse" />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              8 échanges pour débloquer le niveau "Ambassadeur" 🌟
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
            <span className="text-3xl">📈</span>
            Activité récente
          </h2>
          
          <div className="space-y-4">
            {[
              { action: "Nouvel échange proposé", toy: "Lego Creator", time: "Il y a 2h", type: "exchange" },
              { action: "Jouet ajouté", toy: "Puzzle 1000 pièces", time: "Hier", type: "post" },
              { action: "Message reçu", toy: "Train en bois", time: "Il y a 3j", type: "message" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  activity.type === "exchange" 
                    ? "bg-blue-500/20 text-blue-300" 
                    : activity.type === "post"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-purple-500/20 text-purple-300"
                }`}>
                  {activity.type === "exchange" ? "🔄" : activity.type === "post" ? "➕" : "💬"}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-gray-400 text-sm">{activity.toy}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}