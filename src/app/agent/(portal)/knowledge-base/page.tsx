import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { kbArticles } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

export default function StaffKnowledgeBasePage() {
  return (
    <div>
      <PageHeader
        title="Knowledge base"
        subtitle="Manage the articles clients see when self-serving support."
        actions={<Button icon={<Plus size={15} />}>New article</Button>}
      />

      <Card>
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Views</th>
              <th className="px-5 py-3 font-medium">Helpful</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {kbArticles.map((a) => (
              <tr key={a.id} className="hover:bg-ink-50/60">
                <td className="max-w-[280px] px-5 py-3.5">
                  <p className="truncate font-medium text-ink-800">{a.title}</p>
                  <p className="truncate text-xs text-ink-400">{a.summary}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-600">{a.category}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-600">{a.views.toLocaleString()}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-600">{a.helpfulPct}%</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-500">{formatDate(a.updatedAt)}</td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"><Eye size={14} /></button>
                    <button className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"><Pencil size={14} /></button>
                    <button className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
