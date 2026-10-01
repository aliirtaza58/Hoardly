import 'dotenv/config';

export const config = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  resendApiKey: process.env.RESEND_API_KEY,
  orderConfirmationFrom: process.env.ORDER_CONFIRMATION_FROM,
};
