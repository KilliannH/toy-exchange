import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailPage";

export default function VerifyWrapper() {
  return (
    <Suspense fallback={<div className="text-white">Chargement...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}