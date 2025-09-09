// app/messages/[toyId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ConfirmationBadge from "@/components/ConfirmationBadge";
import { ArrowLeft, Send, Loader2, Frown, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useConversationTranslations } from '@/hooks/useConversationTranslations';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function ReviewForm({ exchangeId, partner, existingReview }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const t = useConversationTranslations();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error(t.reviews.ratingRequired);
            return;
        }
        setIsSubmitting(true);
        await fetch(`/api/exchanges/${exchangeId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, comment }),
        });
        toast.success(t.reviews.reviewSuccess);
        setIsSubmitting(false);
        mutate(`/api/conversations/${exchangeId}/messages`);
    };

    const isReadOnly = !!existingReview;

    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
                <Star className="inline-block mr-2 text-yellow-400" size={24} />
                {t.getReviewTitle(partner?.name)}
            </h3>

            {/* Étoiles */}
            <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        onClick={() => !isReadOnly && setRating(n)}
                        disabled={isReadOnly}
                        className={n <= rating ? "text-yellow-400" : "text-gray-500"}
                    >
                        ★
                    </button>
                ))}
            </div>

            {/* Commentaire */}
            <textarea
                value={comment}
                onChange={(e) => !isReadOnly && setComment(e.target.value)}
                placeholder={t.reviews.commentPlaceholder}
                className="w-full bg-white/5 border border-white/20 text-white rounded-xl p-3 resize-none"
                disabled={isReadOnly}
            />

            {/* Bouton seulement si pas encore soumis */}
            {!isReadOnly && (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t.reviews.submitting : t.reviews.submitReview}
                </button>
            )}
        </div>
    );
}

export default function ConversationPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const t = useConversationTranslations();

    const toyId = params.toyId as string;
    const partnerId = searchParams.get('partnerId');

    const { data: conversationData, error, isLoading, isValidating } = useSWR(
        session && partnerId ? `/api/conversations/${toyId}/messages?partnerId=${partnerId}` : null,
        fetcher,
        { refreshInterval: 5000 }
    );

    const messages = conversationData?.messages;
    const toy = conversationData?.toy;
    const exchange = conversationData?.exchange;

    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isConfirmingDonation, setIsConfirmingDonation] = useState(false);
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
                mutate(`/api/conversations/${toyId}/messages?partnerId=${partnerId}`);
            } else {
                const errorData = await res.json();
                toast.error(t.getSendError(errorData.error || res.statusText));
            }
        } catch (err) {
            console.error(err);
            toast.error(t.messages.networkError);
        } finally {
            setIsSending(false);
        }
    };

    const handleConfirmDonation = async () => {
        if (!session || !toyId) return;

        if (!window.confirm(t.donation.confirmPrompt)) {
            return;
        }

        setIsConfirmingDonation(true);
        try {
            const res = await fetch(`/api/toys/${toyId}/donated`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partnerId })
            });

            if (res.ok) {
                toast.success(t.donation.donationSuccess);
                mutate(`/api/conversations/${toyId}/messages?partnerId=${partnerId}`);
            } else {
                const errorData = await res.json();
                toast.error(t.getDonationError(errorData.error || res.statusText));
            }
        } catch (err) {
            console.error(err);
            toast.error(t.donation.networkError);
        } finally {
            setIsConfirmingDonation(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
                    <div className="text-8xl mb-6 text-red-400"><Frown size={96} className="mx-auto" /></div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4">{t.loadingError}</h2>
                    <p className="text-red-300">{t.cannotLoadConversation}</p>
                </div>
            </div>
        );
    }

    if (isLoading || !messages || !toy) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/80 text-lg">{t.loadingConversation}</p>
                </div>
            </div>
        );
    }

    const conversationPartner = messages[0]?.sender.id === session?.user?.id
        ? messages[0]?.receiver
        : messages[0]?.sender;
    const toyTitle = toy.title || t.unknownToy;

    const isOwner = session?.user?.id === toy.userId;
    const isDonated = toy.status === "EXCHANGED";
    const showReviewForm = exchange?.status === 'COMPLETED';

    return (
        <div className="min-h-screen bg-slate-900 relative">

            <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col h-screen">
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg rounded-3xl border border-white/10 mb-4">
                    {/* Header gauche : retour + partenaire */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/messages"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                        >
                            <ArrowLeft size={24} className="text-white" />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {conversationPartner?.name || conversationPartner?.email?.split('@')[0]}
                            </h1>
                            <p className="text-sm text-gray-400">{t.getAboutToy(toyTitle)}</p>
                        </div>
                    </div>

                    {/* --- Zone d'actions selon le mode --- */}

                    {/* 1) Mode ÉCHANGE */}
                    {toy.mode === "EXCHANGE" && exchange && (
                        <>
                            {exchange.status === "PENDING" ? (
                                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 px-4 py-2">
                                    <span className="text-white/80">{t.exchange.confirmExchange}</span>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm(t.exchange.confirmExchangePrompt)) return;
                                            
                                            const res = await fetch(`/api/exchanges/${exchange.id}/confirm`, {
                                                method: "PATCH",
                                            });
                                            if (res.ok) {
                                                toast.success(t.exchange.exchangeSuccess);
                                                mutate(`/api/conversations/${toyId}/messages?partnerId=${partnerId}`);
                                            } else {
                                                const err = await res.json();
                                                toast.error(t.getExchangeError(err.error));
                                            }
                                        }}
                                        disabled={
                                            (exchange.requesterId === session?.user?.id && exchange.requesterConfirmed) ||
                                            (toy.userId === session?.user?.id && exchange.ownerConfirmed)
                                        }
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full transition-all disabled:opacity-50"
                                    >
                                        <CheckCircle size={20} />
                                        {(exchange.requesterId === session?.user?.id && exchange.requesterConfirmed) ||
                                            (toy.userId === session?.user?.id && exchange.ownerConfirmed)
                                            ? t.exchange.youConfirmed
                                            : t.exchange.confirm}
                                    </button>
                                </div>
                            ) : exchange.status === "COMPLETED" && (
                                <ConfirmationBadge label={t.exchange.exchangeConfirmed} />
                            )}
                        </>
                    )}

                    {/* 2) Mode DON */}
                    {toy.mode === "DON" && (
                        <>
                            {isOwner && !isDonated && (
                                <button
                                    onClick={handleConfirmDonation}
                                    disabled={isConfirmingDonation || isDonated}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isConfirmingDonation ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <CheckCircle size={20} />
                                    )}
                                    {t.donation.confirmDonation}
                                </button>
                            )}

                            {isDonated && <ConfirmationBadge label={t.donation.donationConfirmed} />}
                        </>
                    )}

                    {/* 3) Mode POINTS */}
                    {toy.mode === "POINTS" && (
                        <>
                            {toy.status === "AVAILABLE" && session?.user?.id !== toy.userId ? (
                                <button
                                    onClick={async () => {
                                        if (!window.confirm(t.getConfirmPrompt(toy.pointsCost))) return;

                                        const res = await fetch(`/api/toys/${toyId}/buy`, { method: "POST" });

                                        if (res.ok) {
                                            toast.success(t.points.purchaseSuccess);
                                            mutate(`/api/conversations/${toyId}/messages?partnerId=${partnerId}`);
                                        } else {
                                            const err = await res.json();
                                            toast.error(t.getPurchaseError(err.error));
                                        }
                                    }}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50"
                                >
                                    <CheckCircle size={20} />
                                    {t.getConfirmPurchase(toy.pointsCost)}
                                </button>
                            ) : toy.status === "EXCHANGED" && (
                                <ConfirmationBadge label={t.getPurchaseConfirmed(toy.pointsCost)} />
                            )}
                        </>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 mb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`p-4 rounded-3xl max-w-xs md:max-w-md ${msg.sender.id === session?.user?.id
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-white/10 text-gray-300 rounded-bl-none'
                                }`}>
                                <div className="text-xs text-gray-400 mb-1">
                                    {msg.sender.id === session?.user?.id ? t.messages.you : conversationPartner?.name}
                                </div>
                                {msg.proposedToy ? (
                                    <div className="bg-white/10 p-4 rounded-xl">
                                        <img src={msg.proposedToy.images?.[0]?.signedUrl} className="w-32 h-32 object-cover rounded-lg mb-2" />
                                        <div className="text-white font-semibold">{msg.proposedToy.title}</div>
                                        {msg.content && <p className="text-gray-300 mt-2">{msg.content}</p>}
                                    </div>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Affichage conditionnel du formulaire d'avis */}
                {showReviewForm && (
                    <div className="mt-4">
                        <ReviewForm exchangeId={exchange.id} partner={conversationPartner} existingReview={exchange.reviews?.[0]} />
                    </div>
                )}

                <div className="p-4 bg-black/50 backdrop-blur-lg rounded-3xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <textarea
                            className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2 resize-none"
                            placeholder={isDonated ? t.getCompleteMessage(toy.mode) : t.messages.writeMessage}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={1}
                            disabled={isDonated}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isSending || !newMessage.trim() || isDonated}
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