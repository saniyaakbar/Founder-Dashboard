import { ReactNode } from 'react';

interface TableShellProps {
  children: ReactNode;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  emptyState?: ReactNode;
}

export default function TableShell({
  children,
  page,
  pageSize,
  total,
  onPageChange,
  emptyState,
}: TableShellProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  // Show empty state if total is 0
  if (total === 0 && emptyState) {
    return (
      <div className="card p-12 text-center">
        <p className="text-card-foreground">{emptyState}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overflow-x-auto overflow-y-visible">
        {children}
      </div>

      {total > 0 && (
        <div className="px-6 py-3">
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {total > 0 ? startIndex + 1 : 0}–{endIndex} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-border rounded text-sm font-medium text-foreground hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-border rounded text-sm font-medium text-foreground hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
