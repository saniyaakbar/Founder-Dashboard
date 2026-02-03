'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import TableShell from '@/components/table/TableShell';
import Modal from '@/components/Modal';
import AddProductForm, { NewProductFormData } from '@/components/AddProductForm';

// Types
interface Product {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Paused';
  lastUpdated: string;
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dashboard Analytics',
    plan: 'Pro',
    status: 'Active',
    lastUpdated: '2024-06-10',
  },
  {
    id: '2',
    name: 'API Client',
    plan: 'Enterprise',
    status: 'Active',
    lastUpdated: '2024-06-08',
  },
  {
    id: '3',
    name: 'Mobile App',
    plan: 'Pro',
    status: 'Paused',
    lastUpdated: '2024-06-05',
  },
  {
    id: '4',
    name: 'Billing Module',
    plan: 'Free',
    status: 'Active',
    lastUpdated: '2024-06-03',
  },
  {
    id: '5',
    name: 'Documentation Portal',
    plan: 'Free',
    status: 'Active',
    lastUpdated: '2024-06-01',
  },
  {
    id: '6',
    name: 'Admin Console',
    plan: 'Enterprise',
    status: 'Active',
    lastUpdated: '2024-05-28',
  },
  {
    id: '7',
    name: 'Data Export',
    plan: 'Pro',
    status: 'Active',
    lastUpdated: '2024-05-25',
  },
  {
    id: '8',
    name: 'Webhooks',
    plan: 'Enterprise',
    status: 'Paused',
    lastUpdated: '2024-05-22',
  },
  {
    id: '9',
    name: 'Search Engine',
    plan: 'Pro',
    status: 'Active',
    lastUpdated: '2024-05-20',
  },
  {
    id: '10',
    name: 'Integrations Hub',
    plan: 'Enterprise',
    status: 'Active',
    lastUpdated: '2024-05-18',
  },
];

// Status Badge Component
function StatusBadge({ status }: { status: 'Active' | 'Paused' }) {
  const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Paused: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
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

// Plan Badge Component
function PlanBadge({ plan }: { plan: 'Free' | 'Pro' | 'Enterprise' }) {
  const planStyles = {
    Free: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    Pro: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    Enterprise: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${planStyles[plan]}`}>
      {plan}
    </span>
  );
}

// Actions Dropdown Component
function ActionsMenu({
  productId,
  productName,
  openMenuId,
  onMenuToggle,
  onViewProduct,
  onEditProduct,
  onViewHistory,
  menuRef,
}: {
  productId: string;
  productName: string;
  openMenuId: string | null;
  onMenuToggle: (id: string) => void;
  onViewProduct: (id: string, name: string) => void;
  onEditProduct: (id: string, name: string) => void;
  onViewHistory: (id: string, name: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isOpen = openMenuId === productId;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(productId);
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
            onClick={() => {
              onViewProduct(productId, productName);
              onMenuToggle(productId);
            }}
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
            View product
          </button>
          <button
            onClick={() => {
              onEditProduct(productId, productName);
              onMenuToggle(productId);
            }}
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
            Edit product
          </button>
          <button
            onClick={() => {
              onViewHistory(productId, productName);
              onMenuToggle(productId);
            }}
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
            View version history
          </button>
        </div>
      )}
    </div>
  );
}

// Table Row Component
function ProductRow({
  product,
  openMenuId,
  onMenuToggle,
  onViewProduct,
  onEditProduct,
  onViewHistory,
  onStatusToggle,
  onRowClick,
  menuRef,
}: {
  product: Product;
  openMenuId: string | null;
  onMenuToggle: (id: string) => void;
  onViewProduct: (id: string, name: string) => void;
  onEditProduct: (id: string, name: string) => void;
  onViewHistory: (id: string, name: string) => void;
  onStatusToggle: (id: string) => void;
  onRowClick: (productId: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <tr
      onClick={() => onRowClick(product.id)}
      className="border-b border-border hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
    >
      <td className="px-6 py-3">
        <p className="text-sm font-medium text-foreground">{product.name}</p>
      </td>
      <td className="px-6 py-3">
        <PlanBadge plan={product.plan} />
      </td>
      <td className="px-6 py-3">
        <button
          onClick={() => onStatusToggle(product.id)}
          className="inline-block"
        >
          <StatusBadge status={product.status} />
        </button>
      </td>
      <td className="px-6 py-3">
        <p className="text-sm text-muted-foreground">{product.lastUpdated}</p>
      </td>
      <td className="px-6 py-3 text-center" onClick={(e) => e.stopPropagation()}>
        <ActionsMenu
          productId={product.id}
          productName={product.name}
          openMenuId={openMenuId}
          onMenuToggle={onMenuToggle}
          onViewProduct={onViewProduct}
          onEditProduct={onEditProduct}
          onViewHistory={onViewHistory}
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
  onToggle: (id: string | null) => void;
  onSelect: (value: string) => void;
}) {
  const thRef = useRef<HTMLTableCellElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

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

// Main Products Page Component
export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);
  const openMenuRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 5;

  // Load products from localStorage on mount
  useEffect(() => {
    const initializeProducts = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedProducts = localStorage.getItem('founderdash_products');
          if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            setProducts(parsed);
          } else {
            localStorage.setItem('founderdash_products', JSON.stringify(mockProducts));
          }
        } catch (error) {
          console.error('Error loading products from localStorage:', error);
        }
        setMounted(true);
      }
    };

    if (!mounted) {
      initializeProducts();
    }
  }, [mounted]);

  // Auto-save products to localStorage when they change
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('founderdash_products', JSON.stringify(products));
      } catch (error) {
        console.error('Error saving products to localStorage:', error);
      }
    }
  }, [products, mounted]);

  // Handle outside click to close row menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuId &&
        openMenuRef.current &&
        !openMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }

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

  // Filter products by search term, plan, and status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPlan = planFilter === 'All' || product.plan === planFilter;

      const matchesStatus =
        statusFilter === 'All' || product.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [searchTerm, planFilter, statusFilter, products]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when search term changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Toggle menu open/closed for a product
  const handleMenuToggle = (productId: string) => {
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  // View product action
  const handleViewProduct = (productId: string) => {
    router.push('/dashboard/products/' + productId);
  };

  // Handle row click navigation
  const handleRowClick = (productId: string) => {
    router.push('/dashboard/products/' + productId);
  };

  // Edit product action
  const handleEditProduct = (productId: string, productName: string) => {
    console.log(`Editing product: ${productId} (${productName})`);
  };

  // View version history action
  const handleViewHistory = (productId: string, productName: string) => {
    console.log(`Viewing history for: ${productId} (${productName})`);
  };

  // Toggle product status
  const handleStatusToggle = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: product.status === 'Active' ? 'Paused' : 'Active',
            }
          : product
      )
    );
  };

  // Handle add product form submission
  const handleAddProduct = (formData: NewProductFormData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      plan: formData.plan,
      status: formData.status,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your products and features
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add product
        </button>
      </div>

      {/* Search Bar */}
      <div className="h-11 bg-card rounded-lg border border-border flex items-center focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-full px-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-none outline-none ring-0 shadow-none appearance-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Products Table */}
      <TableShell
        page={currentPage}
        pageSize={itemsPerPage}
        total={filteredProducts.length}
        onPageChange={setCurrentPage}
        emptyState={<p className="text-muted-foreground">No products found</p>}
      >
        <table className="w-full">
          <thead ref={tableHeaderRef}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Product Name
              </th>
              <ColumnFilterHeader
                label="Plan"
                filterId="plan"
                options={['All', 'Free', 'Pro', 'Enterprise']}
                selectedValue={planFilter}
                isOpen={openFilterId === 'plan'}
                onToggle={setOpenFilterId}
                onSelect={(value) => {
                  setPlanFilter(value);
                  setCurrentPage(1);
                }}
              />
              <ColumnFilterHeader
                label="Status"
                filterId="status"
                options={['All', 'Active', 'Paused']}
                selectedValue={statusFilter}
                isOpen={openFilterId === 'status'}
                onToggle={setOpenFilterId}
                onSelect={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              />
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Last Updated
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                openMenuId={openMenuId}
                onMenuToggle={handleMenuToggle}
                onViewProduct={handleViewProduct}
                onEditProduct={handleEditProduct}
                onViewHistory={handleViewHistory}
                onStatusToggle={handleStatusToggle}
                onRowClick={handleRowClick}
                menuRef={openMenuRef}
              />
            ))}
          </tbody>
        </table>
      </TableShell>

      {/* Add Product Modal */}
      {mounted && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Product"
        >
          <AddProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
