'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Type definition for user data
type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Disabled';
  avatar: string;
  createdAt: string;
  lastActive: string;
  authMethod: string;
  twoFactorAuth: boolean;
  lastLogin: string;
  devices: string[];
};

// Mock user data (in production, fetch from API)
const mockUserData: Record<string, UserData> = {
  '1': {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@founder.com',
    role: 'Founder',
    status: 'Active',
    avatar: 'SC',
    createdAt: '2024-01-15',
    lastActive: '2 hours ago',
    authMethod: 'Email & Password',
    twoFactorAuth: true,
    lastLogin: '2026-02-04 10:30 AM',
    devices: ['MacBook Pro (Chrome)', 'iPhone 15 (Safari)'],
  },
  '2': {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@founder.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'MJ',
    createdAt: '2024-02-20',
    lastActive: '1 day ago',
    authMethod: 'Email & Password',
    twoFactorAuth: false,
    lastLogin: '2026-02-03 03:45 PM',
    devices: ['Windows PC (Edge)', 'Android (Chrome)'],
  },
};

// Mock activity logs filtered by user
const mockActivityLogs = [
  {
    id: '1',
    action: 'Updated profile settings',
    timestamp: '2 hours ago',
    status: 'Success' as const,
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    action: 'Logged in from new device',
    timestamp: '1 day ago',
    status: 'Success' as const,
    ipAddress: '192.168.1.2',
  },
  {
    id: '3',
    action: 'Changed password',
    timestamp: '3 days ago',
    status: 'Success' as const,
    ipAddress: '192.168.1.1',
  },
  {
    id: '4',
    action: 'Failed login attempt',
    timestamp: '1 week ago',
    status: 'Error' as const,
    ipAddress: '203.0.113.0',
  },
];

// Avatar Component
function Avatar({ initials, size = 'lg' }: { initials: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const colorIndex = initials.charCodeAt(0) % colors.length;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full text-white flex items-center justify-center font-semibold`}
    >
      {initials}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: 'Active' | 'Disabled' }) {
  const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Disabled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
}

// Activity Status Badge
function ActivityStatusBadge({ status }: { status: 'Success' | 'Error' | 'Pending' }) {
  const statusStyles = {
    Success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'security'>('profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Get user data (simulating async fetch)
  useEffect(() => {
    const fetchUser = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const userData = mockUserData[userId];
        setUser(userData || null);
        setLoading(false);
      }, 100);
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="card p-12 text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const handleEditRole = () => {
    console.log('Edit role for user:', userId);
  };

  const handleDisableUser = () => {
    console.log('Disable user:', userId);
  };

  const handleResetPassword = () => {
    console.log('Reset password for user:', userId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar initials={user.avatar} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <div className="mt-2">
                <StatusBadge status={user.status as 'Active' | 'Disabled'} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleEditRole}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
            >
              Edit Role
            </button>
            <button
              onClick={handleDisableUser}
              className="px-4 py-2 border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-colors"
            >
              {user.status === 'Active' ? 'Disable User' : 'Enable User'}
            </button>
            <Link
              href="/dashboard/users"
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm font-medium text-foreground">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Joined Date</p>
            <p className="text-sm font-medium text-foreground">{user.createdAt}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Active</p>
            <p className="text-sm font-medium text-foreground">{user.lastActive}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Authentication</p>
            <p className="text-sm font-medium text-foreground">{user.authMethod}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Two-Factor Auth</p>
            <p className="text-sm font-medium text-foreground">
              {user.twoFactorAuth ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span>✓</span> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span>⚠</span> Disabled
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-border">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.role}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Joined Date</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.createdAt}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Last Active</label>
                  <div className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground">
                    {user.lastActive}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockActivityLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border hover:bg-background transition-colors">
                        <td className="px-6 py-3">
                          <p className="text-sm text-foreground">{log.action}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                        </td>
                        <td className="px-6 py-3">
                          <ActivityStatusBadge status={log.status} />
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-muted-foreground">{log.ipAddress}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.twoFactorAuth
                            ? 'Additional security layer is enabled'
                            : 'Enhance account security with 2FA'}
                        </p>
                      </div>
                      <div>
                        {user.twoFactorAuth ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                            <span>✓</span> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium">
                            <span>⚠</span> Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Last Login</p>
                    <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-3">Active Devices</p>
                    <div className="space-y-2">
                      {user.devices.map((device, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-base">💻</span>
                          <span>{device}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-semibold text-foreground mb-4">Security Actions</h3>
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
