'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import TableShell from '@/components/table/TableShell';
import Modal from '@/components/Modal';
import AddUserForm, { NewUserFormData } from '@/components/AddUserForm';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Founder' | 'Admin' | 'Viewer';
  status: 'Active' | 'Disabled';
  createdAt: string;
  avatar: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@founder.com',
    role: 'Founder',
    status: 'Active',
    createdAt: '2024-01-15',
    avatar: 'SC',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@founder.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-02-20',
    avatar: 'MJ',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@founder.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-03-10',
    avatar: 'ER',
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@founder.com',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-03-25',
    avatar: 'DP',
  },
  {
    id: '5',
    name: 'Jessica Lee',
    email: 'jessica@founder.com',
    role: 'Viewer',
    status: 'Disabled',
    createdAt: '2024-04-05',
    avatar: 'JL',
  },
  {
    id: '6',
    name: 'Robert Thompson',
    email: 'robert@founder.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-04-18',
    avatar: 'RT',
  },
  {
    id: '7',
    name: 'Amanda Wilson',
    email: 'amanda@founder.com',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-05-02',
    avatar: 'AW',
  },
  {
    id: '8',
    name: 'Christopher Martin',
    email: 'chris@founder.com',
    role: 'Founder',
    status: 'Active',
    createdAt: '2024-05-15',
    avatar: 'CM',
  },
  {
    id: '9',
    name: 'Lisa Anderson',
    email: 'lisa@founder.com',
    role: 'Viewer',
    status: 'Disabled',
    createdAt: '2024-05-28',
    avatar: 'LA',
  },
  {
    id: '10',
    name: 'James Taylor',
    email: 'james@founder.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-06-10',
    avatar: 'JT',
  },
];

// Avatar Component
function Avatar({ initials }: { initials: string }) {
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const colorIndex = initials.charCodeAt(0) % colors.length;

  return (
    <div
      className={`w-8 h-8 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center text-xs font-semibold`}
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

// Role Badge Component - ONLY for table cells
function RoleBadge({ role }: { role: 'Founder' | 'Admin' | 'Viewer' }) {
  const roleStyles = {
    Founder: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    Admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Viewer: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${roleStyles[role]}`}>
      {role}
    </span>
  );
}

// Role Dropdown Option Component - ONLY for dropdown menu
function RoleDropdownOption({ 
  label, 
  isSelected, 
  onClick 
}: { 
  label: string; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-none last:rounded-b-lg ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
          : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 text-foreground'
      } border-t border-border first:border-t-0`}
    >
      {label}
    </button>
  );
}

// Actions Dropdown Component
function ActionsMenu({
  userId,
  userName,
  openMenuId,
  onMenuToggle,
  onViewUser,
  onEditRole,
  onDisableUser,
  menuRef,
}: {
  userId: string;
  userName: string;
  openMenuId: string | null;
  onMenuToggle: (id: string) => void;
  onViewUser: (id: string, name: string) => void;
  onEditRole: (id: string, name: string) => void;
  onDisableUser: (id: string, name: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isOpen = openMenuId === userId;

  const handleViewUser = () => {
    onViewUser(userId, userName);
    onMenuToggle(userId);
  };

  const handleEditRole = () => {
    onEditRole(userId, userName);
    onMenuToggle(userId);
  };

  const handleDisableUser = () => {
    onDisableUser(userId, userName);
    onMenuToggle(userId);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(userId);
        }}
        className="p-1 hover:bg-background rounded transition-colors"
        title="Actions"
      >
        ⋮
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-1 z-10 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b1220, #0f1b33)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            minWidth: '180px',
            padding: '6px 0',
            boxShadow: '0 14px 30px rgba(0, 0, 0, 0.65)',
          }}
        >
          <button
            onClick={handleViewUser}
            className="w-full text-left transition-colors"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              color: '#e5e7eb',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.18)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#e5e7eb';
            }}
          >
            View user
          </button>
          <button
            onClick={handleEditRole}
            className="w-full text-left transition-colors"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              color: '#e5e7eb',
              backgroundColor: 'transparent',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.18)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#e5e7eb';
            }}
          >
            Edit role
          </button>
          <button
            onClick={handleDisableUser}
            className="w-full text-left transition-colors"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              color: '#f87171',
              backgroundColor: 'transparent',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.18)';
              e.currentTarget.style.color = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#f87171';
            }}
          >
            Disable user
          </button>
        </div>
      )}
    </div>
  );
}

// Table Row Component
function UserRow({
  user,
  openMenuId,
  onMenuToggle,
  onViewUser,
  onEditRole,
  onDisableUser,
  onRowClick,
  menuRef,
}: {
  user: User;
  openMenuId: string | null;
  onMenuToggle: (id: string) => void;
  onViewUser: (id: string, name: string) => void;
  onEditRole: (id: string, name: string) => void;
  onDisableUser: (id: string, name: string) => void;
  onRowClick: (userId: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <tr 
      onClick={() => onRowClick(user.id)}
      className="border-b border-border hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
    >
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <Avatar initials={user.avatar} />
          <div>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-3">
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </td>
      <td className="px-6 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-3">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-3">
        <p className="text-sm text-muted-foreground">{user.createdAt}</p>
      </td>
      <td className="px-6 py-3 text-center" onClick={(e) => e.stopPropagation()}>
        <ActionsMenu
          userId={user.id}
          userName={user.name}
          openMenuId={openMenuId}
          onMenuToggle={onMenuToggle}
          onViewUser={onViewUser}
          onEditRole={onEditRole}
          onDisableUser={onDisableUser}
          menuRef={menuRef}
        />
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
  onToggle: (id: string) => void;
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
        top: rect.bottom + 2, // Small gap to avoid overlap
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
          onClick={() => onToggle(isOpen ? '' : filterId)}
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
              <RoleDropdownOption
                key={option}
                label={option}
                isSelected={selectedValue === option}
                onClick={() => {
                  onSelect(option);
                  onToggle('');
                }}
              />
            ))}
          </div>,
          document.body
        )}
      </div>
    </th>
  );
}

// Main Users Page Component
export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);
  const openMenuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  // Avoid hydration mismatch by checking client-side mounting
  if (typeof window !== 'undefined' && !mounted) {
    setMounted(true);
  }

  // Load users from localStorage on mount
  useEffect(() => {
    // Try to load users from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem('founderdash_users');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error('Failed to load users from localStorage:', error);
      }
    };

    loadUsers();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('founderdash_users', JSON.stringify(users));
      } catch (error) {
        console.error('Failed to save users to localStorage:', error);
      }
    }
  }, [users, mounted]);

  // Handle outside click to close row menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close action menu if click is outside the dropdown
      if (
        openMenuId &&
        openMenuRef.current &&
        !openMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }

      // Close filter dropdown if click is outside the table header
      if (
        openFilterId &&
        tableHeaderRef.current &&
        !tableHeaderRef.current.contains(event.target as Node)
      ) {
        setOpenFilterId(null);
      }
    }

    if (openMenuId || openFilterId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId, openFilterId]);

  // Filter users by search term, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when search term changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Toggle menu open/closed for a user
  const handleMenuToggle = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  // View user action
  const handleViewUser = (userId: string) => {
    router.push('/dashboard/users/' + userId);
  };

  // Handle row click navigation
  const handleRowClick = (userId: string) => {
    router.push('/dashboard/users/' + userId);
  };

  // Edit role action
  const handleEditRole = (userId: string, userName: string) => {
    console.log(`Editing role for user: ${userId} (${userName})`);
  };

  // Disable user action
  const handleDisableUser = (userId: string, userName: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'Disabled' } : user
      )
    );
    console.log(`Disabled user: ${userId} (${userName})`);
  };

  // Handle add user form submission
  const handleAddUser = (formData: NewUserFormData) => {
    // Generate user ID (timestamp-based)
    const id = Date.now().toString();
    
    // Generate avatar initials
    const names = formData.name.split(' ');
    const avatar = names.map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // Create new user
    const newUser: User = {
      id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
      avatar,
    };

    // Add to users list
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    
    // Close modal
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage team members and their roles
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add user
        </button>
      </div>

      {/* Search Bar Only */}
      <div className="h-11 bg-card rounded-lg border border-border flex items-center focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-full px-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-none outline-none ring-0 shadow-none appearance-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Users Table */}
      <TableShell
        page={currentPage}
        pageSize={itemsPerPage}
        total={filteredUsers.length}
        onPageChange={setCurrentPage}
        emptyState={<p className="text-muted-foreground">No users found matching &ldquo;{searchTerm}&rdquo;</p>}
      >
        <table className="w-full">
          <thead ref={tableHeaderRef}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Email
              </th>
              <ColumnFilterHeader
                label="Role"
                filterId="role"
                options={['All', 'Founder', 'Admin', 'Viewer']}
                selectedValue={roleFilter}
                isOpen={openFilterId === 'role'}
                onToggle={setOpenFilterId}
                onSelect={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}
              />
              <ColumnFilterHeader
                label="Status"
                filterId="status"
                options={['All', 'Active', 'Disabled']}
                selectedValue={statusFilter}
                isOpen={openFilterId === 'status'}
                onToggle={setOpenFilterId}
                onSelect={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              />
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Created
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                openMenuId={openMenuId}
                onMenuToggle={handleMenuToggle}
                onViewUser={handleViewUser}
                onEditRole={handleEditRole}
                onDisableUser={handleDisableUser}
                onRowClick={handleRowClick}
                menuRef={openMenuRef}
              />
            ))}
          </tbody>
        </table>
      </TableShell>

      {/* Add User Modal */}
      {mounted && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New User"
        >
          <AddUserForm
            onSubmit={handleAddUser}
            onCancel={() => setIsModalOpen(false)}
            existingEmails={users.map((u) => u.email.toLowerCase())}
          />
        </Modal>
      )}
    </div>
  );
}
