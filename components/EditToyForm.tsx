"use client";

import { useState } from "react";
import { mutate } from "swr";

export default function EditToyForm({ toy, onClose }: { toy: any; onClose: () => void }) {
    const [title, setTitle] = useState(toy.title);
    const [description, setDescription] = useState(toy.description);
    const [ageMin, setAgeMin] = useState(toy.ageMin);
    const [ageMax, setAgeMax] = useState(toy.ageMax);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleImages, setVisibleImages] = useState(toy.images);

    async function uploadImages(files: File[]) {
        const fileNames: string[] = [];
        for (const file of files) {
            const res = await fetch(`/api/upload-url?type=${encodeURIComponent(file.type)}`);
            const { url, fileName } = await res.json();

            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            fileNames.push(fileName);
        }
        return fileNames;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let newImageNames: string[] = [];
        if (newFiles.length > 0) {
            newImageNames = await uploadImages(newFiles);
        }

        const res = await fetch(`/api/toys/${toy.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                ageMin,
                ageMax,
                removeImages,
                newImages: newImageNames,
            }),
        });

        if (res.ok) {
            mutate("/api/toys/mine");
            onClose();
        } else {
            alert("Erreur lors de la mise à jour");
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded p-2"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded p-2"
            />
            <div className="flex gap-2">
                <input
                    type="number"
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="border rounded p-2 w-1/2"
                />
                <input
                    type="number"
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="border rounded p-2 w-1/2"
                />
            </div>

            {/* Images existantes */}
            <div>
                <p className="font-medium">Images existantes</p>
                <div className="flex gap-2 flex-wrap">
                    {visibleImages.map((img: any) => (
                        <div key={img.id} className="relative">
                            <img src={img.signedUrl} alt="" className="w-20 h-20 object-cover rounded" />
                            <button
                                type="button"
                                onClick={() => {
                                    setRemoveImages((prev) =>
                                        prev.includes(img.url) ? prev : [...prev, img.url]
                                    );
                                    setVisibleImages((prev) => prev.filter((i: any) => i.id !== img.id));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ajout de nouvelles images */}
            <div>
                <p className="font-medium">Ajouter de nouvelles images</p>
                <p className="text-xs text-gray-500">
                    {toy.images.length - removeImages.length} / 5 images utilisées
                </p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const selected = Array.from(e.target.files || []);
                        const already = toy.images.length - removeImages.length;
                        if (selected.length + already > 5) {
                            alert(`Vous ne pouvez pas dépasser 5 images par jouet (il reste ${5 - already} slot(s))`);
                            return;
                        }
                        setNewFiles(selected);
                    }}
                />
            </div>

            <div className="flex gap-2 mt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    {loading ? "Sauvegarde..." : "Sauvegarder"}
                </button>
                <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
                    Annuler
                </button>
            </div>
        </form>
    );
}
