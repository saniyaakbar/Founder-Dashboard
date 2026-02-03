'use client';

import Link from 'next/link';
import RevenueTrendChart from '@/components/charts/RevenueTrendChart';
import ActivityBarChart from '@/components/charts/ActivityBarChart';
import UserDistributionChart from '@/components/charts/UserDistributionChart';
import { useCountUp } from '@/lib/hooks/useCountUp';

// Stat Card Component
function StatCard({
  label,
  value,
  change,
  icon,
  rawValue,
  format,
}: {
  label: string;
  value: string | number;
  change: string;
  icon: string;
  rawValue?: number;
  format?: { prefix?: string; suffix?: string; decimals?: number };
}) {
  // Use count-up animation if rawValue is provided
  const animatedValue = useCountUp({
    end: rawValue ?? 0,
    duration: 1000,
    decimals: format?.decimals ?? 0,
    prefix: format?.prefix ?? '',
    suffix: format?.suffix ?? '',
    separator: ',',
  });

  const displayValue = rawValue !== undefined ? animatedValue : value;

  return (
    <div className="card p-6 shadow-sm hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 h-full flex flex-col group">
      <div className="flex items-start justify-between flex-1">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight" aria-label={`${label}: ${value}`}>
            {displayValue}
          </p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-3 font-medium">{change}</p>
        </div>
        <div className="text-3xl shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  user,
  action,
  timestamp,
  status,
}: {
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}) {
  const statusColors = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{user}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{action}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <p className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</p>
        <span
          className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
            statusColors[status]
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}

// Mock data
const stats = [
  {
    label: 'Total Users',
    value: '2,543',
    change: '+12% from last month',
    icon: '👥',
    rawValue: 2543,
    format: {},
  },
  {
    label: 'Active Users',
    value: '1,821',
    change: '+5.2% from last week',
    icon: '✨',
    rawValue: 1821,
    format: {},
  },
  {
    label: 'Revenue',
    value: '$48,320',
    change: '+23% from last month',
    icon: '💰',
    rawValue: 48320,
    format: { prefix: '$' },
  },
  {
    label: 'System Health',
    value: '99.8%',
    change: 'All systems operational',
    icon: '🟢',
    rawValue: 99.8,
    format: { suffix: '%', decimals: 1 },
  },
];

const activityLog = [
  {
    user: 'Sarah Chen',
    action: 'Added 5 new products to inventory',
    timestamp: '2 minutes ago',
    status: 'success' as const,
  },
  {
    user: 'Marcus Johnson',
    action: 'Updated user permissions',
    timestamp: '15 minutes ago',
    status: 'success' as const,
  },
  {
    user: 'Emily Rodriguez',
    action: 'Exported monthly report',
    timestamp: '1 hour ago',
    status: 'success' as const,
  },
  {
    user: 'David Park',
    action: 'Failed login attempt detected',
    timestamp: '3 hours ago',
    status: 'error' as const,
  },
  {
    user: 'Jessica Lee',
    action: 'Database backup in progress',
    timestamp: '5 hours ago',
    status: 'pending' as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Welcome back. Here&apos;s your performance summary.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Two Column Layout: Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend Chart - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Revenue Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>
          <RevenueTrendChart />
        </div>

        {/* Recent Activity - Takes 1 column on large screens */}
        <div className="card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <div>
            {activityLog.map((item, idx) => (
              <ActivityItem key={idx} {...item} />
            ))}
          </div>
          <Link
            href="/dashboard/activity"
            className="w-full mt-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg transition-colors border border-border/50 hover:border-border inline-block text-center"
          >
            View all activity →
          </Link>
        </div>
      </div>

      {/* User Activity Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_1fr] gap-4">
        {/* Left Card - Weekly User Activity */}
        <div className="card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Weekly User Activity
            </h2>
            <p className="text-xs text-muted-foreground mt-1">New user signups by day</p>
          </div>
          <ActivityBarChart />
        </div>

        {/* Right Card - User Distribution */}
        <div className="card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Signup Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Weekday vs Weekend</p>
          </div>
          <UserDistributionChart />
        </div>
      </div>

      {/* Optional: Quick Actions Footer */}
      <div className="card p-5 shadow-sm border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span>
            <span>Monitor user engagement in the Users section</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span>
            <span>Track product performance in the Products section</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span>
            <span>Configure notifications in Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
