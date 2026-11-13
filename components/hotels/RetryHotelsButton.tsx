"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function RetryHotelsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="ui-button ui-button-primary mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white disabled:cursor-wait disabled:opacity-70"
    >
      <RefreshCw
        aria-hidden="true"
        className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Retrying…" : "Try again"}
    </button>
  );
}
