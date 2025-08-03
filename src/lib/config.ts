/**
 * Application Configuration
 * All environment variables and app settings
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'GOMFLOW',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
  },
  
  upload: {
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '5242880'), // 5MB
    allowedTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },
}

// Environment validation
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Development helpers
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'