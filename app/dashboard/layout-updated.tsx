'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { useTheme } from 'next-themes';

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col border-r border-slate-700 dark:border-slate-800">
      {/* Logo / Brand */}
      <div className="px-6 py-8 border-b border-slate-700 dark:border-slate-800">
        <h1 className="text-2xl font-bold">FounderDash</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          // Check if the current route matches or starts with the nav item href
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 dark:bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700 dark:border-slate-800 text-sm text-slate-400 dark:text-slate-500">
        <p>© 2026 FounderDash</p>
      </div>
    </aside>
  );
}

// Theme Toggle Button Component
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by checking client-side mounting
  if (typeof window !== 'undefined' && !mounted) {
    setMounted(true);
  }

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
      className="w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/10 hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors text-foreground"
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

// Top Navigation Bar Component
function Topbar({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-card border-b border-border flex items-center justify-between px-8 transition-colors">
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-foreground">{pageTitle}</h2>

      {/* Profile and Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle - placed left of avatar */}
        <ThemeToggle />

        {/* User Avatar */}
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
