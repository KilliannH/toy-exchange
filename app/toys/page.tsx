"use client";

import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToysPage() {
    const { data: toys, error, isLoading } = useSWR("/api/toys", fetcher);

    if (error) return <div className="p-4 text-red-500">Erreur de chargement ❌</div>;
    if (isLoading || !toys) return <div className="p-4">Chargement...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🎲 Jouets disponibles</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {toys.map((toy: any) => (
                    <div
                        key={toy.id}
                        className="rounded-xl border p-4 shadow hover:shadow-lg transition"
                    >
                        {toy.images?.[0] && (
                            <img
                                src={toy.images[0].url}
                                alt={toy.title}
                                className="h-40 w-full object-cover rounded-lg mb-2"
                            />
                        )}
                        <h2 className="font-semibold">
                            <Link href={`/toys/${toy.id}`}>{toy.title}</Link>
                        </h2>
                        <p className="text-sm text-gray-600">{toy.description}</p>
                        <p className="mt-2 text-xs text-gray-500">
                            Âge : {toy.ageMin}-{toy.ageMax} ans · {toy.condition}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                            {toy.mode}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
