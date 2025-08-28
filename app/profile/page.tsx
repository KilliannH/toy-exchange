import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Redirection stricte si non connecté
    redirect("/login");
  }

  // Charger le user depuis la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">Utilisateur introuvable ❌</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nom</p>
          <p className="font-medium">{user.name || "Non renseigné"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Ville</p>
          <p className="font-medium">{user.city || "Non renseigné"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Rayon de recherche</p>
          <p className="font-medium">
            {user.radiusKm ? `${user.radiusKm} km` : "10 km (par défaut)"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/profile/edit"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Modifier mon profil
        </a>
      </div>
    </div>
  );
}
