"use client";

import { useState } from "react";

export default function PostToyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  const [condition, setCondition] = useState("GOOD");
  const [category, setCategory] = useState("OTHER");
  const [mode, setMode] = useState("DON");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  async function uploadImages() {
    const fileNames: string[] = [];

    for (const file of files) {
      // 1. Obtenir URL signée pour ce type de fichier
      const res = await fetch(`/api/upload-url?type=${encodeURIComponent(file.type)}`);
      const { url, fileName } = await res.json();

      // 2. Uploader le fichier
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3. Ajouter le nom du fichier à la liste
      fileNames.push(fileName);
    }

    return fileNames;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const uploadedFiles = await uploadImages();

    const res = await fetch("/api/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        ageMin,
        ageMax,
        condition,
        category,
        mode,
        images: uploadedFiles.map((fileName) => ({ fileName })),
      }),
    });

    if (res.ok) {
      alert("Jouet ajouté avec images !");
      setTitle("");
      setDescription("");
      setFiles([]);
    } else {
      alert("Erreur lors de l’ajout du jouet.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Poster un jouet 🎁</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2"
          required
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Âge min"
            value={ageMin}
            onChange={(e) => setAgeMin(Number(e.target.value))}
            className="border rounded p-2 w-1/2"
          />
          <input
            type="number"
            placeholder="Âge max"
            value={ageMax}
            onChange={(e) => setAgeMax(Number(e.target.value))}
            className="border rounded p-2 w-1/2"
          />
        </div>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border rounded p-2"
        >
          <option value="NEW">Neuf</option>
          <option value="VERY_GOOD">Très bon état</option>
          <option value="GOOD">Bon état</option>
          <option value="USED">Usé</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="CONSTRUCTION">Construction</option>
          <option value="DOLLS">Poupées</option>
          <option value="VEHICLES">Véhicules</option>
          <option value="BOARD_GAMES">Jeux de société</option>
          <option value="BOOKS">Livres</option>
          <option value="OTHER">Autres</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded p-2"
        >
          <option value="DON">Don</option>
          <option value="EXCHANGE">Échange</option>
          <option value="POINTS">Points</option>
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            if (selected.length > 5) {
              alert("Maximum 5 images par jouet");
              return;
            }
            setFiles(selected);
          }}
        />

        {/* Preview */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, idx) => (
              <p key={idx} className="text-xs text-gray-600">
                {file.name}
              </p>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          {loading ? "Publication..." : "Publier le jouet"}
        </button>
      </form>
    </div>
  );
}
