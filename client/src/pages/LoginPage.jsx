import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { ShoppingBag } from 'lucide-react';

export function LoginPage() {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is missing. An email is required to identify your account. Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Email address format is invalid. It does not match standard mailbox format. Please enter a valid address like user@example.com.';
    }

    if (!formData.password) {
      errors.password = 'Password is required. A security credential is required to authenticate. Please enter your password.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Error is set in AuthContext and displayed in the alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-surface-card p-8 rounded-xl border border-line shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-lg bg-brand text-content-on-action items-center justify-center shadow-xs">
            <ShoppingBag className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary">
            Sign in to account
          </h1>
          <p className="text-sm text-content-secondary">
            Enter your credentials below to access your account and orders.
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <Alert variant="error" onDismiss={clearError}>
            {authError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField
            id="login-email"
            label="Email address"
            required
            error={formErrors.email}
          >
            <Input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
          </FormField>

          <FormField
            id="login-password"
            label="Password"
            required
            error={formErrors.password}
          >
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </FormField>

          <div className="flex items-center justify-end text-xs">
            <Link
              to="/forgot-password"
              className="text-content-link hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Sign in to account
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-content-secondary border-t border-line pt-4">
          Do not have an account?{' '}
          <Link
            to="/register"
            className="text-content-link hover:underline font-semibold"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
