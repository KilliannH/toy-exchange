"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ArrowRightLeft,
  AlertTriangle,
  Eye,
  Trash2,
  UserCheck,
  Ban,
  CheckCircle,
  ToyBrick,
  Shield,
  Crown,
  Settings
} from "lucide-react";

interface DashboardData {
  stats: {
    users: number;
    toys: number;
    exchanges: number;
    pendingReports: number;
  };
  recentToys: any[];
  pendingReports: any[];
  recentUsers: any[];
}

export default function AdminDashboardClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<'toys' | 'reports' | 'users'>('toys');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'MODERATOR':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'SUPER_ADMIN':
        return <Settings className="w-4 h-4 text-purple-400" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      SUPER_ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      ADMIN: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      MODERATOR: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      USER: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    
    return colors[role] || colors.USER;
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const time = new Date(date);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Il y a quelques minutes";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jours`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-300">Gestion et modération de ToyExchange</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Utilisateurs", value: data.stats.users, icon: <Users className="w-8 h-8" />, color: "from-blue-500 to-cyan-500" },
            { label: "Jouets", value: data.stats.toys, icon: <Package className="w-8 h-8" />, color: "from-green-500 to-emerald-500" },
            { label: "Échanges", value: data.stats.exchanges, icon: <ArrowRightLeft className="w-8 h-8" />, color: "from-purple-500 to-pink-500" },
            { label: "Signalements", value: data.stats.pendingReports, icon: <AlertTriangle className="w-8 h-8" />, color: "from-red-500 to-orange-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4">
            {[
              { key: 'toys', label: 'Jouets récents', icon: <Package className="w-5 h-5" /> },
              { key: 'reports', label: 'Signalements', icon: <AlertTriangle className="w-5 h-5" /> },
              { key: 'users', label: 'Utilisateurs récents', icon: <Users className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {activeTab === 'toys' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-6">Jouets récemment publiés</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium pb-3">Jouet</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Propriétaire</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Statut</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Date</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.recentToys.map((toy) => (
                      <tr key={toy.id} className="hover:bg-white/5">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {toy.images[0] ? (
                              <img
                                src={toy.images[0].signedUrl}
                                alt={toy.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                                <ToyBrick className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-white truncate max-w-[200px]">
                                {toy.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {toy.mode} • {toy.condition}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(toy.user.role)}
                            <div>
                              <div className="text-white font-medium">
                                {toy.user.name || 'Sans nom'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {toy.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            toy.status === 'AVAILABLE' 
                              ? 'bg-green-500/20 text-green-300'
                              : toy.status === 'RESERVED'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {toy.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400 text-sm">
                          {formatTimeAgo(toy.createdAt)}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/toys/${toy.id}`}
                              className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-6">Signalements en attente</h3>
              
              {data.pendingReports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-400">Aucun signalement en attente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.pendingReports.map((report) => (
                    <div key={report.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="font-semibold text-red-300">
                              {report.reason}
                            </span>
                          </div>
                          
                          <div className="text-white mb-2">
                            Jouet signalé : <Link href={`/toys/${report.toy.id}`} className="text-cyan-400 hover:underline">{report.toy.title}</Link>
                          </div>
                          
                          <div className="text-gray-400 text-sm mb-3">
                            Signalé par : {report.reporter?.name || 'Utilisateur anonyme'} • {formatTimeAgo(report.createdAt)}
                          </div>
                          
                          <p className="text-gray-300 text-sm">
                            {report.message}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Approuver
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Rejeter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-6">Utilisateurs récents</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium pb-3">Utilisateur</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Rôle</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Statut</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Activité</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Inscription</th>
                      <th className="text-left text-gray-300 font-medium pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {user.name || 'Sans nom'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.emailVerified 
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {user.emailVerified ? 'Vérifié' : 'Non vérifié'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-gray-400">
                            {user._count.toys} jouets
                          </div>
                        </td>
                        <td className="py-4 text-gray-400 text-sm">
                          {formatTimeAgo(user.createdAt)}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/user/${user.id}`}
                              className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}