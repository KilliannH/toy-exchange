// app/legal/privacy/page.tsx
import { Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PrivacyPolicyPage() {

    const privacy = `**1. Données collectées**  
    Nous collectons les données suivantes : nom, prénom, adresse email, adresse postale, historique des annonces, informations de connexion, données de navigation.  

**2. Finalités**  
Vos données sont utilisées pour :  
Créer et gérer votre compte utilisateur.  
Permettre les échanges et dons de jouets.  
Améliorer l’expérience utilisateur.  
Répondre à vos demandes de contact.  
Vous envoyer des informations relatives au service.  

**3. Base légale du traitement**  
Les données sont collectées sur la base de votre consentement et/ou pour l’exécution du contrat d’utilisation de la plateforme.  

**4. Destinataires**  
Vos données ne sont partagées qu’avec les prestataires techniques strictement nécessaires au fonctionnement du service (ex : hébergeur).  

**5. Durée de conservation**  
Les données sont conservées pendant 3 ans à compter de la dernière activité de l’utilisateur.  

**6. Vos droits**  
Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression, d’opposition et de portabilité de vos données. Pour exercer vos droits, vous pouvez nous contacter à l’adresse suivante : privacy@toy-exchange.org.  

**7. Cookies**  
ToyExchange utilise des cookies nécessaires au fonctionnement du site.
Avec votre accord, nous utilisons aussi des cookies de mesure d’audience (pour analyser l’utilisation du site) et des cookies de marketing (Meta Pixel) pour personnaliser nos publicités. Vous pouvez accepter, refuser ou personnaliser vos choix lors de votre première visite.`

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-cyan-400 mb-6">
                        <Shield size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        Politique de confidentialité
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Votre vie privée est importante pour nous
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
                            <p className="text-blue-200 text-center m-0">
                                <strong>Dernière mise à jour :</strong> 30/08/2025
                            </p>
                        </div>

                        {/* Le contenu markdown sera inséré ici */}
                        <div className="text-gray-300 space-y-6">
                            <ReactMarkdown>{privacy}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-12">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
}