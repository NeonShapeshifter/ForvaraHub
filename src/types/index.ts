// =====================================================
// CORE USER & COMPANY TYPES (matching backend)
// =====================================================

export interface User {
  id: string;

  // Core identity
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;

  // Panama specific
  cedula_panama?: string;
  tax_id_type: 'cedula' | 'passport' | 'ruc';

  // Auth
  email_verified: boolean;
  phone_verified: boolean;
  auth_method: 'email' | 'phone' | 'both';

  // Localization
  preferred_language: 'es' | 'en' | 'sv' | 'pt';
  timezone: string;
  currency_code: string;
  country_code: string;

  // Profile
  avatar_url?: string;
  settings: Record<string, any>;

  // Tracking
  last_login_at?: string;
  last_ip_address?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;

  // Core company info
  razon_social: string;
  ruc: string;
  address?: string;
  phone?: string;
  contact_email?: string;

  // Localization
  country_code: string;
  currency_code: string;
  timezone: string;

  // Business settings
  industry_type?: string;
  company_size?: 'micro' | 'pequena' | 'mediana' | 'grande';

  // Forvara specific
  slug: string;
  description?: string;
  logo_url?: string;
  slots_limit: number;
  storage_limit_gb: number;
  storage_used_bytes: number;

  // User context
  user_role?: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at?: string;
  storage_used?: number; // MB
  storage_limit?: number; // MB

  // Billing
  billing_email?: string;
  billing_address?: string;
  tax_exempt: boolean;

  // Status
  status: 'active' | 'suspended' | 'inactive' | 'trial';
  trial_ends_at?: string;

  // Ownership
  owner_id: string;
  created_by?: string;

  // Metadata
  settings: Record<string, any>;
  onboarding_completed: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// =====================================================
// AUTH & API TYPES
// =====================================================

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  password: string;
  cedula_panama?: string;
  preferred_language?: 'es' | 'en' | 'sv' | 'pt';
  country_code?: string;
  timezone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  companies: Company[];
  session_id?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
  total?: number;
  page?: number;
  limit?: number;
  meta?: Record<string, any>;
}

// =====================================================
// DASHBOARD & ANALYTICS TYPES
// =====================================================

export interface DashboardStats {
  active_users: number;
  installed_apps: number;
  storage_used_gb: number;
  storage_limit_gb: number;
  api_calls_month: number;
  team_members: number;
  mode: 'individual' | 'company';
}

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  entity_type: string;
  entity_id: string;
  ip_address?: string;
  created_at: string;
  user?: User;
  company?: Company;
}

export interface UserSession {
  id: string;
  session_id: string;
  user_id: string;
  company_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country_code?: string;
  city?: string;
  started_at: string;
  last_activity_at: string;
  is_active: boolean;
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

export interface Notification {
  id: string;
  user_id: string;
  company_id?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  title: string;
  message?: string;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

// =====================================================
// TRIAL & BILLING TYPES
// =====================================================

export interface TrialStatus {
  company_id: string;
  status: 'active' | 'expired' | 'converted';
  days_remaining: number;
  trial_ends_at: string;
  features_used: string[];
  conversion_likelihood: 'low' | 'medium' | 'high';
}

// =====================================================
// FORM TYPES
// =====================================================

export interface CreateCompanyRequest {
  razon_social: string;
  ruc: string;
  address?: string;
  phone?: string;
  contact_email?: string;
  industry_type?: string;
  company_size?: 'micro' | 'pequena' | 'mediana' | 'grande';
  billing_email?: string;
  billing_address?: string;
}
