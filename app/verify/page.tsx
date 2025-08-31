// app/verify/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Home
} from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    // Vérifier le token
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
      } else {
        if (data.error === 'Token expired') {
          setStatus('expired');
          setMessage('Le lien de vérification a expiré');
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la vérification');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue lors de la vérification');
    }
  };

  const resendVerification = async () => {
    try {
      setStatus('loading');
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage('Un nouveau lien de vérification a été envoyé');
      } else {
        setStatus('error');
        setMessage('Erreur lors de l\'envoi du lien');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
          
          {/* Status Icon */}
          <div className="mb-8">
            {status === 'loading' && (
              <div className="text-cyan-400 animate-spin">
                <Loader2 size={64} className="mx-auto" />
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-green-400 animate-bounce">
                <CheckCircle size={64} className="mx-auto" />
              </div>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <div className="text-red-400 animate-pulse">
                <XCircle size={64} className="mx-auto" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            {status === 'loading' && (
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Vérification en cours...
              </span>
            )}
            
            {status === 'success' && (
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Email vérifié !
              </span>
            )}
            
            {status === 'error' && (
              <span className="text-red-400">
                Erreur de vérification
              </span>
            )}
            
            {status === 'expired' && (
              <span className="text-orange-400">
                Lien expiré
              </span>
            )}
          </h1>

          {/* Message */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="space-y-4">
            {status === 'success' && (
              <>
                <Link
                  href="/login"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Se connecter
                </Link>
                <p className="text-sm text-gray-400">
                  Vous pouvez maintenant vous connecter à votre compte
                </p>
              </>
            )}

            {status === 'expired' && (
              <button
                onClick={resendVerification}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Renvoyer le lien
              </button>
            )}

            {status === 'error' && (
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Réessayer l'inscription
              </Link>
            )}

            {/* Back to home */}
            <Link
              href="/"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Loading state additional info */}
          {status === 'loading' && (
            <p className="text-sm text-gray-500 mt-6">
              Vérification de votre adresse email...
            </p>
          )}
        </div>

        {/* ToyExchange branding */}
        <div className="text-center mt-8">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ToyExchange
          </Link>
        </div>
      </div>
    </div>
  );
}