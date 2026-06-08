'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueDataPoint {
  month: string;
  starter: number;
  pro: number;
  white_label: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
          formatter={(value) => [`€${value ?? 0}`, '']}
        />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
        <Bar dataKey="starter" name="Starter" fill="#6366f1" radius={[3, 3, 0, 0]} stackId="a" />
        <Bar dataKey="pro" name="Pro" fill="#8b5cf6" radius={[3, 3, 0, 0]} stackId="a" />
        <Bar dataKey="white_label" name="White Label" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RevenueChart;
