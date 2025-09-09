// app/legal/privacy/page.tsx
import { Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePrivacyTranslations } from '../../../hooks/usePrivacyTranslations';

export default function PrivacyPolicyPage() {
    const translations = usePrivacyTranslations();

    const privacy = `${translations.sections.dataCollected.title}  
${translations.sections.dataCollected.content}  

${translations.sections.purposes.title}  
${translations.sections.purposes.content}  

${translations.sections.legalBasis.title}  
${translations.sections.legalBasis.content}  

${translations.sections.recipients.title}  
${translations.sections.recipients.content}  

${translations.sections.retention.title}  
${translations.sections.retention.content}  

${translations.sections.rights.title}  
${translations.sections.rights.content}  

${translations.sections.cookies.title}  
${translations.sections.cookies.content}`;

    return (
        <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Language Switcher */}
                <div className="flex justify-end mb-8">
                    <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2">
                        <button
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-cyan-500 text-white"
                        >
                            {translations.language.french}
                        </button>
                        <button
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-300 hover:text-white"
                        >
                            {translations.language.english}
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-cyan-400 mb-6">
                        <Shield size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        {translations.page.title}
                    </h1>
                    <p className="text-gray-300 text-lg">
                        {translations.page.subtitle}
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
                            <p className="text-blue-200 text-center m-0">
                                <strong>{translations.page.lastUpdate}</strong> 30/08/2025
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
                        {translations.page.backToHome}
                    </a>
                </div>
            </div>
        </div>
    );
}