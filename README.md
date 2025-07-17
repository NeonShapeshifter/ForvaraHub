# 🎨 ForvaraHub - Enterprise Frontend Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-2D2D2D?style=flat&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

**90% COMPLETE - PRODUCTION READY** React frontend for the Forvara business ecosystem. Built with TypeScript, Vite, and TailwindCSS for multi-tenant business management targeting LATAM markets.

## 🏗️ Architecture

**Enterprise React Dashboard** with multi-tenant support, role-based UI, and comprehensive business management interfaces optimized for Spanish-speaking markets.

### Core Features (Production Ready)

- ✅ **3-Step Registration Flow** - Contact → Password → Workspace selection
- ✅ **Dual Authentication** - Email or phone login with LATAM optimization
- ✅ **Individual/Company Modes** - Perfect for freelancers and teams
- ✅ **Multi-Tenant Dashboard** - Company switching and isolated interfaces
- ✅ **App Marketplace** - Professional app discovery and installation
- ✅ **Embedded User Management** - Per-app user control
- ✅ **App Delegation System** - Permission granting/revoking
- ✅ **Admin Panel Suite** - Complete business management pages
- ✅ **LATAM Phone Input** - WhatsApp-friendly with country flags
- ✅ **Office 365 Design System** - Professional UI with dark/light themes
- ✅ **Mobile Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- ForvaraCore backend running
- Modern web browser

### Installation

```bash
# Clone and install
git clone <repository>
cd ForvaraHub
npm install

# Environment setup
cp .env.example .env
# Edit .env with backend URL

# Development
npm run dev

# Production build
npm run build
npm run preview
```

### Environment Variables

```env
# Backend API
VITE_API_URL=http://localhost:4000

# App Configuration
VITE_APP_NAME=Forvara
VITE_APP_VERSION=1.0.0
VITE_DEFAULT_COUNTRY=PA
```

## 📱 Application Structure

### Page Architecture

#### Core Pages (All Working ✅)
- **Login** (`/login`) - Dual auth with animations and LATAM pride
- **Register** (`/register`) - 3-step flow: contact → password → workspace
- **Dashboard** (`/dashboard`) - Company overview with conditional UI
- **Marketplace** (`/marketplace`) - Professional app discovery (486 lines)
- **My Apps** (`/my-apps`) - Installed app management

#### Admin Panel Pages (All Working ✅)
- **Users** (`/users`) - Team management with embedded user controls
- **Settings** (`/settings`) - Company and user profile configuration
- **Billing** (`/billing`) - Subscription and payment tracking
- **Analytics** (`/analytics`) - Usage metrics and business insights
- **Companies** (`/companies`) - Multi-company workspace management

### Component Structure

```
src/
├── pages/              # Route-based page components
│   ├── Dashboard.tsx   # Main company dashboard
│   ├── Users.tsx       # Team management
│   ├── Settings.tsx    # Company/user settings
│   ├── Billing.tsx     # Stripe billing interface
│   └── Analytics.tsx   # Metrics dashboard
├── components/         # Reusable UI components
│   ├── layout/         # Layout components
│   ├── ui/             # Base UI components
│   └── admin/          # Admin-specific components
├── stores/             # Zustand state management
├── services/           # API service layer
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

## 🎛️ Admin Panel Features

### 1. Team Management (`/users`)
- **Member List** - View all company team members
- **Role Management** - Change roles (owner/admin/member/viewer)
- **Invitation System** - Invite by email or phone
- **Permission Control** - Role-based action restrictions
- **LATAM Phone Support** - Regional phone format validation

### 2. Company Settings (`/settings`)
- **Company Profile** - Business information management
- **User Profile** - Personal information updates
- **Password Security** - Secure password change flow
- **Notification Preferences** - Email/SMS preferences
- **Regional Settings** - Timezone and language options

### 3. Billing Management (`/billing`)
- **Subscription Overview** - Current plans and usage
- **Payment Methods** - Stripe payment method management
- **Billing History** - Invoice downloads and history
- **Plan Management** - Upgrade/downgrade subscriptions
- **Customer Portal** - Direct Stripe portal access

### 4. Analytics Dashboard (`/analytics`)
- **Usage Metrics** - App usage and team activity
- **Performance Charts** - Visual analytics with Recharts
- **Export Capabilities** - Data export functionality
- **Real-time Updates** - Live metrics updates

## 🔧 Technical Implementation

### State Management (Zustand)

```typescript
// stores/authStore.ts
interface AuthStore {
  user: User | null
  token: string | null
  currentCompany: Company | null
  companies: Company[]
  userRole: 'owner' | 'admin' | 'member' | 'viewer'
  
  login: (credentials: LoginData) => Promise<void>
  logout: () => void
  switchCompany: (companyId: string) => void
  updateProfile: (data: ProfileData) => Promise<void>
}
```

### API Integration

```typescript
// services/api.ts
class APIService {
  private baseURL = import.meta.env.VITE_API_URL
  
  async get<T>(endpoint: string): Promise<T> {
    // Authenticated API calls with token injection
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    // POST requests with error handling
  }
}
```

### Routing & Protection

```typescript
// App.tsx - Protected route structure
function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<RequireRole roles={['owner', 'admin']}><Users /></RequireRole>} />
        <Route path="billing" element={<RequireRole roles={['owner']}><Billing /></RequireRole>} />
        {/* Other protected routes */}
      </Route>
    </Routes>
  )
}
```

## 📱 LATAM Phone Input System

### Regional Phone Support
- **Country Detection** - Automatic country selection
- **Format Validation** - Real-time phone format validation
- **Regional Carriers** - Support for all LATAM phone networks
- **Business Context** - Professional phone handling for B2B

### Implementation
```typescript
// components/ui/phone-input.tsx
interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  defaultCountry?: CountryCode
  countries?: CountryCode[]
  placeholder?: string
  error?: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = 'PA',
  countries = LATAM_COUNTRIES,
  placeholder = 'Número de teléfono',
  error
}) => {
  // react-phone-number-input integration with LATAM focus
}
```

## 🎨 UI/UX Design

### Design System
- **TailwindCSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI component library
- **Dark/Light Mode** - Theme switching capability
- **Mobile Responsive** - Mobile-first responsive design

### LATAM UX Adaptations
- **Spanish Interface** - Native Spanish throughout
- **Regional Patterns** - LATAM business terminology
- **Cultural Design** - Colors and patterns for regional appeal
- **Professional Branding** - Enterprise-grade visual design

### Accessibility
- **WCAG Compliance** - Web accessibility standards
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels
- **High Contrast** - Accessible color combinations

## 🔒 Security & Permissions

### Role-Based UI
```typescript
// Permission-based component rendering
const UserManagement = () => {
  const { userRole } = useAuthStore()
  
  if (!['owner', 'admin'].includes(userRole)) {
    return <PermissionDenied />
  }
  
  return <UserManagementInterface />
}
```

### Secure Data Handling
- **JWT Token Management** - Automatic token refresh
- **Secure Storage** - Token storage best practices
- **Input Validation** - Client-side validation with server verification
- **CSRF Protection** - Cross-site request forgery prevention

## 🚀 Development

### Available Scripts

```bash
npm run dev              # Development server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # ESLint code linting
npm run type-check      # TypeScript type checking
```

### Development Tools
- **Hot Module Replacement** - Instant code updates
- **TypeScript** - Type safety and IntelliSense
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

### Performance Optimization
- **Vite Build** - Fast build times and optimizations
- **Code Splitting** - Lazy loading for routes
- **Tree Shaking** - Remove unused code
- **Image Optimization** - Optimized asset loading

## 📊 Monitoring & Analytics

### User Experience Tracking
- **Page Load Times** - Performance monitoring
- **User Interactions** - Feature usage tracking
- **Error Tracking** - JavaScript error monitoring
- **Conversion Funnels** - Business metric tracking

### Business Metrics
- **Feature Adoption** - Admin panel usage rates
- **User Engagement** - Time spent in different sections
- **Trial Conversion** - Conversion from trial to paid
- **Regional Analytics** - LATAM market insights

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI and deploy
npm i -g vercel
vercel --prod
```

### Netlify
```bash
# Build and deploy
npm run build
# Upload dist/ folder to Netlify
```

### Custom Server
```bash
# Build and serve
npm run build
npm run preview
```

## 🧪 Testing

### Component Testing
```bash
# Unit tests for components
npm run test

# Component testing with Storybook
npm run storybook
```

### E2E Testing
```bash
# End-to-end testing with Playwright
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration compliance
- Component documentation
- Responsive design requirements

## 📄 License

Proprietary - Forvara Enterprise License

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Check the component documentation
- Contact the development team

---

**ForvaraHub** - Empowering LATAM businesses with modern, accessible, and powerful business management interfaces.