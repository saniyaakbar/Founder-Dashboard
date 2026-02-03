'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface SettingsState {
  organizationName: string;
  defaultRole: 'viewer' | 'admin';
  emailNotifications: boolean;
  weeklySummary: boolean;
  twoFactorAuth: boolean;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    organizationName: 'Acme Corporation',
    defaultRole: 'viewer',
    emailNotifications: true,
    weeklySummary: true,
    twoFactorAuth: false,
  });
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isRoleDropdownOpen &&
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }

      if (
        isThemeDropdownOpen &&
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
    }

    if (isRoleDropdownOpen || isThemeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isRoleDropdownOpen, isThemeDropdownOpen]);

  const handleSaveChanges = () => {
    console.log('Saving settings:', settings);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: 'viewer' | 'admin') => {
    const name = 'defaultRole';
    const value = role;
    setSettings((prev) => ({
      ...prev,
      [name]: value as 'viewer' | 'admin',
    }));
  };

  const handleRoleSelect = (role: 'viewer' | 'admin') => {
    setSettings((prev) => ({
      ...prev,
      defaultRole: role,
    }));
    setIsRoleDropdownOpen(false);
  };

  const handleThemeSelect = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    setIsThemeDropdownOpen(false);
  };

  const handleToggleChange = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage organization and system preferences
        </p>
      </div>

      {/* Organization Settings Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Organization Settings</h2>
        </div>
        <div className="px-6 py-6 space-y-6">
          {/* Organization Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={settings.organizationName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border bg-bg-input text-text-primary rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Default Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Default Role for New Users
            </label>
            <div ref={roleDropdownRef} className="relative w-full">
              {/* Dropdown Trigger Button */}
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full px-3 py-2 border border-border bg-bg-input text-text-primary rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors flex items-center justify-between text-left"
              >
                <span className="capitalize">{settings.defaultRole}</span>
                <svg
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    isRoleDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 card z-10">
                  <button
                    onClick={() => handleRoleSelect('viewer')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      settings.defaultRole === 'viewer'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-card-foreground hover:bg-card/80'
                    }`}
                  >
                    Viewer
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors border-t border-border ${
                      settings.defaultRole === 'admin'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-card-foreground hover:bg-card/80'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                Receive email notifications for important updates
              </p>
            </div>
            <button
              onClick={() => handleToggleChange('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Weekly Summary Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Summary</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get a weekly summary of your account activity
              </p>
            </div>
            <button
              onClick={() => handleToggleChange('weeklySummary')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklySummary ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklySummary ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          {/* Two-Factor Authentication Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => handleToggleChange('twoFactorAuth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="px-6 py-6 space-y-6">
          {/* Theme Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Theme
            </label>
            <div ref={themeDropdownRef} className="relative w-full">
              {/* Dropdown Trigger Button */}
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="w-full px-3 py-2 border border-border bg-bg-input text-text-primary rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors flex items-center justify-between text-left"
              >
                <span>
                  {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Light'}
                </span>
                <svg
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    isThemeDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isThemeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 card z-10">
                  <button
                    onMouseDown={() => handleThemeSelect('light')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-card-foreground hover:bg-card/80'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onMouseDown={() => handleThemeSelect('dark')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors border-t border-border ${
                      theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-card-foreground hover:bg-card/80'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onMouseDown={() => handleThemeSelect('system')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors border-t border-border ${
                      theme === 'system'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-card-foreground hover:bg-card/80'
                    }`}
                  >
                    System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
