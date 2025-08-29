// app/messages/[toyId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, Loader2, Frown, ToyBrick, User } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ConversationPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    
    const toyId = params.toyId as string;
    const partnerId = searchParams.get('partnerId');

    const { data, error, isLoading } = useSWR(
        session && partnerId ? `/api/conversations/${toyId}/messages?partnerId=${partnerId}` : null,
        fetcher,
        { refreshInterval: 5000 }
    );
    const messages = data?.messages ?? [];

    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        if (session && partnerId && messages) {
            mutate('/api/messages/unread');
        }
     }, [messages, session, partnerId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !session || !partnerId) return;

        setIsSending(true);
        try {
            const res = await fetch(`/api/conversations/${toyId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    receiverId: partnerId
                })
            });

            if (res.ok) {
                setNewMessage("");
            } else {
                alert("Erreur lors de l'envoi du message.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau.");
        } finally {
            setIsSending(false);
        }
    };
    
    // Now, early return conditions
    // The session check can stay outside the useEffect if you want to render a loading screen
    if (isLoading || !messages) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Chargement de la conversation...</p>
                </div>
            </div>
        );
    }
    const conversationPartner = messages[0]?.senderId === session?.user?.id 
                                ? messages[0]?.receiver 
                                : messages[0]?.sender;
    const toyTitle = messages[0]?.toy?.title || "Jouet inconnu";

    console.log("messages raw from API:", messages);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* ... (background animations) ... */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col h-screen">
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg rounded-3xl border border-white/10 mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/messages" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300">
                            <ArrowLeft size={24} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {conversationPartner?.name || conversationPartner?.email?.split('@')[0]}
                            </h1>
                            <p className="text-sm text-gray-400">
                                À propos de: {toyTitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 mb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`p-4 rounded-3xl max-w-xs md:max-w-md ${
                                msg.sender.id === session?.user?.id
                                    ? 'bg-purple-600 text-white rounded-br-none'
                                    : 'bg-white/10 text-gray-300 rounded-bl-none'
                            }`}>
                                <div className="text-xs text-gray-400 mb-1">
                                  {msg.sender.id === session?.user?.id ? "Vous" : conversationPartner?.name}
                                </div>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-black/50 backdrop-blur-lg rounded-3xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <textarea
                            className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2 resize-none"
                            placeholder="Écrire un message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isSending || !newMessage.trim()}
                            className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}