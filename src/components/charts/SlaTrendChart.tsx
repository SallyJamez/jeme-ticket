"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { slaComplianceTrend } from "@/lib/mock-data";

export function SlaTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={slaComplianceTrend} margin={{ left: -20, right: 10, top: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} formatter={(v) => [`${v}%`, "SLA compliance"]} />
        <Line type="monotone" dataKey="compliance" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3.5, fill: "#16A34A" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
