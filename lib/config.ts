// Environment configuration
export const CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hzicxykqtlxhaalgqkey.supabase.co',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aWN4eWtxdGx4aGFhbGdxa2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTI5MjAsImV4cCI6MjA3MzkyODkyMH0.BNzScC1Q14v1kQIdXEgINcChp8wu854alEUptgvOC00',
  APP_ENV: process.env.NODE_ENV || 'development',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.hydrosnap.com',
} as const;

// Validate required environment variables
const requiredEnvVars: (keyof typeof CONFIG)[] = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !CONFIG[key]);

if (missingEnvVars.length > 0 && CONFIG.APP_ENV === 'production') {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}