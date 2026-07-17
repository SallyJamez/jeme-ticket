"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface CsatWidgetProps {
  existing: number | null;
  onSubmit?: (rating: number, comment: string) => Promise<void> | void;
}

export function CsatWidget({ existing, onSubmit }: CsatWidgetProps) {
  const [rating, setRating] = useState(existing ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(existing));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit?.(rating, comment);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
        <p className="text-sm font-semibold text-brand-800">Thanks for your feedback</p>
        <div className="mt-1.5 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={16} className={n <= rating ? "fill-brand-600 text-brand-600" : "text-ink-200"} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
      <p className="text-sm font-semibold text-ink-800">How was your resolution experience?</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="focus-ring rounded p-0.5"
            aria-label={`Rate ${n} star`}
          >
            <Star size={22} className={(hover || rating) >= n ? "fill-amber-400 text-amber-400" : "text-ink-200"} />
          </button>
        ))}
      </div>
      <Textarea
        rows={2}
        placeholder="Anything you'd like to add? (optional)"
        className="mt-3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button size="sm" className="mt-3" disabled={rating === 0 || submitting} onClick={handleSubmit}>
        {submitting ? "Submitting…" : "Submit feedback"}
      </Button>
    </div>
  );
}
