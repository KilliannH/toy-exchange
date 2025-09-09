import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailPage";
import { getTranslations } from "next-intl/server";

export default async function VerifyWrapper() {
  const t = await getTranslations('verifyEmail');
  return (
    <Suspense fallback={<div className="text-white">{t('loading')}</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}