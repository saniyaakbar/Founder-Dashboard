'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Mock data for weekday vs weekend distribution
const data = [
  { name: 'Weekday', value: 368, percentage: 73 },
  { name: 'Weekend', value: 137, percentage: 27 },
];

interface TooltipPayload {
  name: string;
  value: number;
  percentage: number;
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TooltipPayload }[];
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
  const data = payload[0].payload;

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
        {data.name}
      </p>
      <p
        className="text-base font-semibold"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
      >
        {data.value} signups ({data.percentage}%)
      </p>
    </div>
  );
}

interface ViewBox {
  cx?: number;
  cy?: number;
}

// Custom label component for center text
function CenterLabel({ viewBox, totalValue }: { viewBox?: ViewBox; totalValue: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !viewBox) return null;

  const { cx, cy } = viewBox;
  
  if (cx === undefined || cy === undefined) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        style={{
          fontSize: '24px',
          fontWeight: 700,
          fill: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        {totalValue}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        style={{
          fontSize: '10px',
          fontWeight: 500,
          fill: isDark ? 'rgba(203, 213, 225, 0.6)' : 'rgba(100, 116, 139, 0.7)',
          letterSpacing: '0.5px',
        }}
      >
        THIS WEEK
      </text>
    </g>
  );
}

export default function UserDistributionChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  // Theme-aware colors
  const COLORS = isDark
    ? ['#34d399', '#a78bfa'] // emerald-400, violet-400
    : ['#10b981', '#8b5cf6']; // emerald-500, violet-500

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full flex flex-col">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            animationDuration={1200}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ outline: 'none' }}
              />
            ))}
            <CenterLabel totalValue={totalValue} />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 -mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span
              className="text-xs font-medium"
              style={{
                color: isDark ? 'rgba(203, 213, 225, 0.8)' : 'rgba(100, 116, 139, 0.9)',
              }}
            >
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
