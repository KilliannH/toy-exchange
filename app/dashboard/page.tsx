"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import EditToyForm from "@/components/EditToyForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: toys, error, isLoading } = useSWR("/api/toys/mine", fetcher);
  const { data: stats } = useSWR("/api/profile/stats", fetcher);
  const [editingToy, setEditingToy] = useState<any | null>(null);

  async function handleDelete(toyId: string) {
    if (!confirm("Supprimer ce jouet ?")) return;
    const res = await fetch(`/api/toys/${toyId}`, { method: "DELETE" });
    if (!res.ok) alert("Erreur lors de la suppression");
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Oups, une erreur !</h2>
          <p className="text-red-300">Impossible de charger vos jouets</p>
        </div>
      </div>
    );
  }

  if (isLoading || !toys) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white/80 text-lg">Chargement de vos trésors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Mon Dashboard
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Gérez vos jouets et suivez vos échanges
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Mes jouets", value: stats?.toysCount || toys?.length || 0, icon: "🧸", color: "from-blue-500 to-cyan-500" },
            { label: "Échanges actifs", value: stats?.exchangesCount || 0, icon: "🔄", color: "from-green-500 to-emerald-500" },
            { label: "Messages", value: stats?.unreadMessages || 0, icon: "💬", color: "from-purple-500 to-pink-500" },
            { label: "Note moyenne", value: stats?.avgRating ? stats.avgRating.toFixed(1) : "N/A", icon: "⭐", color: "from-yellow-500 to-orange-500" }
          ].map((stat, i) => (
            <div key={i} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Editing form */}
        {editingToy && (
          <div className="mb-8 bg-black/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8">
            <EditToyForm toy={editingToy} onClose={() => setEditingToy(null)} />
          </div>
        )}

        {/* Toys grid */}
        {toys.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">🎪</div>
            <h2 className="text-3xl font-bold text-white mb-4">Votre collection est vide</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              Commencez par ajouter vos premiers jouets et rejoignez la communauté d'échange !
            </p>
            <Link 
              href="/post" 
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 inline-block"
            >
              <span className="relative z-10">🚀 Poster mon premier jouet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Mes jouets ({toys.length})</h2>
              <Link 
                href="/post" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Ajouter un jouet
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toys.map((toy: any, index: number) => (
                <div
                  key={toy.id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Toy header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                          {toy.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {toy.description}
                        </p>
                      </div>
                      <div className="ml-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                        🎮
                      </div>
                    </div>

                    {/* Toy details */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                        {toy.ageMin}-{toy.ageMax} ans
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                        {toy.condition}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/toys/${toy.id}`}
                        className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>Voir détails</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingToy(toy)}
                          className="group/btn p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg transition-all duration-200"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4 text-yellow-400 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(toy.id)}
                          className="group/btn p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all duration-200"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}