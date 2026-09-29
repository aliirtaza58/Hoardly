import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function HomePage() {
  const { user, profile, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative rounded-2xl bg-surface-card border border-line p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xs">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-content-primary leading-tight">
            Curated goods engineered for everyday life.
          </h1>

          <p className="text-lg text-content-secondary leading-relaxed">
            Welcome to Hoardly. Experience precision craftsmanship, seamless ordering, and dependable delivery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/products">
                  <Button variant="primary" size="lg">
                    Browse catalog
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Create account
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign in to account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Status Card */}
      {isAuthenticated && (
        <section className="bg-surface-card border border-line rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-content-primary">
                Authenticated User Profile
              </h2>
              <p className="text-sm text-content-secondary">
                Your session is verified and connected to the backend authentication system.
              </p>
            </div>
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/15 text-brand">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Administrator privileges active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-md bg-surface-muted border border-line/60">
              <span className="text-xs text-content-muted block">Account Email</span>
              <span className="text-sm font-semibold text-content-primary">{user?.email}</span>
            </div>
            <div className="p-4 rounded-md bg-surface-muted border border-line/60">
              <span className="text-xs text-content-muted block">Full Name</span>
              <span className="text-sm font-semibold text-content-primary">
                {profile?.full_name || 'Not provided'}
              </span>
            </div>
            <div className="p-4 rounded-md bg-surface-muted border border-line/60">
              <span className="text-xs text-content-muted block">Account Role</span>
              <span className="text-sm font-semibold text-content-primary capitalize">
                {profile?.role || 'Customer'}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
