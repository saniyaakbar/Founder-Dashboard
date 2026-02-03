'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import TableShell from '@/components/table/TableShell';

// Types
interface ActivityLog {
  id: string;
  action: string;
  actionType:
    | 'User Created'
    | 'User Updated'
    | 'User Deleted'
    | 'Product Created'
    | 'Product Updated'
    | 'Product Deleted'
    | 'Settings Changed'
    | 'Login';
  performedBy: string;
  target: string;
  status: 'Success' | 'Error' | 'Pending';
  timestamp: string;
}

// Mock activity data
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'Created new user account',
    actionType: 'User Created',
    performedBy: 'Sarah Chen',
    target: 'alex.johnson@example.com',
    status: 'Success',
    timestamp: '2024-06-15 14:32',
  },
  {
    id: '2',
    action: 'Updated product pricing tier',
    actionType: 'Product Updated',
    performedBy: 'Marcus Williams',
    target: 'Dashboard Analytics Pro',
    status: 'Success',
    timestamp: '2024-06-15 13:18',
  },
  {
    id: '3',
    action: 'Deleted inactive user account',
    actionType: 'User Deleted',
    performedBy: 'Sarah Chen',
    target: 'john.doe@example.com',
    status: 'Success',
    timestamp: '2024-06-15 12:45',
  },
  {
    id: '4',
    action: 'Modified security settings',
    actionType: 'Settings Changed',
    performedBy: 'Alex Liu',
    target: 'Two-Factor Authentication',
    status: 'Pending',
    timestamp: '2024-06-15 11:22',
  },
  {
    id: '5',
    action: 'User login from new device',
    actionType: 'Login',
    performedBy: 'Emma Rodriguez',
    target: 'Chrome on Windows',
    status: 'Success',
    timestamp: '2024-06-15 10:15',
  },
  {
    id: '6',
    action: 'Failed to create product variant',
    actionType: 'Product Created',
    performedBy: 'Marcus Williams',
    target: 'Analytics API Client',
    status: 'Error',
    timestamp: '2024-06-15 09:42',
  },
  {
    id: '7',
    action: 'Updated user role and permissions',
    actionType: 'User Updated',
    performedBy: 'Sarah Chen',
    target: 'james.smith@example.com',
    status: 'Success',
    timestamp: '2024-06-14 16:30',
  },
  {
    id: '8',
    action: 'Archived old product version',
    actionType: 'Product Updated',
    performedBy: 'Marcus Williams',
    target: 'Mobile App v1.2',
    status: 'Success',
    timestamp: '2024-06-14 15:08',
  },
  {
    id: '9',
    action: 'Changed API rate limits',
    actionType: 'Settings Changed',
    performedBy: 'Alex Liu',
    target: 'API Configuration',
    status: 'Success',
    timestamp: '2024-06-14 14:25',
  },
  {
    id: '10',
    action: 'Bulk import of users failed',
    actionType: 'User Created',
    performedBy: 'Sarah Chen',
    target: 'CSV Import (50 users)',
    status: 'Error',
    timestamp: '2024-06-14 13:10',
  },
  {
    id: '11',
    action: 'User login attempt',
    actionType: 'Login',
    performedBy: 'Jessica Park',
    target: 'Safari on macOS',
    status: 'Success',
    timestamp: '2024-06-14 12:05',
  },
  {
    id: '12',
    action: 'Removed user from team',
    actionType: 'User Deleted',
    performedBy: 'Sarah Chen',
    target: 'michael.brown@example.com',
    status: 'Success',
    timestamp: '2024-06-14 11:18',
  },
];

// Status Badge Component
function StatusBadge({ status }: { status: 'Success' | 'Error' | 'Pending' }) {
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

// Table Row Component
function ActivityRow({ log }: { log: ActivityLog }) {
  return (
    <tr className="border-b border-border hover:bg-background transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-foreground">{log.action}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-muted-foreground">{log.performedBy}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-muted-foreground">{log.target}</p>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={log.status} />
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-muted-foreground">{log.timestamp}</p>
      </td>
    </tr>
  );
}

// Column Filter Header Component
function ColumnFilterHeader({
  label,
  filterId,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  filterId: string;
  options: string[];
  selectedValue: string;
  isOpen: boolean;
  onToggle: (id: string | null) => void;
  onSelect: (value: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const thRef = useRef<HTMLTableCellElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && thRef.current) {
      const rect = thRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <th ref={thRef} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <button
          ref={buttonRef}
          onClick={() => onToggle(isOpen ? null : filterId)}
          className="inline-flex items-center justify-center w-5 h-5 hover:bg-background rounded transition-colors shrink-0"
          title={`Filter ${label}`}
          aria-label={`Filter by ${label}`}
          aria-expanded={isOpen}
        >
          <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
        </button>

        {isOpen && typeof window !== 'undefined' && createPortal(
          <div 
            className="bg-[#f8fafc] dark:bg-[#1f2937] border border-border rounded-lg shadow-2xl overflow-hidden"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 10000,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  onToggle(null);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-none last:rounded-b-lg ${
                  selectedValue === option
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                    : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 text-foreground'
                } border-t border-border first:border-t-0`}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </th>
  );
}

// Main Activity Page Component
export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);
  const itemsPerPage = 5;

  // Handle outside click to close filters
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openFilterId &&
        tableHeaderRef.current &&
        !tableHeaderRef.current.contains(event.target as Node)
      ) {
        setOpenFilterId(null);
      }
    }

    if (openFilterId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openFilterId]);

  // Filter activity logs by search term, status, and action type
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      // Search filter (searches action and target)
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === 'All' || log.status === statusFilter;

      // Action type filter
      const matchesActionType =
        actionTypeFilter === 'All' || log.actionType === actionTypeFilter;

      return matchesSearch && matchesStatus && matchesActionType;
    });
  }, [searchTerm, statusFilter, actionTypeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters or search change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleActionTypeFilterChange = (value: string) => {
    setActionTypeFilter(value);
    setCurrentPage(1);
  };

  // Get unique action types from mock data
  const actionTypes = Array.from(
    new Set(mockActivityLogs.map((log) => log.actionType))
  ).sort();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity & Audit Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View all user actions and system changes
        </p>
      </div>

      {/* Search Bar */}
      <div className="h-11 bg-card rounded-lg border border-border flex items-center focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder="Search by action, target, or user..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-full px-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-none outline-none ring-0 shadow-none appearance-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Activity Table */}
      <TableShell
        page={currentPage}
        pageSize={itemsPerPage}
        total={filteredLogs.length}
        onPageChange={setCurrentPage}
        emptyState={<p className="text-muted-foreground">No activity logs found matching your filters</p>}
      >
        <table className="w-full">
          <thead ref={tableHeaderRef}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Performed By
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Target
              </th>
              <ColumnFilterHeader
                label="Status"
                filterId="status"
                options={['All', 'Success', 'Error', 'Pending']}
                selectedValue={statusFilter}
                isOpen={openFilterId === 'status'}
                onToggle={setOpenFilterId}
                onSelect={(value) => handleStatusFilterChange(value)}
                headerRef={tableHeaderRef}
              />
              <ColumnFilterHeader
                label="Action Type"
                filterId="actionType"
                options={['All', ...actionTypes]}
                selectedValue={actionTypeFilter}
                isOpen={openFilterId === 'actionType'}
                onToggle={setOpenFilterId}
                onSelect={(value) => handleActionTypeFilterChange(value)}
                headerRef={tableHeaderRef}
              />
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <ActivityRow key={log.id} log={log} />
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
