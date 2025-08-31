// app/legal/mentions/page.tsx
import { FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown'

export default function LegalMentionsPage() {

    const mentionsLegales = `
**Nom du site / de l’application** : ToyExchange

**Éditeur** : Killiann Hervagault  
Adresse : 25 Rue de la planche au gue 44300 Nantes  
Email : support@toy-exchange.org  

**Directeur de publication** : Killiann Hervagault

**Hébergeur** : Google Cloud Platform  
Adresse : 8 Rue de Londres 75009 Paris 

## Propriété intellectuelle

Tous les contenus (textes, images, logo, design) sont la propriété exclusive de ToyExchange, sauf mentions contraires. Toute reproduction, même partielle, est interdite sans autorisation préalable.

## Responsabilité

ToyExchange agit comme intermédiaire technique. Il ne saurait être tenu responsable des contenus publiés par les utilisateurs ni des litiges intervenant entre eux.
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-emerald-400 mb-6">
                        <FileText size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-4">
                        Mentions légales
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Informations légales sur ToyExchange
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
                            <p className="text-emerald-200 text-center m-0">
                                <strong>Dernière mise à jour :</strong> 30/08/2025
                            </p>
                        </div>

                        {/* Le contenu markdown sera inséré ici */}
                        <div className="text-gray-300 space-y-6">
                            <ReactMarkdown>{mentionsLegales}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-12">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                    >
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
}