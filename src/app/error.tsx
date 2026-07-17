"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const REDIRECT_SECONDS = 10;

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);


  useEffect(() => {
    if (secondsLeft <= 0 && pathname.includes("/client")) {
      router.push("/client");
      return;
    } else if (secondsLeft <= 0 && pathname.includes("/agent")) {
      router.push("/agent");
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* signature graphic: same node graph, one connection snapped */}
        <svg
          viewBox="0 0 200 200"
          className="h-40 w-40 sm:h-48 sm:w-48"
          role="img"
          aria-label="Connection interrupted"
        >
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#16A34A"
            strokeOpacity="0.12"
            strokeWidth="1"
          />

          <line
            x1="100"
            y1="100"
            x2="165"
            y2="60"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          <line
            x1="100"
            y1="100"
            x2="150"
            y2="150"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          <line
            x1="100"
            y1="100"
            x2="70"
            y2="75"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1="30"
            y1="45"
            x2="18"
            y2="52"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          <path
            d="M78 82 L84 90 L76 96 L82 104"
            stroke="#DC2626"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="165"
            cy="60"
            r="6"
            fill="#DCFCE7"
            stroke="#16A34A"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="6"
            fill="#DCFCE7"
            stroke="#16A34A"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx="30"
            cy="45"
            r="5"
            fill="#FEE2E2"
            stroke="#DC2626"
            strokeWidth="2"
            opacity="0.7"
          />

          <circle
            cx="100"
            cy="100"
            r="18"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="2"
          />
          <line
            x1="100"
            y1="93"
            x2="100"
            y2="101"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="106" r="1.4" fill="#DC2626" />
        </svg>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-red-600">
          Status: Connection lost
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Something broke on our end
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          An unexpected error interrupted this page. Try again, or head back to
          login.
        </p>
        {error?.digest ? (
          <p className="mt-2 font-mono text-xs text-slate-400">
            Ref: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#16A34A]/30 transition hover:bg-[#15803D]"
          >
            Back to login
          </button>
        </div>

        <div
          className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-red-500/70 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Redirecting to login in {secondsLeft}s
        </p>
      </div>
    </main>
  );
}
