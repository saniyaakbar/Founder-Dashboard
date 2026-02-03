import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  isDarkTheme?: boolean;
}

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  isDarkTheme = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={isDarkTheme ? { color: '#cbd5f5' } : {}}>
        {label}
      </label>

      {/* Select Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors flex items-center justify-between"
        style={isDarkTheme ? {
          backgroundColor: '#0b1220',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        } : {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          color: '#1f2937',
          border: '1px solid #e2e8f0',
        }}
        id={id}
        type="button"
        onFocus={(e) => {
          if (isDarkTheme) {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)';
          }
        }}
        onBlur={(e) => {
          if (isDarkTheme) {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          }
        }}
      >
        <span>{selectedLabel}</span>
        <span
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ⌄
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="overflow-hidden z-50"
            style={isDarkTheme ? {
              background: 'linear-gradient(135deg, #0b1220, #0f1b33)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              boxShadow: '0 16px 30px rgba(0, 0, 0, 0.6)',
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            } : {
              backgroundColor: '#ffffff',
              borderColor: '#e2e8f0',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full text-left text-sm transition-colors border-0"
                style={isDarkTheme ? {
                  padding: '10px 14px',
                  backgroundColor: value === option.value ? '#2563eb' : 'transparent',
                  color: value === option.value ? '#ffffff' : '#e5e7eb',
                  fontWeight: value === option.value ? 500 : 400,
                } : {
                  padding: '10px 14px',
                  backgroundColor: value === option.value ? '#3b82f6' : '#ffffff',
                  color: value === option.value ? '#ffffff' : '#1f2937',
                  fontWeight: value === option.value ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value && isDarkTheme) {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  } else if (value !== option.value && !isDarkTheme) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = isDarkTheme ? 'transparent' : '#ffffff';
                    e.currentTarget.style.color = isDarkTheme ? '#e5e7eb' : '#1f2937';
                  }
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
