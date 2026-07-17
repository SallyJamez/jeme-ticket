"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REDIRECT_SECONDS = 8;

export default function NotFound() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push("/login");
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
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16A34A]/10 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* signature graphic: same node graph, a path drifting off into a "?" */}
        <svg
          viewBox="0 0 200 200"
          className="h-40 w-40 sm:h-48 sm:w-48"
          role="img"
          aria-label="Page not found"
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

          <path
            d="M40 140 C 65 120, 80 95, 100 100"
            fill="none"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          <path
            d="M100 100 C 120 105, 150 90, 168 55"
            fill="none"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.3"
            className="motion-safe:animate-pulse"
          />

          <circle
            cx="40"
            cy="140"
            r="6"
            fill="#DCFCE7"
            stroke="#16A34A"
            strokeWidth="2"
          />
          <circle
            cx="168"
            cy="55"
            r="4"
            fill="#16A34A"
            opacity="0.35"
            className="motion-safe:animate-bounce"
            style={{ animationDuration: "2.5s" }}
          />

          <circle
            cx="100"
            cy="100"
            r="20"
            fill="#FFFFFF"
            stroke="#16A34A"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text
            x="100"
            y="107"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#16A34A"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            ?
          </text>
        </svg>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-[#16A34A]">
          Error 404 · Route not found
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          This page wandered off
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          The link may be broken, or the page may have moved. Let&apos;s get you
          back to somewhere solid.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Go back
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
            className="h-full rounded-full bg-[#16A34A] transition-all duration-1000 ease-linear"
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
