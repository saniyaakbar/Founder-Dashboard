import { useState } from 'react';
import SelectField from './SelectField';

export interface NewProductFormData {
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Paused';
}

interface AddProductFormProps {
  onSubmit: (data: NewProductFormData) => void;
  onCancel: () => void;
}

export default function AddProductForm({
  onSubmit,
  onCancel,
}: AddProductFormProps) {
  const [formData, setFormData] = useState<NewProductFormData>({
    name: '',
    plan: 'Free',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.name.trim().length > 0 && !errors.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5f5' }}>
          Product Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Dashboard Analytics"
          className="w-full px-4 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none"
          style={{
            backgroundColor: '#0b1220',
            borderColor: errors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = errors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.12)';
          }}
          autoFocus
        />
        <style>{`
          input[style*="background-color: rgb(11, 18, 32)"]::placeholder {
            color: rgba(255, 255, 255, 0.45);
          }
        `}</style>
        {errors.name && (
          <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Plan Field */}
      <SelectField
        id="plan"
        label="Plan"
        value={formData.plan}
        onChange={(value) =>
          handleChange({
            target: { name: 'plan', value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
        options={[
          { value: 'Free', label: 'Free' },
          { value: 'Pro', label: 'Pro' },
          { value: 'Enterprise', label: 'Enterprise' },
        ]}
        isDarkTheme
      />

      {/* Status Field */}
      <SelectField
        id="status"
        label="Status"
        value={formData.status}
        onChange={(value) =>
          handleChange({
            target: { name: 'status', value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
        options={[
          { value: 'Active', label: 'Active' },
          { value: 'Paused', label: 'Paused' },
        ]}
        isDarkTheme
      />

      {/* Footer Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5f5',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
          style={{
            background: isFormValid
              ? 'linear-gradient(90deg, #3b82f6, #9333ea)'
              : 'linear-gradient(90deg, #3b82f6, #9333ea)',
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
          }}
        >
          Create Product
        </button>
      </div>
    </form>
  );
}
