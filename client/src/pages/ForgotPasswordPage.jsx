import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';

const RESET_STEPS = [
  ['Enter your email', 'Use the address on your account.'],
  ['Open the reset link', 'We send it to that address.'],
  ['Choose a new password', 'Then sign in with your new password.'],
];

export function ForgotPasswordPage() {
  const { forgotPassword, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Email address is missing. Please provide the email address associated with your account.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Email address format is invalid. Please enter a valid address such as user@example.com.');
      return;
    }

    setIsSubmitting(true);
    setEmailError(null);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMessage(res.message || 'Password reset link has been dispatched to your email.');
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:px-8 lg:py-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="text-section font-bold text-ink">Reset account password</h1>
        <p className="mt-3 max-w-prose text-lead text-ink-2">
          Enter your email and we will send you a link to choose a new password.
        </p>
      </div>

      <div className="space-y-6 border-t border-ink pt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {authError && (
          <Alert variant="error" onDismiss={clearError}>
            {authError}
          </Alert>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <Alert variant="success" title="Check your inbox">
              {successMessage}
            </Alert>
            <Link to="/login" className="link inline-flex min-h-touch items-center text-sm text-ink">
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="reset-email"
              label="Email address"
              required
              error={emailError}
            >
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                  if (authError) clearError();
                }}
                autoComplete="email"
                autoFocus
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full min-h-touch"
            >
              Send reset link
            </Button>

            <p className="border-t border-rule pt-4 text-sm">
              <Link to="/login" className="link inline-flex min-h-touch items-center text-ink">
                Back to sign in
              </Link>
            </p>
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
