'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
// Theme Toggle Button Component
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with same dimensions to prevent layout shift
    return (
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-200 text-slate-900 dark:text-white"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        // Sun icon for dark mode
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon for light mode
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}


// Navigation items configuration
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Users', href: '/dashboard/users', icon: '👥' },
  { label: 'Products', href: '/dashboard/products', icon: '📦' },
  { label: 'Activity', href: '/dashboard/activity', icon: '📈' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

// Helper to get page title from pathname
function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const secondLastSegment = segments[segments.length - 2];
  
  if (!lastSegment || lastSegment === 'dashboard') return 'Dashboard';
  
  // If it looks like a dynamic ID (user detail page), show "User Details" instead
  if (secondLastSegment === 'users' && /^\d+$/.test(lastSegment)) {
    return 'User Details';
  }
  
  // If it looks like a numeric ID for any route, skip it
  if (/^\d+$/.test(lastSegment)) {
    return secondLastSegment ? secondLastSegment.charAt(0).toUpperCase() + secondLastSegment.slice(1) : 'Dashboard';
  }
  
  // Capitalize first letter
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

// Sidebar Navigation Component
function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 dark:from-[#0f1420] dark:to-[#0a0e1a] text-white flex flex-col border-r border-slate-700/50 dark:border-slate-800/50">
      {/* Logo / Brand */}
      <div className="px-6 py-8 border-b border-slate-700/50 dark:border-slate-800/50 shrink-0">
        <h1 className="text-2xl font-bold text-slate-50">FounderDash</h1>
      </div>

      {/* Navigation Links - Scrollable */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          // Check if the current route matches or starts with the nav item href
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-600/40'
                  : 'text-slate-300 dark:text-slate-400 hover:bg-slate-800/60 dark:hover:bg-slate-800/40 hover:text-slate-100'
              }`}
            >
              <span className={`text-xl ${isActive ? 'text-white' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Pro Card - Fixed at Bottom */}
      <div className="px-4 py-4 border-t border-slate-700/50 dark:border-slate-800/50 shrink-0">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5 border border-blue-500/20 dark:border-blue-500/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✨</span>
            <h3 className="text-sm font-semibold text-slate-50">Upgrade to Pro</h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 leading-relaxed">
            Unlock advanced analytics, unlimited users, and priority support.
          </p>
          <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-700/50 dark:border-slate-800/50 text-xs text-slate-400 dark:text-slate-500 shrink-0">
        <p>© 2026 FounderDash</p>
      </div>
    </aside>
  );
}

// Top Navigation Bar Component
function Topbar({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-gradient-to-r from-slate-900 to-slate-950 dark:from-[#0f1420] dark:to-[#0a0e1a] border-b border-slate-700/50 dark:border-slate-800/50 flex items-center justify-between px-8 transition-colors backdrop-blur-sm">
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-slate-50">{pageTitle}</h2>

      {/* Profile Placeholder */}
      <div className="flex items-center gap-4">
          {/* Theme Toggle - placed left of avatar */}
          <ThemeToggle />

        <button className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          F
        </button>
      </div>
    </header>
  );
}

// Main Layout Component
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar pathname={pathname} />

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col bg-background transition-colors">
        {/* Top Navigation */}
        <Topbar pageTitle={pageTitle} />

        {/* Main Content Area */}
        <main className="flex-1 mt-16 overflow-auto">
          <div className="p-8 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
