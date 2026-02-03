'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Type definition for product data
type ProductData = {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Paused';
  createdAt: string;
  lastUpdated: string;
  description: string;
  version: string;
  features: string[];
};

// Mock product data (in production, fetch from API)
const mockProductData: Record<string, ProductData> = {
  '1': {
    id: '1',
    name: 'Dashboard Analytics',
    plan: 'Pro',
    status: 'Active',
    createdAt: '2024-01-20',
    lastUpdated: '2024-06-10',
    description: 'Comprehensive analytics dashboard for real-time data visualization and insights.',
    version: '2.3.1',
    features: ['Real-time charts', 'Custom dashboards', 'Data export', 'API access'],
  },
  '2': {
    id: '2',
    name: 'API Client',
    plan: 'Enterprise',
    status: 'Active',
    createdAt: '2024-02-15',
    lastUpdated: '2024-06-08',
    description: 'Enterprise-grade REST API client with advanced authentication and rate limiting.',
    version: '3.1.0',
    features: ['OAuth 2.0 support', 'Rate limiting', 'Webhook support', 'API versioning'],
  },
  '3': {
    id: '3',
    name: 'Mobile App',
    plan: 'Pro',
    status: 'Paused',
    createdAt: '2024-03-10',
    lastUpdated: '2024-06-05',
    description: 'Cross-platform mobile application for iOS and Android with offline support.',
    version: '1.8.2',
    features: ['iOS support', 'Android support', 'Offline mode', 'Push notifications'],
  },
};

// Status Badge Component
function StatusBadge({ status }: { status: 'Active' | 'Paused' }) {
  const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Paused: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}>
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

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductData | null>(null);

  // Get product data (simulating async fetch)
  useEffect(() => {
    const fetchProduct = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const productData = mockProductData[productId];
        setProduct(productData || null);
        setLoading(false);
      }, 100);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="card p-12 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleEditProduct = () => {
    console.log('Edit product:', productId);
  };

  const handleToggleStatus = () => {
    console.log('Toggle status for product:', productId);
  };

  const handleDeleteProduct = () => {
    console.log('Delete product:', productId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <PlanBadge plan={product.plan} />
              <StatusBadge status={product.status} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleEditProduct}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
            >
              Edit Product
            </button>
            <button
              onClick={handleToggleStatus}
              className="px-4 py-2 border border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-500/20 transition-colors"
            >
              {product.status === 'Active' ? 'Pause Product' : 'Activate Product'}
            </button>
            <button
              onClick={handleDeleteProduct}
              className="px-4 py-2 border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-colors"
            >
              Delete
            </button>
            <Link
              href="/dashboard/products"
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
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Product ID</p>
            <p className="text-sm font-medium text-foreground">{product.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Plan</p>
            <p className="text-sm font-medium text-foreground">{product.plan}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm font-medium text-foreground">{product.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Version</p>
            <p className="text-sm font-medium text-foreground">{product.version}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created Date</p>
            <p className="text-sm font-medium text-foreground">{product.createdAt}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Updated</p>
            <p className="text-sm font-medium text-foreground">{product.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Features Card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background/50"
            >
              <span className="text-lg">✓</span>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Product Access</p>
                <p className="text-xs text-muted-foreground mt-1">Manage who can access this product</p>
              </div>
              <button className="px-3 py-1.5 border border-border rounded text-xs font-medium text-foreground hover:bg-background transition-colors">
                Configure
              </button>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Webhooks</p>
                <p className="text-xs text-muted-foreground mt-1">Receive real-time updates about product changes</p>
              </div>
              <button className="px-3 py-1.5 border border-border rounded text-xs font-medium text-foreground hover:bg-background transition-colors">
                Setup
              </button>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Integrations</p>
                <p className="text-xs text-muted-foreground mt-1">Connect with third-party services</p>
              </div>
              <button className="px-3 py-1.5 border border-border rounded text-xs font-medium text-foreground hover:bg-background transition-colors">
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
