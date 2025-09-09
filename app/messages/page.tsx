// app/messages/page.tsx
"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { MessageSquare, Loader2, Frown, ToyBrick } from "lucide-react";
import Link from "next/link";
import { useMessagesTranslations } from '@/hooks/useMessagesTranslations';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MessagesPage() {
  const { data: session } = useSession();
  const t = useMessagesTranslations();
  
  const { data: conversationsData, error, isLoading } = useSWR(
    session ? "/api/conversations" : null,
    fetcher
  );

  // Toujours un tableau
  const conversations = Array.isArray(conversationsData)
    ? conversationsData
    : conversationsData?.items ?? [];

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{t.error.accessDenied}</h2>
          <p className="text-gray-300">
            {t.error.loginRequired}
          </p>
          <Link
            href="/login"
            className="mt-6 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-3 rounded-xl transition-all duration-300"
          >
            {t.error.signIn}
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">{t.error.oops}</h2>
          <p className="text-red-300">
            {t.error.cannotLoadConversations}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
          >
            {t.error.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !conversationsData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg">
            {t.loadingConversations}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            {t.pageTitle}
          </h1>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <MessageSquare
              size={96}
              className="text-gray-500 mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.empty.noConversations}
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              {t.empty.noMessagesYet}
            </p>
            <Link
              href="/toys"
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t.empty.browseToys}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations
              .filter(
                (c: any) => c && c.toy?.id && (c.sender?.id || c.receiver?.id)
              )
              .map((conv: any) => {
                const myId = session?.user?.id;
                const partnerId =
                  conv?.sender?.id === myId
                    ? conv?.receiver?.id
                    : conv?.sender?.id;
                const toyId = conv?.toy?.id;
                const img0 = conv?.toy?.images?.[0];
                const signedUrl = img0?.signedUrl;
                const title = conv?.toy?.title ?? t.conversation.defaultTitle;
                const createdAt = conv?.createdAt
                  ? new Date(conv.createdAt).toLocaleDateString()
                  : "";
                const content = conv?.content ?? "";
                const isRead = !!conv?.isRead;

                if (!partnerId || !toyId) return null;

                return (
                  <Link
                    href={`/messages/${toyId}?partnerId=${partnerId}`}
                    key={`${toyId}-${partnerId}`}
                    className="relative group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                        {signedUrl ? (
                          <img
                            src={signedUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ToyBrick className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {createdAt}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                          {content}
                        </p>
                      </div>
                      <MessageSquare
                        size={24}
                        className={`text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 ${
                          !isRead ? "text-purple-400 animate-pulse" : ""
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}