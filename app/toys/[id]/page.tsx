"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToyDetailPage() {
  const params = useParams();
  const { data: toy, error, isLoading } = useSWR(
    params?.id ? `/api/toys/${params.id}` : null,
    fetcher
  );

  if (error) return <div className="p-4 text-red-500">Erreur chargement ❌</div>;
  if (isLoading || !toy) return <div className="p-4">Chargement...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {toy.images?.[0] && (
        <img
          src={toy.images[0].url}
          alt={toy.title}
          className="rounded-xl w-full h-64 object-cover mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{toy.title}</h1>
      <p className="text-gray-700 mb-4">{toy.description}</p>

      <div className="space-y-1 text-sm text-gray-600">
        <p>État : <b>{toy.condition}</b></p>
        <p>Âge conseillé : {toy.ageMin} – {toy.ageMax} ans</p>
        <p>Mode : {toy.mode}</p>
        <p>Publié par : {toy.user?.email}</p>
      </div>
    </div>
  );
}