# 🛡️ Forvara Hub

The central command center for the Forvara ecosystem - manage all your business applications, billing, and team communications in one unified platform.

![Forvara Hub](https://img.shields.io/badge/status-early_development-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## 🚀 Overview

Forvara Hub is the central launcher and management platform for all Forvara business applications. Think of it as your business command center where you can:

- 📊 Access all your Forvara apps (Elaris ERP, Analytics, etc.)
- 💳 Manage billing and subscriptions in one place
- 📧 Use integrated mail system for team communication
- 📈 Monitor usage and analytics across all apps
- 🔐 Control security and access for your team

## 🏗️ Architecture

```
ForvaraHub (This repo) - Frontend
├── Dashboard & App Launcher
├── Billing Management UI
├── Mail Client
├── Settings & Security
└── Connects to → ForvaraCore API

ForvaraCore (Separate repo) - Backend
├── Authentication & Users
├── Multi-tenant Management
├── Subscription Logic
├── API Gateway for Apps
└── Database (Supabase)
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Styling**: Tailwind CSS v4 (using Vite plugin)
- **Build Tool**: Vite 6
- **State Management**: Zustand (planned)
- **Icons**: Lucide React
- **Backend**: ForvaraCore API (Node.js/Express)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- ForvaraCore backend running (for full functionality)

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ForvaraHub.git
cd ForvaraHub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

- `VITE_API_URL`: ForvaraCore API endpoint
- `VITE_SUPABASE_URL`: Supabase project URL (optional for now)
- `VITE_ENABLE_*`: Feature flags for gradual rollout

### Theme Customization

The app uses CSS custom properties for theming:

```css
/* Dark theme (default) */
--primary: #4B0082;      /* Deep Purple */
--secondary: #6A4C93;    /* Plum Slate */
--accent: #CBAACB;       /* Lavender Mist */
--background: #0D0D0D;   /* Midnight Black */
--surface: #1C1C1C;      /* Dark Graphite */
--text: #F8F8FF;         /* Ghost White */
```

## 🎯 Current Status

### ✅ Completed
- Basic project setup with Vite + React + TypeScript
- Tailwind CSS v4 configuration
- Theme system structure
- Header component with logo
- Sidebar navigation component
- Basic dashboard view

### 🚧 In Progress
- Billing management view
- Integration with ForvaraCore API
- Authentication flow

### 📅 Planned
- Mail client (Discord-style internal communication)
- Apps marketplace view
- Activity monitoring (Steam Guard-style security)
- File sharing between apps
- Advanced analytics dashboard

## 🤝 Contributing

This project is currently in early development. Contribution guidelines will be added as the project matures.

## 📄 License

Proprietary - © 2025 ForvaraSoft. All rights reserved.

## 🔗 Related Projects

- [ForvaraCore](https://github.com/yourusername/ForvaraCore) - Backend API
- [Elaris ERP](https://github.com/yourusername/ElarisERP) - Business Management App

## 💡 Philosophy

Forvara believes in:
- 🎯 **Fair Pricing**: No artificial limits or user caps
- 🚀 **Modern UX**: Business software that doesn't feel like 1995
- 🔧 **Ecosystem Approach**: Integrated apps that work together
- 💪 **Empowering SMBs**: Enterprise features at SMB prices

---

**Note**: This project is in active development. Features and APIs may change.
