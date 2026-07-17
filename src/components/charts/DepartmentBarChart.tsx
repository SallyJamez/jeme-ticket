"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { departmentPerformance } from "@/lib/mock-data";

export function DepartmentBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 10, right: 20, top: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} formatter={(v) => [`${v}%`, "SLA compliance"]} />
        <Bar dataKey="compliance" radius={[0, 6, 6, 0]} barSize={16}>
          {departmentPerformance.map((d: { compliance: number }, i: number) => (
            <Cell key={i} fill={d.compliance >= 90 ? "#16A34A" : d.compliance >= 85 ? "#d97706" : "#dc2626"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
