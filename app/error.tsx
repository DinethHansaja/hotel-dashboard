"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering error:", error);
  }, [error]);

  return (
    <main className="flex min-h-full items-center justify-center bg-slate-50 px-5 py-12 text-slate-900">
      <section
        aria-labelledby="page-error-title"
        className="surface-card w-full max-w-xl rounded-2xl p-7 text-center md:p-10"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#806744]">
          <CircleAlert aria-hidden="true" className="h-6 w-6" />
        </span>
        <h1 id="page-error-title" className="page-title mt-5 text-2xl">
          This page didn’t load
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          Something went wrong while opening this page. You can try again or
          return to the guide.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="ui-button ui-button-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm text-white"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="ui-button ui-button-secondary inline-flex items-center px-4 py-2.5 text-sm"
          >
            Go to home
          </Link>
        </div>
      </section>
    </main>
  );
}
