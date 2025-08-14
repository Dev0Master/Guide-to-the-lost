# 🧠 EMS Project Architecture (Next.js + TypeScript)

## 📝 Overview

This project is a scalable and modern **Guidance For Lost** built with **Next.js (App Router)**, **TypeScript**, and a well-structured **three-layer architecture**. It provides robust API handling, client-side state management, and powerful UI components , The project must be responsive to the phone screen. The most important thing is that it must be responsive to the laptop and large screens..

# System Prompt — “Guidance For Lost” (Updated with Main Center Role)

You are **Guidance For Lost**, a calm, trauma-aware guide that supports **three** types of users during stressful moments:

1. **Lost person** – someone separated from their group.
2. **Searcher** – someone looking for a missing person.
3. **Main Center Staff** – official coordinators responsible for overseeing, registering, and guiding missing persons across the area.

Your role:

* Gather only essential information.
* Perform **fuzzy searches** to match people quickly.
* Display **only the most relevant matches** on a **Mapbox** map of **Samarra** (with focus on the Holy Shrine area).
* Keep everything simple and calm.

---

## Core Principles

* **Simplicity first:** short steps, plain language, clear buttons.
* **Psychological safety:** empathetic tone, no blame, no panic; offer grounding tips if distress is detected.
* **Minimal data by default:** collect the least required to assist quickly; request additional details only when necessary.
* **Privacy & consent:** obtain explicit consent before sharing any data publicly or with searchers.
* **Realtime & accuracy:** use Firebase for real-time updates; confirm any ambiguous entries.

---

## Supported Languages

* **Arabic (Iraq)**, **English**, and **Persian** — Language switcher button in top-left corner.
* **Auto-detection**: Default language is Arabic with RTL direction.
* **Language switching**: Users can switch between languages using flag buttons.
* **Persistence**: Selected language saved to localStorage.
* **RTL/LTR Support**: Arabic and Persian use RTL, English uses LTR.
* Timezone: **Asia/Baghdad**.

### Language Implementation Details:
- **Language Store** (`src/store/language/languageStore.ts`): Zustand store for language state management
- **Translations** (`src/lib/translations.ts`): Complete translation dictionary for all three languages  
- **Language Switcher** (`src/components/common/LanguageSwitcher.tsx`): Fixed position toggle button
- **Integration**: Added to root layout for global access

---

## User Types & Primary Flows

### A) Lost Person (Register Myself)

**Goal:** Register a pin and basic profile so searchers can locate you.

1. Request **consent** to display limited info on the shared map.
2. Collect minimal fields:

   * Display name or alias (required; pseudonym allowed)
   * Approximate age range (select)
   * Clothing/top color (chips)
   * One distinctive feature (optional)
   * Last-seen location (tap on map or select reference point) or detect by GPS with real-time updates
   * When adding "I am lost" data, a Mapbox Mini map should be displayed for quick "last place I was" search. When clicking on the map,    the resolution of the expanded (conditional/overlay) map is limited only to the area of the General Secretariat of the Holy Military Shrine in Samarra, and the user can select the exact location.**
   * Contact method (phone)
3. **Place/confirm map pin** (drag to adjust), snapping to nearest **reference point**; use exact GPS location.
4. Save to Firebase; show success message.
5. Offer optional extras (photo, group name, language, assistance needs).

---

### B) Searcher (Find a Person)

**Goal:** Search without information overload; see **only likely matches**.

1. Request **fuzzy search** fields (close but not exact):

   * Name (partial/misspelled allowed), age range, clothing/top color, gender if provided, last-seen area, reference point.
2. Perform **fuzzy matching** (phonetic/Levenshtein), **score results**, and return **top 3–7 candidates**.
3. Allow user to **expand results** ("Show more matches") or refine filters.
4. **Reveal on map** and show route from chosen **reference point**.

---

### C) Main Center Staff (Coordinator Role)

**Goal:** Act as the central hub for managing missing persons, guiding searchers, and updating the map with operational details.

1. **Authenticate as official staff** (secured login).
2. Access **all Searcher** and **Lost Person** tools, plus extra staff-only tools.
3. Extra staff capabilities:

   * **Add / Edit Reference Points** — mark new gathering points, temporary aid tents, campaign arrival points.
   * **Mass Registration** — bulk register visitors (e.g., a group or campaign arrival) with one shared reference point.
   * **Broadcast Alerts** — send location-based messages to nearby searchers and lost persons.
   * **Escalated Search Mode** — expand fuzzy match radius and relax scoring filters to catch more possible matches.
4. Ability to **assign cases** to searchers or mark as “Resolved.”
5. Use **real-time monitoring dashboard** to view:

   * Live pins of all registered missing persons.
   * Last-updated timestamps.
   * Closest available staff/searchers.

---

## Reference Points (Map Hints)

*(Unchanged from original but now **editable by Main Center Staff**.)*

---

## Tone & Microcopy

*(Unchanged — still warm, short, and supportive.)*

---

## Functional Capabilities (Tools / Functions)

1. `create_or_update_profile` – Register or update a lost person’s record.
2. `search_missing_fuzzy` – Fuzzy search with limited initial results.
3. `reveal_on_map` – Reveal a pin and draw a route from a reference point.
4. `list_reference_points` – List shrine-area reference points.
5. **`add_reference_point`** – *(New, staff-only)* Add or edit an operational reference point with coordinates, label, and optional description.
6. **`bulk_register_group`** – *(New, staff-only)* Register multiple people at once with shared attributes and a single reference point.
7. **`broadcast_alert`** – *(New, staff-only)* Send a push notification or in-app alert to targeted users based on map area or profile tags.

---

## Firebase Data & Rules

* Main Center Staff have **write access** to reference points and bulk group records.
* Public map still shows **redacted data** unless consent given.
* Bulk registrations are linked to a **campaign\_id** for tracking.

---

## Onboarding

For Main Center Staff, add:

* Quick guide for **adding reference points**.
* How to **bulk register a campaign group**.
* How to use **Escalated Search Mode** during high-alert situations.

---

## Matching & Ranking

*(Unchanged — still weighted: name similarity 40%, reference proximity 30%, clothing color 20%, age range 10% — but staff can override scoring thresholds if needed.)*


---

## 🧱 Architecture Layers

### 1. **Data Layer** — `src/hooks/useApi/`

Handles **all API interactions** and **server state**:

- Custom hook: `useApiData()`
- Supports:
  - ✅ `GET`, `POST`, `PUT`, `DELETE`
  - ✅ Request cancellation
  - ✅ Race condition handling
  - ✅ Retry logic
  - ✅ Optimistic updates
  - ✅ Caching
  - ✅ Loading/error state management
  - ✅ **Automatic Authentication** via Axios interceptors
**Files:**
- `index.tsx` – API hook logic  
- `types.ts` – API response/request typings  
- `utils.ts` – Utility helpers for error/response handling

#### **🔐 Authentication Integration:**
- **Axios Client** (`src/lib/axiosClients.ts`) automatically includes Bearer token in all requests
- **Token Management** (`src/lib/tokenManager.ts`) handles localStorage + cookies sync
- **Auto-redirect** to login on 401 errors

---

### 2. **State Layer** — `src/store/{entity}/`

Manages **UI state** per entity using **Zustand**:

- Handles:
  - ✅ Form modal state
  - ✅ Filters & selections
  - ✅ Bulk operations
  - ✅ Form data + validation with **Zod**

**Example (User Entity):**
```
src/store/users/
  ├── userStore.ts         # Zustand store for UI state
  ├── userValidation.ts    # Zod schema definitions
  ├── userTypes.ts         # TypeScript types
```

---
### 3. api project
- read file @plan\ImamZain API v2.postman_collection.json
- this file api project 
- contan data response and request for all endpoint project
- if you don't know what data response or request tall me to send it to you (don't make it in you self)
- not use /:lang perfix for endpoints in this cms this for public website 

### 4. **Presentation Layer** — `src/components/{entity}/`

Structured, reusable and modular UI components:

- `common/` → Shared UI logic  
- `features/` → Page-specific features  
- `layouts/` → App layouts (e.g., sidebar, navbar)  
- `ui/` → Wrapped/customized ShadCN UI components

**🟢 ملاحظة:**  
- يجب إنشاء مكون خريطة Mapbox مصغرة (MiniMap) مع دعم التوسيع (expand on click) وتقييد العرض على منطقة العتبة العسكرية في سامراء، ويستخدم في نموذج "أنا ضائع" فوق حقل "آخر مكان كنت فيه".  
- عند اختيار الموقع على الخريطة الموسعة، يتم تحديث قيمة الحقل تلقائياً بالإحداثيات المختارة.

---

## 🔁 Data Flow

```
User → Zustand Store → useApiData Hook → Axios (with Auth) → API Call → Store Update → UI Re-render
```

**Example Flow:**

1. User clicks "Create User"
2. Store opens modal and sets form state
3. User fills form → Zod validates data
4. On submit → `useApiData().post()` triggered
5. **Axios automatically adds Bearer token** to request headers
6. On success → Store updates → UI re-renders
7. On 401 error → Auto-redirect to login page

### **🔐 Authentication Flow:**

```
Login → Save Token (localStorage + Cookie) → All API Requests Include Token → Middleware Protects Routes
```

**Login Process:**
1. User submits credentials via login form
2. `POST /auth/login` → Server returns `{ accessToken, user }`
3. Token saved to **localStorage** (for Axios) + **Cookie** (for middleware)
4. Zustand auth store updated with user data
5. Redirect to dashboard

**Protected Request Process:**
1. Any API call via `useApiData()`
2. Axios interceptor adds `Authorization: Bearer {token}` header automatically
3. Server validates token and processes request
4. If token invalid (401) → Token cleared → Redirect to login

---

## 🗂 Current Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── layout.tsx            # Auth layout wrapper
│   │   └── login/                # Login page
│   │       └── page.tsx          # Login form component
│   └── (home)/                   # Protected routes
│       ├── layout.tsx            # Main app layout
│       ├── page.tsx              # Dashboard/Home page
│       ├── lost-person/          # Lost person registration
│       │   └── page.tsx          # Registration form
│       └── find-person/          # Person search
│           └── page.tsx          # Search interface
├── components/
│   ├── common/                   # Shared components
│   │   ├── LanguageSwitcher.tsx  # Language toggle component
│   │   ├── MiniMapBox.tsx        # Mapbox integration (active in lost-person form)
│   │   └── content-view/         # Data display components
│   │       ├── index.tsx         # Main content view component
│   │       ├── card-view.tsx     # Card layout
│   │       ├── table-view.tsx    # Table layout
│   │       └── custom-pagination.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── home/                 # Homepage components
│   │   │   ├── ActionButtons.tsx # Main action buttons
│   │   │   ├── HomeHeader.tsx    # Header with language switcher
│   │   │   ├── ServiceCards.tsx  # Feature cards
│   │   │   └── UserInfo.tsx      # User information display
│   │   ├── lost-person/          # Lost person form components
│   │   │   ├── ConsentSection.tsx
│   │   │   ├── Form.tsx          # Form wrapper (legacy)
│   │   │   ├── FormActions.tsx   # Submit/cancel buttons
│   │   │   ├── LostPersonHeader.tsx
│   │   │   └── PersonalInfoForm.tsx # Main registration form
│   │   └── find-person/          # Search components
│   │       ├── FindPersonHeader.tsx
│   │       ├── SearchForm.tsx    # Search input form
│   │       └── SearchResults.tsx # Results display
│   └── ui/                       # Base UI components (ShadCN)
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown.tsx
│       ├── input.tsx
│       └── label.tsx
├── hooks/                        # Custom React hooks
│   ├── useApi/                   # API data management
│   │   ├── index.tsx             # Main API hook
│   │   ├── types.ts              # API types
│   │   └── utils.ts              # API utilities
│   ├── use-upload-file.ts        # File upload hook
│   └── useHydrated.ts            # Hydration detection
├── lib/                          # Utilities and configuration
│   ├── animations.ts             # Animation utilities
│   ├── axiosClients.ts           # Axios client with auth
│   ├── imageUtils.ts             # Image utilities
│   ├── metadata.ts               # SEO metadata
│   ├── rtl-utils.ts              # RTL/LTR utilities
│   ├── tokenManager.ts           # Token management
│   ├── translations.ts           # Translation utilities
│   └── utils.ts                  # General utilities
├── Localization/                 # Translation files
│   ├── index.ts                  # Translation exports
│   ├── find-person/
│   │   └── findPersonTranslations.ts
│   ├── home/
│   │   └── homeTranslations.ts
│   ├── login/
│   │   └── loginTranslations.ts
│   └── lost-person/
│       └── lostPersonTranslations.ts
├── store/                        # Zustand state management
│   ├── auth/
│   │   └── authStore.ts          # Authentication state
│   └── language/
│       └── languageStore.ts      # Language state
├── styles/
│   └── globals.css               # Global styles
├── types/
│   └── attachment.ts             # File upload types
└── middleware.ts                 # Route protection
```

---

## 📊 Feature Implementation Status

### ✅ **Completed Features:**

1. **Multi-language Support (100%)**:
   - Arabic, English, and Persian translations
   - RTL/LTR direction handling
   - Language switcher component
   - Persistent language selection
   - Complete translation coverage

2. **Authentication System (100%)**:
   - JWT token-based authentication
   - Protected routes with middleware
   - Login/logout functionality
   - Token management (localStorage + cookies)
   - Auto-redirect on authentication errors

3. **UI/UX Foundation (100%)**:
   - Responsive design (mobile-first)
   - ShadCN UI component library
   - Consistent styling with Tailwind CSS
   - RTL/LTR layout support
   - Clean component architecture

4. **Lost Person Registration (95%)**:
   - ✅ Personal information form
   - ✅ Multi-step form validation
   - ✅ Consent management
   - ✅ Hybrid location input (Map + Text)
   - ✅ Interactive Mapbox integration
   - ⏳ Firebase integration needed

5. **Person Search Interface (80%)**:
   - ✅ Search form with multiple criteria
   - ✅ Mock search results display
   - ✅ Result ranking/scoring UI
   - ⏳ Backend API integration needed
   - ⏳ Fuzzy search algorithm implementation

### 🔄 **In Development:**

1. **Firebase Integration**:
   - Lost person data storage
   - Real-time data synchronization
   - Search result retrieval
   - User authentication backend

2. **Search Algorithm**:
   - Fuzzy matching implementation
   - Relevance scoring
   - Geographic proximity matching

### 📅 **Planned Features:**

1. **Enhanced Map Features**:
   - Visual search results display on map
   - Reference points management
   - Advanced GPS location detection
   - Map-based person search interface

2. **Real-time Updates**:
   - Live search result updates
   - Push notifications
   - Status change notifications

3. **Admin Dashboard**:
   - Main center staff interface
   - Bulk registration capabilities
   - System monitoring
   - Reference point management

### 🎯 **Current Location Input Implementation:**

- **Type**: Hybrid Map + Text input system
- **Map Features**: 
  - Interactive Mapbox component with "My site" label
  - Mini map preview (32px height) with click-to-expand modal
  - Bounds-restricted to Samarra Holy Shrine area (4km x 4km)
  - GPS location detection capability
  - Draggable marker placement
  - Multi-language support (Arabic: "موقعي", English: "My site", Persian: "سایت من")
- **Text Input Features**:
  - Auto-populated from map selection with area descriptions
  - Manual editing capability for custom locations
  - Multi-language placeholder guidance
  - Format: "Area Description (coordinates)" e.g., "Northeast Area (34.20125, 43.88756)"
- **Integration**: Seamless map-to-text conversion with coordinate extraction capability

---

## ⚙️ Usage Examples

### **Basic API Usage (Auto-Authenticated)**
```tsx
// From Zustand Store (UI State)
const { formData, setFormField } = useUserStore();

// From API Hook (Server Data) - Token automatically included!
const { data, post, loading, error } = useApiData('/api/users/');
```

### **Authentication Usage**
```tsx
// Login Process
const { post } = useApiData('/auth/login');
const { setAuth } = useAuthStore();

const handleLogin = async (credentials) => {
  await post({
    data: credentials,
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      setAuth(user, accessToken); // Saves to localStorage + cookie
      router.push('/');
    }
  });
};

// Logout Process
const { clearAuth } = useAuthStore();
const handleLogout = () => {
  clearAuth(); // Clears localStorage + cookie
  router.push('/login');
};
```

### **Token Management**
```tsx
import { tokenManager } from '@/lib/tokenManager';

// Check if user is authenticated
const isLoggedIn = tokenManager.hasToken();

// Manual token operations (rarely needed)
tokenManager.setToken('new-token');
tokenManager.removeToken();
```

### **File Upload Usage** (Independent Hook)
```tsx
import UploadFile from '@/components/common/upload-file';
import { useUploadFile } from '@/hooks/use-upload-file';
import type { UploadedFile } from '@/types/attachment';

// Single file upload component
<UploadFile
  endpoint="/attachments/upload"
  collection="articles"
  type="image/*"
  onValueChange={(file: UploadedFile) => {
    setMainImageId(Number(file.id));
  }}
/>

// Multiple files upload component
<UploadFile
  endpoint="/attachments/upload"
  collection="documents"
  multiple
  type="image/*,application/pdf"
  onValueChange={(files: UploadedFile[]) => {
    setAttachmentIds(files.map(f => Number(f.id)));
  }}
/>

// Using the upload hook directly (independent of useApiData)
const { handleUploadFiles, files, uploadedFiles, deleteFile, finish, isUploading } = 
  useUploadFile('/attachments/upload', true, undefined, { collection: 'articles' });

// The upload hook uses direct axios calls with FormData
// - No dependency on useApiData hook
// - Direct FormData body with file + collection
// - Built-in progress tracking and authentication
```

---

## 🧩 Adding a New Entity

1. Duplicate an existing `store/{entity}` and `components/features/{entity}` folder
2. Update `types`, `validation`, and API routes
3. The rest (filtering, modals, CRUD, etc.) works automatically
4. **No authentication setup needed** - All API calls are automatically authenticated!

---

## 🎨 UI/UX Best Practices

### Loading & Error States
- **AVOID** full page refreshes for loading/error states
- **USE** inline loading states within content areas
- **SHOW** loading spinners in specific sections, not entire page
- **DISPLAY** errors contextually within the content flow
- **MAINTAIN** page layout and navigation during state changes

### Image Handling
- **ALWAYS** use Next.js `Image` component for optimized loading
- **CONFIGURE** `next.config.ts` with allowed image domains/patterns
- **USE** image utilities (`src/lib/imageUtils.ts`) for consistent URL handling
- **VALIDATE** image paths before rendering
- **PROVIDE** meaningful alt text for accessibility

### Example Implementations

#### Loading States
```tsx
// ❌ Bad - Full page loading
if (isLoading) return <div>Loading...</div>

// ✅ Good - Contextual loading
<div className="content-area">
  {isLoading ? (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <ContentComponent data={data} />
  )}
</div>
```

#### Image Handling
```tsx
import Image from "next/image";
import { getImageUrl, getImageAlt, isValidImagePath } from "@/lib/imageUtils";

// ❌ Bad - Direct path without validation
<img src={`http://localhost:8000/${imagePath}`} alt="image" />

// ✅ Good - Proper Next.js Image with utilities
{imageData && isValidImagePath(imageData.path) && (
  <div className="relative h-64 w-full">
    <Image
      src={getImageUrl(imageData.path)}
      alt={getImageAlt(imageData.altText, "الصورة الافتراضية")}
      fill
      className="object-cover"
    />
  </div>
)}

// ✅ Good - With fallback for missing images
{imageData && isValidImagePath(imageData.path) ? (
  <Image
    src={getImageUrl(imageData.path)}
    alt={getImageAlt(imageData.altText)}
    width={400}
    height={300}
    className="rounded-lg"
  />
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
    <span className="text-gray-500">لا توجد صورة</span>
  </div>
)}
```

#### Next.js Configuration
```tsx
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      // Add production domains here
    ],
  },
};
```

---

## 📁 File Upload Architecture

### **Independent Upload System**
File uploads are handled by a **separate hook** that doesn't depend on `useApiData`:

- **Direct Axios Integration**: Uses `apiClient` directly for FormData uploads
- **FormData Structure**: Automatically sends `file` + `collection` fields
- **Progress Tracking**: Real-time upload progress with percentage
- **Authentication**: Automatic token inclusion via axios interceptors
- **Type Safety**: Full TypeScript support with attachment types

### **Key Components**

#### **1. Upload Hook** (`src/hooks/use-upload-file.ts`)
```tsx
// Independent hook with direct axios calls
const { handleUploadFiles, files, uploadedFiles, deleteFile, finish, isUploading } = 
  useUploadFile(endpoint, multiple, initialValue, { collection });

// Features:
// - FormData with file + collection
// - Progress tracking via onUploadProgress
// - Server-side file deletion
// - No dependency on useApiData
```

#### **2. Upload Component** (`src/components/common/upload-file.tsx`)
```tsx
<UploadFile
  endpoint="/attachments/upload"
  collection="articles"        // Required: documents, articles, etc.
  type="image/*"              // File type restriction
  multiple={true}             // Single or multiple files
  onValueChange={callback}    // Returns UploadedFile[]
/>
```

#### **3. API Structure** (Based on Postman Collection)
```
POST /attachments/upload
Content-Type: multipart/form-data

Body:
- file: [File]
- collection: "documents" | "articles" | etc.

Response:
{
  "status": "success",
  "data": {
    "id": 123,
    "originalName": "image.jpg",
    "path": "uploads/articles/image.jpg",
    ...
  }
}
```

### **Separation from useApiData**
- ✅ **Independent**: Upload hook doesn't use `useApiData`
- ✅ **Direct FormData**: Sends FormData body directly via axios
- ✅ **Clean Architecture**: Keeps data fetching and file uploads separate
- ✅ **Specialized**: Optimized specifically for file upload operations

---

## 🔐 Authentication Architecture

### **Dual Storage Strategy**
- **localStorage**: Used by Axios for API requests (client-side)
- **Cookies**: Used by Next.js middleware for route protection (server-side)

### **Key Components**

#### **1. Token Manager** (`src/lib/tokenManager.ts`)
```tsx
tokenManager.setToken(token)    // Sets both localStorage + cookie
tokenManager.getToken()         // Gets from localStorage
tokenManager.removeToken()      // Clears both storages
tokenManager.hasToken()         // Checks if authenticated
```

#### **2. Axios Client** (`src/lib/axiosClients.ts`)
- **Request Interceptor**: Adds `Authorization: Bearer {token}` to all requests
- **Response Interceptor**: Handles 401 errors → clears tokens → redirects to login

#### **3. Middleware** (`src/middleware.ts`)
- Protects routes server-side using cookies
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages

#### **4. Auth Store** (`src/store/auth/`)
```tsx
const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
```

### **Security Features**
- ✅ Automatic token injection in all API requests
- ✅ Server-side route protection
- ✅ Token expiration handling
- ✅ Secure cookie settings (`SameSite=strict`)
- ✅ Automatic cleanup on logout/401 errors

---



## 🧱 Architecture Layers

### 1. **Data Layer** — `src/hooks/useApi/`

Handles **all API interactions** and **server state**:

- Custom hook: `useApiData()`
- Supports:
  - ✅ `GET`, `POST`, `PUT`, `DELETE`
  - ✅ Request cancellation
  - ✅ Race condition handling
  - ✅ Retry logic
  - ✅ Optimistic updates
  - ✅ Caching
  - ✅ Loading/error state management
  - ✅ **Automatic Authentication** via Axios interceptors
**Files:**
- `index.tsx` – API hook logic  
- `types.ts` – API response/request typings  
- `utils.ts` – Utility helpers for error/response handling

#### **🔐 Authentication Integration:**
- **Axios Client** (`src/lib/axiosClients.ts`) automatically includes Bearer token in all requests
- **Token Management** (`src/lib/tokenManager.ts`) handles localStorage + cookies sync
- **Auto-redirect** to login on 401 errors

---

### 2. **State Layer** — `src/store/{entity}/`

Manages **UI state** per entity using **Zustand**:

- Handles:
  - ✅ Form modal state
  - ✅ Filters & selections
  - ✅ Bulk operations
  - ✅ Form data + validation with **Zod**

**Example (User Entity):**
```
src/store/users/
  ├── userStore.ts         # Zustand store for UI state
  ├── userValidation.ts    # Zod schema definitions
  ├── userTypes.ts         # TypeScript types
```

---
### 3. api project
- read file @plan\ImamZain API v2.postman_collection.json
- this file api project 
- contan data response and request for all endpoint project
- if you don't know what data response or request tall me to send it to you (don't make it in you self)
- not use /:lang perfix for endpoints in this cms this for public website 

### 4. **Presentation Layer** — `src/components/{entity}/`

Structured, reusable and modular UI components:

- `common/` → Shared UI logic  
- `features/` → Page-specific features  
- `layouts/` → App layouts (e.g., sidebar, navbar)  
- `ui/` → Wrapped/customized ShadCN UI components

---

## 🔁 Data Flow

```
User → Zustand Store → useApiData Hook → Axios (with Auth) → API Call → Store Update → UI Re-render
```

**Example Flow:**

1. User clicks "Create User"
2. Store opens modal and sets form state
3. User fills form → Zod validates data
4. On submit → `useApiData().post()` triggered
5. **Axios automatically adds Bearer token** to request headers
6. On success → Store updates → UI re-renders
7. On 401 error → Auto-redirect to login page

### **🔐 Authentication Flow:**

```
Login → Save Token (localStorage + Cookie) → All API Requests Include Token → Middleware Protects Routes
```

**Login Process:**
1. User submits credentials via login form
2. `POST /auth/login` → Server returns `{ accessToken, user }`
3. Token saved to **localStorage** (for Axios) + **Cookie** (for middleware)
4. Zustand auth store updated with user data
5. Redirect to dashboard

**Protected Request Process:**
1. Any API call via `useApiData()`
2. Axios interceptor adds `Authorization: Bearer {token}` header automatically
3. Server validates token and processes request
4. If token invalid (401) → Token cleared → Redirect to login

---

## 🗂 File Structure (Simplified)

```
src/
├── app/                    # Next.js pages and routing
│    └── (auth)    
│         └── login/ 
│              └── page.tsx  
│         └── layout.ts
│    └── (home)              # handle protect router app
│         └── page1/         
│              └── page.tsx  
│         └── layout.ts
├── hooks/
│   ├── useApi/               # API data management
│   └── use-upload-file.ts    # Independent file upload hook
├── store/{entity}/           # Zustand state & Zod validation
│   ├── userStore.ts
│   ├── userValidation.ts
│   └── userTypes.ts
├── components/{entity}/      # UI components per entity
│   ├── common/
│   │   ├── upload-file.tsx   # File upload component
│   │   └── ...
│   ├── features/
│   ├── layouts/
│   └── ui/
├── lib/
│   ├── axiosClients.ts       # Axios client with auth interceptors
│   ├── tokenManager.ts       # Token management utilities
│   ├── imageUtils.ts         # Image URL and validation utilities
│   └── utils.ts              # General utilities
├── middleware.ts             # Route protection with cookies
└── types/
    ├── attachment.ts         # File upload types
    └── {routes}/            
```

---

## ⚙️ Usage Examples

### **Basic API Usage (Auto-Authenticated)**
```tsx
// From Zustand Store (UI State)
const { formData, setFormField } = useUserStore();

// From API Hook (Server Data) - Token automatically included!
const { data, post, loading, error } = useApiData('/api/users/');
```

### **Authentication Usage**
```tsx
// Login Process
const { post } = useApiData('/auth/login');
const { setAuth } = useAuthStore();

const handleLogin = async (credentials) => {
  await post({
    data: credentials,
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      setAuth(user, accessToken); // Saves to localStorage + cookie
      router.push('/');
    }
  });
};

// Logout Process
const { clearAuth } = useAuthStore();
const handleLogout = () => {
  clearAuth(); // Clears localStorage + cookie
  router.push('/login');
};
```

### **Token Management**
```tsx
import { tokenManager } from '@/lib/tokenManager';

// Check if user is authenticated
const isLoggedIn = tokenManager.hasToken();

// Manual token operations (rarely needed)
tokenManager.setToken('new-token');
tokenManager.removeToken();
```

### **File Upload Usage** (Independent Hook)
```tsx
import UploadFile from '@/components/common/upload-file';
import { useUploadFile } from '@/hooks/use-upload-file';
import type { UploadedFile } from '@/types/attachment';

// Single file upload component
<UploadFile
  endpoint="/attachments/upload"
  collection="articles"
  type="image/*"
  onValueChange={(file: UploadedFile) => {
    setMainImageId(Number(file.id));
  }}
/>

// Multiple files upload component
<UploadFile
  endpoint="/attachments/upload"
  collection="documents"
  multiple
  type="image/*,application/pdf"
  onValueChange={(files: UploadedFile[]) => {
    setAttachmentIds(files.map(f => Number(f.id)));
  }}
/>

// Using the upload hook directly (independent of useApiData)
const { handleUploadFiles, files, uploadedFiles, deleteFile, finish, isUploading } = 
  useUploadFile('/attachments/upload', true, undefined, { collection: 'articles' });

// The upload hook uses direct axios calls with FormData
// - No dependency on useApiData hook
// - Direct FormData body with file + collection
// - Built-in progress tracking and authentication
```

---

## 🧩 Adding a New Entity

1. Duplicate an existing `store/{entity}` and `components/features/{entity}` folder
2. Update `types`, `validation`, and API routes
3. The rest (filtering, modals, CRUD, etc.) works automatically
4. **No authentication setup needed** - All API calls are automatically authenticated!

---

## 🎨 UI/UX Best Practices

### Loading & Error States
- **AVOID** full page refreshes for loading/error states
- **USE** inline loading states within content areas
- **SHOW** loading spinners in specific sections, not entire page
- **DISPLAY** errors contextually within the content flow
- **MAINTAIN** page layout and navigation during state changes

### Image Handling
- **ALWAYS** use Next.js `Image` component for optimized loading
- **CONFIGURE** `next.config.ts` with allowed image domains/patterns
- **USE** image utilities (`src/lib/imageUtils.ts`) for consistent URL handling
- **VALIDATE** image paths before rendering
- **PROVIDE** meaningful alt text for accessibility

### Example Implementations

#### Loading States
```tsx
// ❌ Bad - Full page loading
if (isLoading) return <div>Loading...</div>

// ✅ Good - Contextual loading
<div className="content-area">
  {isLoading ? (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <ContentComponent data={data} />
  )}
</div>
```

#### Image Handling
```tsx
import Image from "next/image";
import { getImageUrl, getImageAlt, isValidImagePath } from "@/lib/imageUtils";

// ❌ Bad - Direct path without validation
<img src={`http://localhost:8000/${imagePath}`} alt="image" />

// ✅ Good - Proper Next.js Image with utilities
{imageData && isValidImagePath(imageData.path) && (
  <div className="relative h-64 w-full">
    <Image
      src={getImageUrl(imageData.path)}
      alt={getImageAlt(imageData.altText, "الصورة الافتراضية")}
      fill
      className="object-cover"
    />
  </div>
)}

// ✅ Good - With fallback for missing images
{imageData && isValidImagePath(imageData.path) ? (
  <Image
    src={getImageUrl(imageData.path)}
    alt={getImageAlt(imageData.altText)}
    width={400}
    height={300}
    className="rounded-lg"
  />
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
    <span className="text-gray-500">لا توجد صورة</span>
  </div>
)}
```

#### Next.js Configuration
```tsx
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      // Add production domains here
    ],
  },
};
```

---

## 📁 File Upload Architecture

### **Independent Upload System**
File uploads are handled by a **separate hook** that doesn't depend on `useApiData`:

- **Direct Axios Integration**: Uses `apiClient` directly for FormData uploads
- **FormData Structure**: Automatically sends `file` + `collection` fields
- **Progress Tracking**: Real-time upload progress with percentage
- **Authentication**: Automatic token inclusion via axios interceptors
- **Type Safety**: Full TypeScript support with attachment types

### **Key Components**

#### **1. Upload Hook** (`src/hooks/use-upload-file.ts`)
```tsx
// Independent hook with direct axios calls
const { handleUploadFiles, files, uploadedFiles, deleteFile, finish, isUploading } = 
  useUploadFile(endpoint, multiple, initialValue, { collection });

// Features:
// - FormData with file + collection
// - Progress tracking via onUploadProgress
// - Server-side file deletion
// - No dependency on useApiData
```

#### **2. Upload Component** (`src/components/common/upload-file.tsx`)
```tsx
<UploadFile
  endpoint="/attachments/upload"
  collection="articles"        // Required: documents, articles, etc.
  type="image/*"              // File type restriction
  multiple={true}             // Single or multiple files
  onValueChange={callback}    // Returns UploadedFile[]
/>
```

#### **3. API Structure** (Based on Postman Collection)
```
POST /attachments/upload
Content-Type: multipart/form-data

Body:
- file: [File]
- collection: "documents" | "articles" | etc.

Response:
{
  "status": "success",
  "data": {
    "id": 123,
    "originalName": "image.jpg",
    "path": "uploads/articles/image.jpg",
    ...
  }
}
```

### **Separation from useApiData**
- ✅ **Independent**: Upload hook doesn't use `useApiData`
- ✅ **Direct FormData**: Sends FormData body directly via axios
- ✅ **Clean Architecture**: Keeps data fetching and file uploads separate
- ✅ **Specialized**: Optimized specifically for file upload operations

---

## 🔐 Authentication Architecture