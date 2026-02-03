'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Mock revenue data for the last 30 days
const data = [
  { date: 'Jan 1', revenue: 1200 },
  { date: 'Jan 3', revenue: 1450 },
  { date: 'Jan 5', revenue: 1800 },
  { date: 'Jan 7', revenue: 1650 },
  { date: 'Jan 9', revenue: 1900 },
  { date: 'Jan 11', revenue: 1500 },
  { date: 'Jan 13', revenue: 2100 },
  { date: 'Jan 15', revenue: 2200 },
  { date: 'Jan 17', revenue: 2050 },
  { date: 'Jan 19', revenue: 2400 },
  { date: 'Jan 21', revenue: 2600 },
  { date: 'Jan 23', revenue: 2300 },
  { date: 'Jan 25', revenue: 2550 },
  { date: 'Jan 27', revenue: 2400 },
  { date: 'Jan 29', revenue: 2800 },
  { date: 'Jan 31', revenue: 3000 },
];

interface TooltipPayload {
  value: number;
  dataKey: string;
}

// Custom tooltip component with theme support
function CustomTooltip({ 
  active, 
  payload, 
  label 
}: { 
  active?: boolean; 
  payload?: TooltipPayload[]; 
  label?: string 
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!active || !payload || !payload.length || !mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="rounded-xl shadow-xl border px-3.5 py-2.5 backdrop-blur-sm"
      style={{
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
      }}
    >
      <p
        className="text-[10px] font-medium mb-0.5 uppercase tracking-wide"
        style={{ color: isDark ? 'rgba(203, 213, 225, 0.7)' : 'rgba(100, 116, 139, 0.8)' }}
      >
        {label}
      </p>
      <p
        className="text-base font-semibold"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
      >
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueTrendChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full h-75 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading chart...</div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  // Theme-aware colors - softer, more refined
  const colors = {
    line: isDark ? '#60a5fa' : '#3b82f6', // blue-400 in dark, blue-500 in light
    gradient: isDark
      ? ['rgba(96, 165, 250, 0.12)', 'rgba(96, 165, 250, 0)']
      : ['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0)'],
    grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.15)',
    text: isDark ? 'rgba(203, 213, 225, 0.6)' : 'rgba(100, 116, 139, 0.7)',
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.gradient[0]} />
            <stop offset="100%" stopColor={colors.gradient[1]} />
          </linearGradient>
        </defs>
        
        {/* Ultra-subtle grid lines */}
        <CartesianGrid
          strokeDasharray="2 4"
          stroke={colors.grid}
          vertical={false}
        />
        
        {/* X-axis with minimal, muted labels */}
        <XAxis
          dataKey="date"
          stroke={colors.text}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
          interval="preserveStartEnd"
        />
        
        {/* Y-axis with formatted currency */}
        <YAxis
          stroke={colors.text}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          width={45}
        />
        
        {/* Custom tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          cursor={false}
        />
        
        {/* Area fill with subtle gradient */}
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={colors.line}
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{
            r: 4,
            fill: colors.line,
            stroke: isDark ? '#0f172a' : '#ffffff',
            strokeWidth: 3,
          }}
          animationDuration={1200}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
