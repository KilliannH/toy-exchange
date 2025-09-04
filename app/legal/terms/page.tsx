// app/legal/terms/page.tsx
import { Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function TermsPage() {
    const terms = `**1. Objet**  

La présente application permet aux utilisateurs de proposer des jouets en échange contre d'autres jouets, de les donner gratuitement ou de les offrir en échange de points utilisables sur la plateforme.  

**2. Accès et inscription**  

L’utilisation de la plateforme est réservée aux personnes physiques de 16 ans et plus. L’inscription est gratuite et nécessite la fourniture d’informations personnelles exactes. Chaque utilisateur s'engage à garder son identifiant et mot de passe confidentiels.  

**3. Fonctionnement du service**  

Échange : les utilisateurs peuvent proposer un jouet contre un autre.
Don : les utilisateurs peuvent offrir un jouet sans contrepartie.
Don contre points : les utilisateurs peuvent donner un jouet en échange de points, utilisables ensuite pour obtenir d'autres jouets.  

**4. Engagements des utilisateurs**  

Les utilisateurs s'engagent à ne proposer que des jouets conformes aux normes de sécurité, propres et en bon état. Il est strictement interdit de proposer des jouets contrefaits, défectueux ou dangereux.  

**5. Responsabilité de la plateforme**  

La plateforme agit en tant qu’intermédiaire entre utilisateurs. Elle ne peut être tenue responsable de la qualité, de la conformité ou de l’état des jouets échangés ou donnés. Tout litige devra être réglé entre les parties concernées.  

**6. Points**  

Les points permettent d’obtenir des jouets proposés sur la plateforme par d'autres utilisateurs. Ils peuvent être :
- Acquis gratuitement en donnant des jouets via la plateforme.
- Achetés via un système de paiement sécurisé (ex. Stripe).  
Les points ne sont pas remboursables, ne peuvent être échangés contre de l'argent, ni transférés entre utilisateurs. Leur usage est strictement limité à l’utilisation sur la plateforme.
La plateforme se réserve le droit de modifier à tout moment les règles d’attribution, d’achat ou d’utilisation des points.  

**7. Suspension ou suppression de compte**  

En cas de non-respect des présentes CGU, la plateforme pourra suspendre ou supprimer le compte de l’utilisateur, sans préavis.  

**8. Droit applicable**  

Les présentes conditions sont soumises au droit français. Tout litige relèvera de la compétence exclusive des tribunaux français.`;
    return (
        <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-purple-400 mb-6">
                        <Scale size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                        Conditions générales d'utilisation
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Les règles d'utilisation de ToyExchange
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
                            <p className="text-purple-200 text-center m-0">
                                <strong>Dernière mise à jour :</strong> 30/08/2025
                            </p>
                        </div>

                        {/* Le contenu markdown sera inséré ici */}
                        <div className="text-gray-300 space-y-6">
                            <ReactMarkdown>{terms}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-12">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
}