"use client";

import { useState, useEffect } from "react";

export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);

  useEffect(() => {
    // Charger profil actuel
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setCity(data.city || "");
        setRadiusKm(data.radiusKm || 10);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city, radiusKm }),
    });
    alert("Profil mis à jour ✅");
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier mon profil</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Rayon (km)"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <button className="bg-green-600 text-white rounded p-2 hover:bg-green-700">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
