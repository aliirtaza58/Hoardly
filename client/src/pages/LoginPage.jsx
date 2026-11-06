import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';

const ACCOUNT_FACTS = [
  ['Saved items', 'Keep the products you want to come back to.'],
  ['Order history', 'View your orders and their details.'],
  ['Saved addresses', 'Manage your profile and saved addresses.'],
  ['Cash on delivery', 'Every order is paid in cash on delivery.'],
];

function safeRedirectPath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return '/';
  }
  return path;
}

export function LoginPage() {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = safeRedirectPath(location.state?.from?.pathname);

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Enter your email address or username to identify your account.';
    } else if (formData.email.trim().toLowerCase() !== 'admin' && !(import.meta.env.DEV && formData.email.trim().toLowerCase() === (import.meta.env.VITE_LOCAL_ADMIN_USERNAME || 'admin')) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address or username.';
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
      const response = await login(formData.email.trim(), formData.password);
      navigate(location.state?.from ? redirectPath : response.user.profile?.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      // Error is set in AuthContext and displayed in the alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:px-8 lg:py-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="text-section font-bold text-ink">Sign in</h1>
        <p className="mt-3 max-w-prose text-lead text-ink-2">
          Enter your credentials below to access your account and orders.
        </p>
      </div>

      <div className="space-y-6 border-t border-ink pt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {authError && (
          <Alert variant="error" onDismiss={clearError}>
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField
            id="login-email"
            label="Email or username"
            required
            error={formErrors.email}
          >
            <Input
              name="email"
              type="text"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
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

          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="link inline-flex min-h-touch items-center text-ink">
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full min-h-touch"
          >
            Sign in to account
          </Button>
        </form>

        <p className="border-t border-rule pt-4 text-sm text-ink-2">
          Do not have an account?{' '}
          <Link to="/register" className="link text-ink">
            Create account
          </Link>
        </p>
      </div>

      <ul className="ruled lg:col-start-1 lg:row-start-2 lg:self-start">
        {ACCOUNT_FACTS.map(([title, text]) => (
          <li key={title} className="py-3">
            <p className="font-semibold text-ink">{title}</p>
            <p className="text-sm text-ink-2">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
