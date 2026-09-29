import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// Public client (respects RLS — used for user-facing operations)
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);

// Service-role client (bypasses RLS — used for admin operations only)
export const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey
);
