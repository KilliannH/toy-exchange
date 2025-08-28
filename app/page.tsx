import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          TroqueJouets
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Échangez les jouets de vos enfants avec d’autres parents 💡. 
          Moins de gaspillage, plus de partage !
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Créer un compte
          </Link>
          <Link
            href="/toys"
            className="bg-transparent border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Voir les jouets
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-center">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">♻️ Anti-gaspillage</h3>
          <p className="text-gray-600">
            Donnez une nouvelle vie aux jouets oubliés au fond des placards.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">💸 Économies</h3>
          <p className="text-gray-600">
            Échangez plutôt que d’acheter, et réduisez vos dépenses jouets.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🤝 Communauté</h3>
          <p className="text-gray-600">
            Connectez-vous avec d’autres parents autour de chez vous.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center py-16 bg-blue-50">
        <h2 className="text-2xl font-bold mb-4">Prêt à troquer ?</h2>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous gratuitement et commencez dès aujourd’hui.
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Je m’inscris →
        </Link>
      </section>
    </div>
  );
}