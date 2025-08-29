// components/ConfirmationBadge.tsx
import { CheckCircle } from "lucide-react";

export default function ConfirmationBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 text-green-400 font-semibold px-4 py-2 rounded-full border border-green-400 bg-green-400/10">
      <CheckCircle size={20} /> {label}
    </span>
  );
}