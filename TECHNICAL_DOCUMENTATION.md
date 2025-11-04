# VTM CRM - Technical Documentation

**Version:** 0.1.0  
**Last Updated:** October 18, 2025  
**Document Type:** Technical Architecture & Implementation Guide

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Modules](#core-modules)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Authentication & Authorization](#authentication--authorization)
9. [Firebase Integration](#firebase-integration)
10. [Development Setup](#development-setup)
11. [Build & Deployment](#build--deployment)
12. [Code Standards & Best Practices](#code-standards--best-practices)
13. [Security Considerations](#security-considerations)
14. [Performance Optimization](#performance-optimization)
15. [Troubleshooting Guide](#troubleshooting-guide)

---

## 1. Executive Summary

### 1.1 Project Overview

VTM CRM is an enterprise-grade Customer Relationship Management system built with modern web technologies. The application provides comprehensive solutions for:

- **Sales CRM**: Lead management, deals pipeline, task tracking, and customer interactions
- **Finance Management**: Quotations, invoices, payment tracking, and financial reporting
- **Team Collaboration**: Meetings, calls scheduling, and activity tracking
- **Analytics & Reporting**: Real-time insights, performance metrics, and business intelligence

### 1.2 Technical Highlights

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **State Management**: Zustand for efficient state handling
- **UI Framework**: Material-UI (MUI) + Tailwind CSS + shadcn/ui
- **Backend Integration**: RESTful API with Axios
- **Real-time Features**: Firebase Cloud Messaging
- **Data Visualization**: Recharts, Chart.js
- **Authentication**: JWT-based with refresh token mechanism

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend Application                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  Sales CRM │  │  Finance   │  │  Settings  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (https://vanurmedia.in/api/v1)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   CRM    │  │ Finance  │  │ Reports  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│                       MongoDB                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 External Services                            │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ Firebase (FCM)   │         │  Email Service   │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Architecture

```
src/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── sales-crm/       # CRM features
│   │   └── settings/        # Application settings
│   ├── (pages)/             # Public pages
│   ├── auth/                # Authentication pages
│   ├── manager/             # Manager role routes
│   └── user/                # User role routes
├── components/              # React components
│   ├── Common/              # Shared components
│   ├── sales-crm/           # CRM-specific components
│   └── ui/                  # UI library components
├── api/                     # API integration layer
├── stores/                  # Zustand state stores
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
└── firebase/                # Firebase configuration
```

### 2.3 Role-Based Architecture

The application supports three user roles with distinct routing:

1. **Admin**: Full access to all features
   - Route prefix: `/sales-crm/*`, `/finance/*`, `/settings/*`
   
2. **Manager**: Team management capabilities
   - Route prefix: `/manager/sales-crm/*`, `/manager/finance/*`
   
3. **User**: Limited access for team members
   - Route prefix: `/user/sales-crm/*`, `/user/finance/*`

---

## 3. Technology Stack

### 3.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 14.0.0 | React framework with SSR/SSG |
| Language | TypeScript | 5.x | Type-safe development |
| Runtime | Node.js | 20+ | JavaScript runtime |
| Package Manager | npm/yarn | Latest | Dependency management |

### 3.2 Frontend Libraries

#### UI Frameworks & Libraries
```json
{
  "@mui/material": "^7.1.2",           // Material-UI components
  "@mui/icons-material": "^7.1.0",     // Material icons
  "@radix-ui/react-*": "Latest",       // Accessible UI primitives
  "lucide-react": "^0.511.0",          // Icon library
  "tailwindcss": "^4",                 // Utility-first CSS
  "framer-motion": "^12.11.4"          // Animation library
}
```

#### State Management
```json
{
  "zustand": "^5.0.4"                  // Lightweight state management
}
```

#### Data Fetching & API
```json
{
  "axios": "^1.9.0",                   // HTTP client
  "js-cookie": "^3.0.5"                // Cookie management
}
```

#### Data Visualization
```json
{
  "recharts": "^3.1.2",                // Charting library
  "chart.js": "^4.4.9",                // Chart components
  "react-chartjs-2": "^5.3.0"          // React wrapper for Chart.js
}
```

#### Form & Data Handling
```json
{
  "react-quill": "^2.0.0",             // Rich text editor
  "@tiptap/react": "^2.26.1",          // Advanced text editor
  "react-day-picker": "^9.7.0",        // Date picker
  "date-fns": "^4.1.0",                // Date utilities
  "luxon": "^3.6.1"                    // DateTime handling
}
```

#### File Handling
```json
{
  "xlsx": "^0.18.5",                   // Excel file handling
  "json2csv": "^6.0.0-alpha.2"         // CSV export
}
```

#### UI Enhancements
```json
{
  "react-beautiful-dnd": "^13.1.1",    // Drag and drop
  "sonner": "^2.0.5",                  // Toast notifications
  "reactflow": "^11.11.4",             // Flow diagrams
  "react-countup": "^6.5.3",           // Animated counters
  "@lottiefiles/dotlottie-react": "^0.14.1" // Lottie animations
}
```

### 3.3 Firebase Services

```json
{
  "firebase": "^11.7.3",               // Firebase client SDK
  "firebase-admin": "^13.4.0"          // Firebase admin SDK
}
```

**Firebase Features Used:**
- **Cloud Messaging (FCM)**: Push notifications
- **Authentication**: Google Sign-In integration
- **Storage**: File uploads (if configured)

### 3.4 Development Tools

```json
{
  "eslint": "^8.45.0",                 // Code linting
  "eslint-config-next": "14.0.0",      // Next.js ESLint config
  "sass": "^1.89.2",                   // CSS preprocessor
  "typescript": "^5"                   // TypeScript compiler
}
```

---

## 4. Project Structure

### 4.1 Directory Overview

```
lead-management-fontend Deploy/
├── .next/                   # Next.js build output (generated)
├── public/                  # Static assets
│   ├── animations/          # Lottie animation files
│   ├── firebase-messaging-sw.js  # Service worker for FCM
│   └── CRM.csv              # Sample data
├── src/                     # Source code
│   ├── api/                 # API integration layer
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── config/              # Configuration files
│   ├── contexts/            # React contexts
│   ├── firebase/            # Firebase setup
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Library utilities
│   ├── stores/              # Zustand stores
│   └── utils/               # Utility functions
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── components.json         # shadcn/ui config
├── eslint.config.mjs       # ESLint configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project readme
```

### 4.2 API Layer Structure

```
src/api/
├── analyticsApi.ts         # Analytics endpoints
├── authApi.ts              # Authentication
├── callsApi.ts             # Call management
├── companyApi.ts           # Company operations
├── contactApi.ts           # Contact management
├── dashboardApi.ts         # Dashboard data
├── dealsApi.ts             # Deal pipeline
├── demoApi.ts              # Demo booking
├── emailApi.ts             # Email operations
├── leadsApi.ts             # Lead management
├── meetingsApi.ts          # Meeting scheduling
├── planApi.ts              # Subscription plans
├── profileApi.ts           # User profiles
├── reportsApi.ts           # Reporting
├── send-notification.ts    # Push notifications
├── sendEmailApi.ts         # Email sending
├── subscriptionApi.ts      # Subscription management
├── supportApi.ts           # Support tickets
├── taskApi.ts              # Task management
├── templateApi.ts          # Email templates
├── upgradePlan.ts          # Plan upgrades
└── userApi.ts              # User management
```

### 4.3 Store Structure

```
src/stores/salesCrmStore/
├── useAnalyticsStore.ts    # Analytics state
├── useAuthStore.ts         # Authentication state
├── useCallsStore.ts        # Calls state
├── useCompanyStore.ts      # Company state
├── useDashboardStore.ts    # Dashboard state
├── useDealsStore.ts        # Deals state
├── useLeadsStore.ts        # Leads state
├── useManagerProfileStore.ts  # Manager profiles
├── useMeetingsStore.ts     # Meetings state
├── useProfileStore.ts      # User profile state
├── useReportsStore.ts      # Reports state
├── useSelectedItemsStore.ts # Selection state
├── useSupportStore.ts      # Support state
├── useTasksStore.ts        # Tasks state
├── useTemplateStore.ts     # Templates state
├── useUpgradePlanStore.ts  # Plan upgrade state
├── useUserStore.ts         # User management state
├── useplanStore.ts         # Plan state
└── userecyclebinStore.ts   # Recycle bin state
```

### 4.4 Component Structure

```
src/components/
├── Common/                  # Shared components
│   ├── MainSidebar.tsx     # Desktop navigation
│   ├── MobileSidebar.tsx   # Mobile navigation
│   ├── Navbar.tsx          # Top navigation bar
│   └── PushNotificationProvider.tsx
├── sales-crm/              # CRM components
│   ├── ActivityDialog.tsx
│   ├── CallFormComponent.tsx
│   ├── LeadSummary.tsx
│   ├── MeetingFormComponent.tsx
│   ├── TaskFormComponent.tsx
│   ├── Table.tsx
│   └── [50+ specialized components]
└── ui/                     # UI library (shadcn/ui)
    ├── button.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    └── [other UI primitives]
```

---

## 5. Core Modules

### 5.1 Sales CRM Module

**Location:** `src/app/(dashboard)/sales-crm/`

#### Features:
- **Dashboard** (`/home`): Overview of sales activities, metrics, and KPIs
- **Leads** (`/leads`): Lead lifecycle management
  - Create, edit, delete leads
  - Lead assignment and ownership
  - Lead status tracking
  - Import/export functionality
- **Lead Chain** (`/lead-chain`): Sales funnel visualization and analytics
- **Tasks** (`/tasks`): Task management and tracking
- **Calls** (`/calls`): Call logging and scheduling
- **Meetings** (`/meetings`): Meeting scheduler with calendar integration
- **Reports** (`/reports`): Custom report generation
- **Analytics** (`/analytics`): Business intelligence dashboard
- **Support** (`/support`): Customer support ticket system

#### Key Components:
```typescript
// Lead Management
- LeadPage: Main leads listing
- CreateLeadPage: New lead form
- EditLeadPage: Lead editing
- DetailsPage: Lead details view
- LeadSummary: Quick lead overview
- AssignLeadsDialog: Bulk lead assignment

// Activity Tracking
- ActivityDialog: Activity creation
- CallFormComponent: Call logging
- MeetingFormComponent: Meeting creation
- TaskFormComponent: Task creation

// Data Display
- Table: Advanced data grid
- StatCard: Metric cards
- Pagination: List pagination
- SearchBar: Universal search
```

### 5.2 Finance Module

**Location:** `src/app/(dashboard)/finance/` (inferred from sidebar)

#### Sales Sub-Module:
- **Clients**: Customer database
- **Quotations**: Price quotations with PDF generation
- **Proforma Invoices**: Pre-invoicing
- **Invoices**: Invoice generation and management
- **Sales Orders**: Order processing
- **Payment Received**: Payment tracking
- **Delivery Challans**: Delivery notes
- **Credit Notes**: Credit management

#### Purchases Sub-Module:
- **Purchases & Expenses**: Expense tracking
- **Purchase Orders**: Procurement management
- **Payments Made**: Vendor payments
- **Vendors**: Supplier management
- **Debit Notes**: Debit tracking

#### Inventory Sub-Module:
- **Category**: Product categorization
- **Items**: Inventory management

#### Reports Sub-Module:
- **All Reports**: Comprehensive reporting
- **GSTR1**: GST sales reports
- **GSTR2**: GST purchase reports

### 5.3 Settings Module

**Location:** `src/app/(dashboard)/settings/`

#### Features:
- **Profile Management**: User profile settings
- **Email Configuration**: Email template setup
- **User Management**: Team member administration
- **Recycle Bin**: Soft-deleted items recovery

### 5.4 Authentication Module

**Location:** `src/app/auth/`

#### Pages:
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): New user registration
- **Forgot Password** (`/auth/forgot-password`): Password recovery

---

## 6. State Management

### 6.1 Zustand Store Architecture

VTM CRM uses Zustand for state management due to its simplicity and performance.

#### Store Pattern:
```typescript
// Example: useLeadsStore.ts
import { create } from 'zustand';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  // ... other fields
}

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
}

interface LeadsActions {
  fetchLeads: () => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  setSelectedLead: (lead: Lead | null) => void;
}

type LeadsStore = LeadsState & LeadsActions;

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  // Initial state
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,

  // Actions
  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchLeadsFromAPI();
      set({ leads: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  // ... other actions
}));
```

### 6.2 Authentication Store

**File:** `src/stores/salesCrmStore/useAuthStore.ts`

#### State:
```typescript
interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  company: Company | null;
  registeredUser: RegisteredUser | null;
  isRegistrationComplete: boolean;
  isCompanySetupComplete: boolean;
}
```

#### Key Actions:
- `loginUser(email, password, deviceToken)`: User login
- `googleLoginUser(firebaseToken, deviceToken, email)`: Google OAuth
- `logoutUser(fcmToken)`: User logout
- `refreshTokens()`: Token refresh
- `setTokens(accessToken, refreshToken)`: Token storage
- `clearAuth()`: Clear authentication state

### 6.3 Store Usage Example

```typescript
'use client';

import { useLeadsStore } from '@/stores/salesCrmStore/useLeadsStore';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';

export default function LeadsPage() {
  const { leads, fetchLeads, loading } = useLeadsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      {leads.map(lead => (
        <div key={lead._id}>{lead.name}</div>
      ))}
    </div>
  );
}
```

---

## 7. API Integration

### 7.1 Axios Instance Configuration

**File:** `src/utils/axios.ts`

#### Features:
- Base URL configuration
- Request/response interceptors
- Automatic token injection
- Token refresh mechanism
- Error handling

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://vanurmedia.in/api/v1',
  withCredentials: true,
});

// Request interceptor: Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshTokens();
        const newToken = useAuthStore.getState().token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 7.2 API Service Pattern

**Example:** `src/api/leadsApi.ts`

```typescript
import axiosInstance from '@/utils/axios';

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  assignedTo: string;
}

export const leadsApi = {
  // Get all leads
  getLeads: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await axiosInstance.get('/leads', { params });
    return response.data;
  },

  // Get single lead
  getLead: async (id: string) => {
    const response = await axiosInstance.get(`/leads/${id}`);
    return response.data;
  },

  // Create lead
  createLead: async (data: Lead) => {
    const response = await axiosInstance.post('/leads', data);
    return response.data;
  },

  // Update lead
  updateLead: async (id: string, data: Partial<Lead>) => {
    const response = await axiosInstance.put(`/leads/${id}`, data);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id: string) => {
    const response = await axiosInstance.delete(`/leads/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkAssign: async (leadIds: string[], userId: string) => {
    const response = await axiosInstance.post('/leads/bulk-assign', {
      leadIds,
      userId,
    });
    return response.data;
  },
};
```

### 7.3 Environment Configuration

**File:** `.env`

```properties
NEXT_PUBLIC_API_URL=https://vanurmedia.in/api/v1
```

**Usage:**
- `NEXT_PUBLIC_` prefix makes variable available in browser
- All API calls use this base URL
- Can be overridden for different environments

---

## 8. Authentication & Authorization

### 8.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    User Login Process                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Login Page      │
                    │  /auth/login     │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Email/Password   │        │  Google OAuth    │
    └──────────────────┘        └──────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌──────────────────┐
                    │  API: /auth/login│
                    └──────────────────┘
                              │
                              ▼
              ┌──────────────────────────────┐
              │  Return: accessToken &       │
              │  refreshToken + User Data    │
              └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Store in Zustand│
                    │  & Cookies       │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Redirect to     │
                    │  Dashboard       │
                    └──────────────────┘
```

### 8.2 Token Management

#### Access Token:
- **Storage**: Zustand store + HTTP-only cookie (recommended)
- **Lifetime**: Short-lived (e.g., 15 minutes)
- **Usage**: Sent with every API request via Authorization header

#### Refresh Token:
- **Storage**: HTTP-only cookie (secure)
- **Lifetime**: Long-lived (e.g., 7 days)
- **Usage**: Used to obtain new access token when expired

#### Token Refresh Flow:
```typescript
// Automatic refresh in axios interceptor
interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      await refreshTokens();
      // Retry original request
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 8.3 Role-Based Access Control (RBAC)

#### User Roles:
1. **Admin**: Full system access
2. **Manager**: Team management + limited admin functions
3. **User**: Basic CRM operations

#### Route Protection:
```typescript
// middleware.ts (Next.js middleware)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const pathname = request.nextUrl.pathname;

  // Public routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/(pages)')) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based routing
  const userRole = getUserRoleFromToken(token);
  
  if (pathname.startsWith('/settings') && userRole === 'user') {
    return NextResponse.redirect(new URL('/user/sales-crm/home', request.url));
  }

  return NextResponse.next();
}
```

#### Component-Level Protection:
```typescript
'use client';

import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProtectedComponent() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  // Role-based rendering
  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

### 8.4 Firebase Authentication

**Google Sign-In Integration:**

```typescript
// Firebase client setup
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIuH-1JYs7EX8Jd8mN1it4Tdo9XgbKPuo",
  authDomain: "lead-management-3c2d2.firebaseapp.com",
  projectId: "lead-management-3c2d2",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google login function
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  
  // Send token to backend for verification
  return idToken;
};
```

---

## 9. Firebase Integration

### 9.1 Firebase Cloud Messaging (FCM)

**Purpose:** Real-time push notifications for:
- New lead assignments
- Task reminders
- Meeting notifications
- System alerts

#### Configuration:

**File:** `src/firebase/client.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDIuH-1JYs7EX8Jd8mN1it4Tdo9XgbKPuo",
  authDomain: "lead-management-3c2d2.firebaseapp.com",
  projectId: "lead-management-3c2d2",
  storageBucket: "lead-management-3c2d2.firebasestorage.app",
  messagingSenderId: "7369187211",
  appId: "1:7369187211:web:5abc501a4be09aecd6998e",
  measurementId: "G-VX3EZES3V4"
};

const app = initializeApp(firebaseConfig);

export async function getFirebaseMessaging() {
  if (typeof window === 'undefined') return null;
  
  const supported = await isSupported();
  if (!supported) return null;
  
  return getMessaging(app);
}
```

#### Service Worker:

**File:** `public/firebase-messaging-sw.js`

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDIuH-1JYs7EX8Jd8mN1it4Tdo9XgbKPuo",
  authDomain: "lead-management-3c2d2.firebaseapp.com",
  projectId: "lead-management-3c2d2",
  storageBucket: "lead-management-3c2d2.firebasestorage.app",
  messagingSenderId: "7369187211",
  appId: "1:7369187211:web:5abc501a4be09aecd6998e"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

#### Push Notification Hook:

**File:** `src/hooks/usePushNotifications.ts`

```typescript
import { useEffect, useState } from 'react';
import { getFirebaseMessaging } from '@/firebase/client';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = "BOtXfQEhd_V-1mMvgl99KHhxdRwtZ6nVIf2-PUTSlaj5O7z_rYkKuSd5bcyVJEwPEvWcyGnu4mUs-zAkn9nb9vU";

export default function usePushNotifications() {
  const [fcmToken, setFcmToken] = useState<string>("");

  const generateFCMToken = async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return null;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return null;

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        setFcmToken(token);
        
        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log('Message received:', payload);
          // Show notification or update UI
        });

        return token;
      }
    } catch (error) {
      console.error('FCM Token Error:', error);
    }
    return null;
  };

  useEffect(() => {
    generateFCMToken();
  }, []);

  return { fcmToken };
}
```

### 9.2 Notification Provider

**File:** `src/components/Common/PushNotificationProvider.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import usePushNotifications from '@/hooks/usePushNotifications';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';

export default function PushNotificationProvider() {
  const { fcmToken } = usePushNotifications();
  const { user } = useAuthStore();

  useEffect(() => {
    if (fcmToken && user) {
      // Register FCM token with backend
      registerDeviceToken(fcmToken);
    }
  }, [fcmToken, user]);

  return null; // This component doesn't render anything
}

async function registerDeviceToken(token: string) {
  try {
    await fetch('/api/register-device', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to register device:', error);
  }
}
```

---

## 10. Development Setup

### 10.1 Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: Version control
- **Code Editor**: VS Code (recommended)

### 10.2 Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd lead-management-fontend\ Deploy

# 2. Install dependencies
npm install
# or
yarn install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Run development server
npm run dev
# or
yarn dev

# 5. Open browser
# Navigate to http://localhost:3000
```

### 10.3 Environment Variables

Create `.env` file:

```properties
# API Configuration
NEXT_PUBLIC_API_URL=https://vanurmedia.in/api/v1

# Firebase Configuration (already in code, but can be overridden)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# FCM VAPID Key
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

### 10.4 Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build for production
    "start": "next start",       // Start production server
    "lint": "next lint"          // Run ESLint
  }
}
```

### 10.5 VS Code Setup

**Recommended Extensions:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**Settings (.vscode/settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 11. Build & Deployment

### 11.1 Production Build

```bash
# Build the application
npm run build

# This creates an optimized production build in .next/
```

**Build Output:**
```
.next/
├── cache/              # Build cache
├── server/             # Server-side code
│   ├── app/           # App router pages
│   └── pages/         # API routes
└── static/            # Static assets
    ├── chunks/        # JavaScript chunks
    ├── css/          # CSS files
    └── media/        # Images and fonts
```

### 11.2 Deployment Options

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration (vercel.json):**
```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

#### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and Run:**
```bash
# Build Docker image
docker build -t vtm-crm:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://vanurmedia.in/api/v1 \
  vtm-crm:latest
```

#### Option 3: Traditional Server (PM2)

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "vtm-crm" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### 11.3 Environment-Specific Builds

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1 npm run dev

# Staging
NEXT_PUBLIC_API_URL=https://staging.vanurmedia.in/api/v1 npm run build

# Production
NEXT_PUBLIC_API_URL=https://vanurmedia.in/api/v1 npm run build
```

### 11.4 Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow
- [ ] Check API connectivity
- [ ] Verify Firebase Cloud Messaging
- [ ] Test role-based access
- [ ] Run smoke tests on critical features
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## 12. Code Standards & Best Practices

### 12.1 TypeScript Guidelines

```typescript
// ✅ DO: Use interfaces for object types
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ DO: Use type for unions and intersections
type Status = 'pending' | 'active' | 'closed';

// ✅ DO: Avoid 'any' type
// ❌ DON'T
function processData(data: any) { }

// ✅ DO
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Handle string
  }
}

// ✅ DO: Use strict null checks
const user: User | null = getUser();
if (user) {
  console.log(user.name);
}
```

### 12.2 React Component Patterns

```typescript
// ✅ DO: Use functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-${variant}`}
    >
      {label}
    </button>
  );
}

// ✅ DO: Use proper hooks
export function useLeadData(leadId: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead(leadId).then(setLead).finally(() => setLoading(false));
  }, [leadId]);

  return { lead, loading };
}

// ✅ DO: Memoize expensive computations
const filteredLeads = useMemo(() => {
  return leads.filter(lead => lead.status === 'active');
}, [leads]);

// ✅ DO: Use useCallback for event handlers
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

### 12.3 File Naming Conventions

```
components/
├── UserProfile.tsx          # PascalCase for components
├── useUserData.ts           # camelCase with 'use' prefix for hooks
├── userApi.ts               # camelCase for utilities
└── types.ts                 # lowercase for type files

pages/
├── index.tsx               # lowercase for Next.js pages
├── [id].tsx                # Dynamic routes
└── _app.tsx                # Special Next.js files
```

### 12.4 Code Organization

```typescript
// ✅ DO: Group imports logically
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal components
import Button from '@/components/ui/button';
import Modal from '@/components/Common/Modal';

// 3. Utilities and helpers
import { formatDate } from '@/utils/date';
import { validateEmail } from '@/utils/validation';

// 4. Types
import type { User } from '@/types';

// 5. Styles
import styles from './Component.module.css';

// ✅ DO: Use barrel exports
// components/index.ts
export { default as Button } from './Button';
export { default as Modal } from './Modal';
export { default as Input } from './Input';

// ✅ DO: Destructure props
function Component({ title, subtitle, onClose }: Props) {
  // Implementation
}
```

### 12.5 Error Handling

```typescript
// ✅ DO: Handle errors gracefully
async function fetchData() {
  try {
    const response = await api.getData();
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.message);
      showNotification('Failed to fetch data', 'error');
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// ✅ DO: Use error boundaries for React errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 13. Security Considerations

### 13.1 Authentication Security

```typescript
// ✅ DO: Store tokens securely
// Use HTTP-only cookies for refresh tokens
document.cookie = `refreshToken=${token}; HttpOnly; Secure; SameSite=Strict`;

// Use memory/state for access tokens
useAuthStore.setState({ token: accessToken });

// ❌ DON'T: Store sensitive data in localStorage
// localStorage.setItem('token', token); // Vulnerable to XSS
```

### 13.2 API Security

```typescript
// ✅ DO: Validate and sanitize user input
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// ✅ DO: Implement rate limiting on client side
const rateLimiter = new Map();

function checkRateLimit(action: string): boolean {
  const now = Date.now();
  const lastCall = rateLimiter.get(action);
  
  if (lastCall && now - lastCall < 1000) {
    return false; // Too many requests
  }
  
  rateLimiter.set(action, now);
  return true;
}
```

### 13.3 XSS Prevention

```typescript
// ✅ DO: Escape user content
import { escapeHtml } from '@/utils/security';

function DisplayUserContent({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: escapeHtml(content) }} />;
}

// ✅ DO: Use Content Security Policy
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  }
];
```

### 13.4 CSRF Protection

```typescript
// ✅ DO: Include CSRF token in forms
function FormComponent() {
  const [csrfToken] = useState(() => generateCSRFToken());
  
  return (
    <form>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {/* Other form fields */}
    </form>
  );
}
```

### 13.5 Dependency Security

```bash
# Regularly audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update

# Check for outdated packages
npm outdated
```

---

## 14. Performance Optimization

### 14.1 Code Splitting

```typescript
// ✅ DO: Use dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Disable SSR if not needed
});

// ✅ DO: Split vendor bundles
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    };
    return config;
  }
};
```

### 14.2 Image Optimization

```typescript
// ✅ DO: Use Next.js Image component
import Image from 'next/image';

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={50}
      height={50}
      loading="lazy"
      placeholder="blur"
    />
  );
}
```

### 14.3 Memoization

```typescript
// ✅ DO: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// ✅ DO: Memoize components
const MemoizedComponent = React.memo(function Component({ data }: Props) {
  return <div>{data}</div>;
});

// ✅ DO: Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### 14.4 Bundle Size Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Configure in next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});

# Run analysis
ANALYZE=true npm run build
```

### 14.5 Caching Strategies

```typescript
// ✅ DO: Cache API responses
const cache = new Map();

async function fetchWithCache(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const data = await fetch(url).then(r => r.json());
  cache.set(url, data);
  return data;
}

// ✅ DO: Use SWR for data fetching
import useSWR from 'swr';

function useLeads() {
  const { data, error, mutate } = useSWR('/api/leads', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  
  return { leads: data, error, refresh: mutate };
}
```

---

## 15. Troubleshooting Guide

### 15.1 Common Issues

#### Issue: Build Failures

**Symptom:**
```
Error: Cannot find module '@/components/...'
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

#### Issue: Authentication Loops

**Symptom:** Redirects between login and dashboard repeatedly

**Solution:**
```typescript
// Check token validity before redirecting
const token = useAuthStore.getState().token;
const isValid = await validateToken(token);

if (!isValid) {
  await refreshTokens();
}
```

#### Issue: Firebase Messaging Not Working

**Symptom:** Push notifications not received

**Solution:**
1. Check browser permissions
2. Verify service worker registration
3. Confirm VAPID key is correct
4. Check Firebase console for errors

```bash
# Debug service worker
# Open browser console and check:
navigator.serviceWorker.getRegistrations()
```

#### Issue: API CORS Errors

**Symptom:**
```
Access to fetch at 'https://vanurmedia.in/api/v1/...' has been blocked by CORS policy
```

**Solution:**
- Backend must include proper CORS headers
- Use proxy in development:

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://vanurmedia.in/api/v1/:path*'
      }
    ];
  }
};
```

### 15.2 Performance Issues

#### Slow Page Loads

**Diagnosis:**
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

**Solutions:**
- Enable code splitting
- Optimize images
- Remove unused dependencies
- Use dynamic imports

#### Memory Leaks

**Diagnosis:**
```typescript
// Add cleanup in useEffect
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);
```

### 15.3 Debugging Tools

```typescript
// Enable debug logs in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}

// Use React DevTools
// Install: https://react.dev/learn/react-developer-tools

// Use Redux DevTools for Zustand
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools((set) => ({
    // Store logic
  }))
);
```

### 15.4 Logging & Monitoring

```typescript
// Implement error logging
function logError(error: Error, context?: any) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('Context:', context);
  
  // Send to monitoring service
  // sendToSentry(error, context);
}

// Track performance
const startTime = performance.now();
await heavyOperation();
const duration = performance.now() - startTime;
console.log(`Operation took ${duration}ms`);
```

---

## Appendix

### A. Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter

# Dependencies
npm install             # Install all dependencies
npm update              # Update dependencies
npm audit               # Security audit
npm audit fix           # Fix vulnerabilities

# Debugging
npm run dev -- --inspect   # Enable Node.js debugger
npm run build -- --debug   # Debug build process

# Cleaning
rm -rf .next            # Remove build cache
rm -rf node_modules     # Remove dependencies
npm cache clean --force # Clear npm cache
```

### B. Important URLs

- **Development**: http://localhost:3000
- **Production API**: https://vanurmedia.in/api/v1
- **Firebase Console**: https://console.firebase.google.com
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

### C. Key File Locations

```
Configuration:
├── .env                          # Environment variables
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint rules
└── tailwind.config.js            # Tailwind CSS config

Firebase:
├── src/firebase/client.ts        # Firebase client setup
├── public/firebase-messaging-sw.js  # Service worker

API Integration:
├── src/utils/axios.ts            # Axios configuration
└── src/api/                      # API services

State Management:
└── src/stores/salesCrmStore/     # Zustand stores

Authentication:
└── src/stores/salesCrmStore/useAuthStore.ts
```

---

**Document End**

For questions or support, please contact the development team.

*Last Updated: October 18, 2025*
