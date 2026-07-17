"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ticketVolumeSeries } from "@/lib/mock-data";

export function TicketVolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={ticketVolumeSeries} margin={{ left: -20, right: 10, top: 10 }}>
        <defs>
          <linearGradient id="created" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Area type="monotone" dataKey="created" name="Created" stroke="#16A34A" strokeWidth={2} fill="url(#created)" />
        <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#2563eb" strokeWidth={2} fill="url(#resolved)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
