import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Check } from 'lucide-react';

const ACCOUNT_FACTS = [
  ['Saved items', 'Keep the products you want to come back to.'],
  ['Order history', 'View your orders and their details.'],
  ['Saved addresses', 'Manage your profile and saved addresses.'],
  ['Cash on delivery', 'Every order is paid in cash on delivery.'],
];

const PASSWORD_RULES = [
  ['length', '8+ characters'],
  ['uppercase', 'Uppercase letter'],
  ['lowercase', 'Lowercase letter'],
  ['number', 'Numeric digit'],
];

export function RegisterPage() {
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  const passwordValidation = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is missing. We require your name for orders and shipping. Please enter your first and last name.';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name is too short. Names must contain at least 2 characters. Please provide your complete name.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is missing. An email is required for account communication and order receipts. Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Email address format is invalid. It does not match the standard format. Please enter an email like user@example.com.';
    }

    if (!formData.password) {
      errors.password = 'Password is required. A security credential is required to protect your account. Please choose a password.';
    } else if (
      !passwordValidation.length ||
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number
    ) {
      errors.password = 'Password requirements are incomplete. Passwords must be at least 8 characters and include uppercase, lowercase, and numbers.';
    }

    if (!formData.confirm_password) {
      errors.confirm_password = 'Password confirmation is missing. Please re-enter your password to ensure they match.';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match. The values in both password fields must be identical. Please retype your confirmation password.';
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
      const response = await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
      });
      if (response.session?.access_token) {
        navigate('/', { replace: true });
      } else {
        setRegistrationMessage(response.message || 'Your account was created. Check your email for a confirmation link before signing in.');
      }
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:px-8 lg:py-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="text-section font-bold text-ink">Create your account</h1>
        <p className="mt-3 max-w-prose text-lead text-ink-2">
          Join Hoardly to explore products, build wishlists, and track orders.
        </p>
      </div>

      <div className="space-y-6 border-t border-ink pt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {authError && (
          <Alert variant="error" onDismiss={clearError}>
            {authError}
          </Alert>
        )}
        {registrationMessage && <Alert variant="success">{registrationMessage}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField
            id="register-name"
            label="Full name"
            required
            error={formErrors.full_name}
          >
            <Input
              name="full_name"
              type="text"
              placeholder="Alex Johnson"
              value={formData.full_name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
            />
          </FormField>

          <FormField
            id="register-email"
            label="Email address"
            required
            error={formErrors.email}
          >
            <Input
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </FormField>

          <FormField
            id="register-phone"
            label="Phone number (optional)"
            helperText="Used for order shipping updates."
            error={formErrors.phone}
          >
            <Input
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </FormField>

          <FormField
            id="register-password"
            label="Password"
            required
            error={formErrors.password}
          >
            <Input
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </FormField>

          <div className="text-sm">
            <p className="mb-2 font-semibold text-ink">Password criteria</p>
            <ul className="ruled grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
              {PASSWORD_RULES.map(([key, label]) => (
                <li key={key} className={`flex items-center gap-2 py-2 ${passwordValidation[key] ? 'text-ink' : 'text-muted'}`}>
                  <Check className={`h-4 w-4 shrink-0 ${passwordValidation[key] ? 'text-accent' : 'text-rule'}`} aria-hidden="true" />
                  {label}
                  <span className="sr-only">{passwordValidation[key] ? '(met)' : '(not met yet)'}</span>
                </li>
              ))}
            </ul>
          </div>

          <FormField
            id="register-confirm-password"
            label="Confirm password"
            required
            error={formErrors.confirm_password}
          >
            <Input
              name="confirm_password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full min-h-touch"
          >
            Create account
          </Button>
        </form>

        <p className="border-t border-rule pt-4 text-sm text-ink-2">
          Already registered?{' '}
          <Link to="/login" className="link text-ink">
            Sign in to account
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
