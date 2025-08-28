import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // Récupérer la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login"); // 🔒
  }

  // Charger les jouets liés à cet utilisateur
  const toys = await prisma.toy.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard – Bonjour {session.user.name || session.user.email}
      </h1>

      {toys.length === 0 ? (
        <p className="text-gray-600">
          Vous n’avez encore posté aucun jouet.{" "}
          <Link href="/post" className="text-blue-600 underline">
            Poster un jouet →
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toys.map((toy) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
