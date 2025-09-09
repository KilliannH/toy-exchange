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
import { useVerifyEmailTranslations } from "@/hooks/useVerifyEmailTranslations";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const t = useVerifyEmailTranslations();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage(t.messages.missingToken);
      return;
    }

    // Vérifier le token
    verifyEmail(token);
  }, [searchParams, t.messages.missingToken]);

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
        setMessage(t.messages.success);
      } else {
        if (data.error === 'Token expired') {
          setStatus('expired');
          setMessage(t.messages.expired);
        } else {
          setStatus('error');
          setMessage(data.error || t.messages.verificationError);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage(t.messages.generalError);
    }
  };

  const resendVerification = async () => {
    try {
      setStatus('loading');
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage(t.messages.resendSuccess);
      } else {
        setStatus('error');
        setMessage(t.messages.resendError);
      }
    } catch (error) {
      setStatus('error');
      setMessage(t.messages.generalError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">

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
                {t.titles.verifying}
              </span>
            )}
            
            {status === 'success' && (
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {t.titles.verified}
              </span>
            )}
            
            {status === 'error' && (
              <span className="text-red-400">
                {t.titles.error}
              </span>
            )}
            
            {status === 'expired' && (
              <span className="text-orange-400">
                {t.titles.expired}
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
                  {t.actions.signIn}
                </Link>
                <p className="text-sm text-gray-400">
                  {t.info.canSignIn}
                </p>
              </>
            )}

            {status === 'expired' && (
              <button
                onClick={resendVerification}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t.actions.resendLink}
              </button>
            )}

            {status === 'error' && (
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t.actions.retryRegistration}
              </Link>
            )}

            {/* Back to home */}
            <Link
              href="/"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {t.actions.backToHome}
            </Link>
          </div>

          {/* Loading state additional info */}
          {status === 'loading' && (
            <p className="text-sm text-gray-500 mt-6">
              {t.info.verifyingEmail}
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