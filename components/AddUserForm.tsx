import { useState } from 'react';
import SelectField from './SelectField';

export interface NewUserFormData {
  name: string;
  email: string;
  role: 'Founder' | 'Admin' | 'Viewer';
  status: 'Active' | 'Disabled';
}

interface AddUserFormProps {
  onSubmit: (data: NewUserFormData) => void;
  onCancel: () => void;
  existingEmails: string[];
}

export default function AddUserForm({
  onSubmit,
  onCancel,
  existingEmails,
}: AddUserFormProps) {
  const [formData, setFormData] = useState<NewUserFormData>({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    } else if (existingEmails.includes(formData.email.toLowerCase())) {
      newErrors.email = 'Email already in use';
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

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    !errors.email &&
    !errors.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5f5' }}>
          Full Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., John Doe"
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

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1.5"
          style={{ color: '#cbd5f5' }}
        >
          Email Address <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., john@example.com"
          className="w-full px-4 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none"
          style={{
            backgroundColor: '#0b1220',
            borderColor: errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.12)';
          }}
        />
        <style>{`
          input[style*="background-color: rgb(11, 18, 32)"]::placeholder {
            color: rgba(255, 255, 255, 0.45);
          }
        `}</style>
        {errors.email && (
          <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Role Field */}
      <SelectField
        id="role"
        label="Role"
        value={formData.role}
        onChange={(value) =>
          handleChange({
            target: { name: 'role', value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
        options={[
          { value: 'Viewer', label: 'Viewer' },
          { value: 'Admin', label: 'Admin' },
          { value: 'Founder', label: 'Founder' },
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
          { value: 'Disabled', label: 'Disabled' },
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
          Create User
        </button>
      </div>
    </form>
  );
}
