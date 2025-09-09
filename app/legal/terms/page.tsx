// app/legal/terms/page.tsx
import { Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTermsTranslations } from '../../../hooks/useTermsTranslations';

export default function TermsPage() {
    const translations = useTermsTranslations();

    const terms = `${translations.sections.purpose.title}  

${translations.sections.purpose.content}  

${translations.sections.accessRegistration.title}  

${translations.sections.accessRegistration.content}  

${translations.sections.serviceOperation.title}  

${translations.sections.serviceOperation.content}  

${translations.sections.userCommitments.title}  

${translations.sections.userCommitments.content}  

${translations.sections.platformResponsibility.title}  

${translations.sections.platformResponsibility.content}  

${translations.sections.points.title}  

${translations.sections.points.content}  

${translations.sections.accountSuspension.title}  

${translations.sections.accountSuspension.content}  

${translations.sections.applicableLaw.title}  

${translations.sections.applicableLaw.content}`;

    return (
        <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Language Switcher */}
                <div className="flex justify-end mb-8">
                    <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2">
                        <button
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-purple-500 text-white"
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
                    <div className="text-purple-400 mb-6">
                        <Scale size={64} className="mx-auto" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                        {translations.page.title}
                    </h1>
                    <p className="text-gray-300 text-lg">
                        {translations.page.subtitle}
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
                            <p className="text-purple-200 text-center m-0">
                                <strong>{translations.page.lastUpdate}</strong> 30/08/2025
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
                        {translations.page.backToHome}
                    </a>
                </div>
            </div>
        </div>
    );
}