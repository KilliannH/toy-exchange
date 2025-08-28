"use client";

export default function DeleteToyButton({ toyId }: { toyId: string }) {
  async function handleDelete() {
    if (!confirm("Supprimer ce jouet ?")) return;

    const res = await fetch(`/api/toys/${toyId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Jouet supprimé !");
      window.location.reload(); // ou mieux : déclencher un refetch avec SWR
    } else {
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="mt-2 text-sm text-red-600 hover:underline"
    >
      Supprimer
    </button>
  );
}