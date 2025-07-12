// API Response Types
export interface APIResponse<T = any> {
  data?: T
  error?: {
    message: string
    code?: string
  }
  total?: number
  page?: number
  limit?: number
}

// User & Auth Types
export interface User {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_login: string | null
  two_factor_enabled: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Company/Tenant Types
export interface Company {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
  settings: CompanySettings
  storage_used: number
  storage_limit: number
  user_count: number
  subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled'
  monthly_revenue: number
}

export interface CompanySettings {
  use_hub_management: boolean
  timezone: string
  locale: string
  features: string[]
  [key: string]: any
}

export interface CompanyMember {
  id: string
  user_id: string
  company_id: string
  role: 'owner' | 'member'
  permissions: string[]
  joined_at: string
  user: User
  app_assignments: AppAssignment[]
  delegate_permissions: DelegatePermission[]
}

// Role Management Types
export interface AppAssignment {
  id: string
  user_id: string
  company_id: string
  app_id: string
  assigned_at: string
  assigned_by: string
  status: 'active' | 'suspended'
}

export interface DelegatePermission {
  id: string
  user_id: string
  company_id: string
  app_id: string
  granted_by: string
  granted_at: string
  permissions: AppDelegatePermissions
}

export interface AppDelegatePermissions {
  user_management: boolean
  app_configuration: boolean
  role_assignment: boolean
  [key: string]: boolean
}

// Extended User Types
export interface UserRole {
  company_id: string
  role: 'owner' | 'delegate' | 'admin_in_app' | 'member'
  app_specific_roles: Record<string, string> // app_id -> internal_role
  assigned_apps: string[] // app_ids user has access to
  delegate_of_apps: string[] // app_ids user is delegate of
}

// App Types
export interface App {
  id: string
  name: string
  slug: string
  description: string
  icon_url: string | null
  category: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  plans: AppPlan[]
}

export interface AppPlan {
  id: string
  app_id: string
  name: string
  price: number
  billing_interval: 'monthly' | 'yearly'
  features: string[]
  is_trial: boolean
  trial_days?: number
  created_at: string
}

export interface InstalledApp {
  id: string
  app_id: string
  company_id: string
  status: 'active' | 'inactive' | 'trial'
  installed_at: string
  last_used_at: string | null
  configuration: Record<string, any>
  app: App
}

// Subscription Types
export interface Subscription {
  id: string
  company_id: string
  app_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trial'
  current_period_start: string
  current_period_end: string
  trial_end: string | null
  created_at: string
  updated_at: string
  app: App
  plan: AppPlan
}

// Activity Types
export interface Activity {
  id: string
  user_id: string
  company_id: string
  type: string
  description: string
  metadata: Record<string, any>
  created_at: string
  user: User
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  company_id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  created_at: string
  metadata: Record<string, any>
}

// Dashboard Types
export interface DashboardStats {
  total_users: number
  active_apps: number
  storage_used: number
  storage_limit: number
  recent_activities: Activity[]
  quick_actions: QuickAction[]
  notifications: Notification[]
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: string
  url?: string
}

// Form Types
export interface LoginForm {
  identifier: string // email or phone
  password: string
}

export interface RegisterForm {
  email?: string
  phone?: string
  password: string
  full_name: string
  company_name?: string
}

export interface CompanyForm {
  name: string
  description?: string
  logo?: File
}

// File Types
export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  created_at: string
  updated_at: string
  company_id: string
  uploaded_by: string
}

// Storage Types
export interface StorageStats {
  used: number
  limit: number
  usage_by_app: Record<string, number>
  recent_files: FileItem[]
}