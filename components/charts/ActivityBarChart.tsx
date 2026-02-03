'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for daily activity/user signups
const data = [
  { day: 'Mon', users: 45 },
  { day: 'Tue', users: 62 },
  { day: 'Wed', users: 58 },
  { day: 'Thu', users: 75 },
  { day: 'Fri', users: 88 },
  { day: 'Sat', users: 52 },
  { day: 'Sun', users: 38 },
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
        {payload[0].value} new users
      </p>
    </div>
  );
}

export default function ActivityBarChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading chart...</div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  // Theme-aware colors - softer, more refined
  const colors = {
    bar: isDark ? '#34d399' : '#10b981', // emerald-400 in dark, emerald-500 in light
    grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.15)',
    text: isDark ? 'rgba(203, 213, 225, 0.6)' : 'rgba(100, 116, 139, 0.7)',
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        barGap={10}
        barCategoryGap="30%"
      >
        {/* Ultra-subtle horizontal grid lines */}
        <CartesianGrid
          strokeDasharray="2 4"
          stroke={colors.grid}
          vertical={false}
        />
        
        {/* X-axis with minimal, muted labels */}
        <XAxis
          dataKey="day"
          stroke={colors.text}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        
        {/* Y-axis with subtle styling */}
        <YAxis
          stroke={colors.text}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          width={35}
        />
        
        {/* Custom tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          cursor={false}
        />
        
        {/* Bar with rounded corners, reduced width, and smooth animation */}
        <Bar
          dataKey="users"
          fill={colors.bar}
          radius={[8, 8, 0, 0]}
          maxBarSize={28}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
