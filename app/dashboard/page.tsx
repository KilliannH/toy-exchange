"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import EditToyForm from "@/components/EditToyForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: toys, error, isLoading } = useSWR("/api/toys/mine", fetcher);
  const [editingToy, setEditingToy] = useState<any | null>(null);

  async function handleDelete(toyId: string) {
    if (!confirm("Supprimer ce jouet ?")) return;
    const res = await fetch(`/api/toys/${toyId}`, { method: "DELETE" });
    if (!res.ok) alert("Erreur lors de la suppression");
  }

  if (error) return <div className="p-4 text-red-500">Erreur ❌</div>;
  if (isLoading || !toys) return <div className="p-4">Chargement...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Dashboard</h1>

      {editingToy && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Modifier le jouet</h2>
          <EditToyForm toy={editingToy} onClose={() => setEditingToy(null)} />
        </div>
      )}

      {toys.length === 0 ? (
        <p className="text-gray-600">
          Vous n’avez encore posté aucun jouet.{" "}
          <Link href="/post" className="text-blue-600 underline">
            Poster un jouet →
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toys.map((toy: any) => (
            <div
              key={toy.id}
              className="rounded-xl border p-4 shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold">{toy.title}</h2>
              <p className="text-sm text-gray-600">{toy.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                Âge: {toy.ageMin}-{toy.ageMax} ans · {toy.condition}
              </p>
              <Link
                href={`/toys/${toy.id}`}
                className="mt-2 inline-block text-blue-600 text-sm underline"
              >
                Voir →
              </Link>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setEditingToy(toy)}
                  className="text-sm text-yellow-600 hover:underline"
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(toy.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
