"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CityCheckWrapperProps {
  children: React.ReactNode;
}

export default function CityCheckWrapper({ children }: CityCheckWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserCity = async () => {
      if (status === "loading") return;
      
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        // Vérifier si l'utilisateur a une ville dans la base de données
        const response = await fetch("/api/users/check-city");
        const data = await response.json();

        if (!data.hasCity) {
          router.push("/onboarding/city");
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la ville:", error);
      }

      setIsChecking(false);
    };

    checkUserCity();
  }, [session, status, router]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification du profil...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;