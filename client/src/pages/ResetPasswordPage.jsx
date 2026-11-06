import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Check } from 'lucide-react';

const RESET_STEPS = [
  ['Enter your email', 'Use the address on your account.'],
  ['Open the reset link', 'We send it to that address.'],
  ['Choose a new password', 'Then sign in with your new password.'],
];

const PASSWORD_RULES = [
  ['length', '8+ characters'],
  ['uppercase', 'Uppercase letter'],
  ['lowercase', 'Lowercase letter'],
  ['number', 'Numeric digit'],
];

export function ResetPasswordPage() {
  const { resetPassword, logout, isAuthenticated, isLoading, error: authError, clearError } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Password is required. Please choose a new password.';
    } else if (
      !passwordValidation.length ||
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number
    ) {
      errors.password = 'Password does not meet requirements. It must have 8+ characters, uppercase, lowercase, and numbers.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required. Please repeat the new password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please verify that both entries are identical.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await resetPassword(password);
      await logout();
      setIsSuccess(true);
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:px-8 lg:py-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="text-section font-bold text-ink">Set new password</h1>
        <p className="mt-3 max-w-prose text-lead text-ink-2">
          Create a strong new password for your account.
        </p>
      </div>

      <div className="space-y-6 border-t border-ink pt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {authError && (
          <Alert variant="error" onDismiss={clearError}>
            {authError}
          </Alert>
        )}

        {isSuccess ? (
          <div className="space-y-4">
            <Alert variant="success" title="Password updated">
              Your password has been updated. Sign in with your new password.
            </Alert>
            <Link
              to="/login"
              className="inline-flex min-h-touch w-full items-center justify-center rounded-control border border-ink bg-ink px-6 py-3 text-base font-semibold text-paper no-underline transition-colors hover:bg-ink-2"
            >
              Proceed to sign in
            </Link>
          </div>
        ) : !isLoading && !isAuthenticated ? (
          <div className="space-y-4">
            <Alert variant="warning">This reset link is missing or expired. Request a new link to update your password.</Alert>
            <Link to="/forgot-password" className="link inline-flex min-h-touch items-center text-sm text-ink">Request reset link</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="new-password"
              label="New password"
              required
              error={formErrors.password}
            >
              <Input
                name="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors((p) => ({ ...p, password: null }));
                  if (authError) clearError();
                }}
                autoFocus
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
              id="confirm-new-password"
              label="Confirm new password"
              required
              error={formErrors.confirmPassword}
            >
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formErrors.confirmPassword) setFormErrors((p) => ({ ...p, confirmPassword: null }));
                }}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isLoading || !isAuthenticated}
              className="w-full min-h-touch"
            >
              Update password
            </Button>
          </form>
        )}
      </div>

      <ol className="ruled lg:col-start-1 lg:row-start-2 lg:self-start">
        {RESET_STEPS.map(([title, text]) => (
          <li key={title} className="py-3">
            <p className="font-semibold text-ink">{title}</p>
            <p className="text-sm text-ink-2">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
