"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { kbArticles } from "@/lib/mock-data";
import { Search, ThumbsUp, Eye, BookOpen } from "lucide-react";

const categories = ["All", ...Array.from(new Set(kbArticles.map((a) => a.category)))];

export default function ClientKnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      kbArticles.filter(
        (a) =>
          (category === "All" || a.category === category) &&
          (query.trim() === "" || a.title.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, category]
  );

  return (
    <div>
      <PageHeader title="Knowledge base" subtitle="Answers to common questions, before you need to raise a ticket." />

      <div className="relative mb-6">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <Input
          placeholder="Search articles — e.g. 'webhook signature', 'settlement batch'"
          className="py-3 pl-11 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === c ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((a) => (
          <Card key={a.id} className="p-5 transition-shadow hover:shadow-pop">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <BookOpen size={16} />
            </div>
            <p className="mt-3 text-xs font-medium text-ink-400">{a.category}</p>
            <h3 className="mt-1 font-display text-sm font-semibold text-ink-900">{a.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{a.summary}</p>
            <div className="mt-4 flex items-center gap-4 border-t border-ink-100 pt-3 text-xs text-ink-400">
              <span className="flex items-center gap-1"><Eye size={12} /> {a.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><ThumbsUp size={12} /> {a.helpfulPct}% helpful</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-ink-400">No articles match your search.</p>
        )}
      </div>
    </div>
  );
}
