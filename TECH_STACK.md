# Tech Stack Documentation

## Hillside Studio V2

Dokumentasi teknologi yang digunakan dalam aplikasi manajemen keuangan Hillside Studio.

---

## UI/Styling

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Tailwind CSS** | v3.4.1 | Utility-first CSS framework |
| **PostCSS** | v8.4.33 | CSS transformation tool |
| **Autoprefixer** | v10.4.17 | Vendor prefix automation |
| **Plus Jakarta Sans** | - | Custom typography (Google Fonts) |
| **Lucide React** | v0.562.0 | Minimalist icon library |

### Custom Styling
- Custom CSS dengan Tailwind directives (`@tailwind`, `@layer`)
- Custom animations (fadeIn, slideInRight)
- Komponen UI kustom (Button, Input, Toast)

---

## Frontend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Next.js** | v14.1.0 | React metaframework untuk production |
| **React** | v18.2.0 | UI library |
| **React DOM** | v18.2.0 | DOM rendering library |
| **TypeScript** | v5.3.3 | Type-safe JavaScript |

### State Management
- **React Context API** - AuthContext untuk authentication state
- **Custom Hooks** - usePasswordValidation, useAuth

### Data Visualization & Reporting
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Chart.js** | v4.4.1 | Chart library |
| **react-chartjs-2** | v5.2.0 | React wrapper untuk Chart.js |
| **jsPDF** | v2.5.1 | PDF document generation |
| **jspdf-autotable** | v3.8.2 | PDF table formatting |

---

## Backend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Next.js App Router** | v14.1.0 | File-based routing & API routes |
| **Supabase** | v2.39.3 | Backend-as-a-Service |

### API Architecture
- **Next.js Route Handlers** untuk API endpoints
- **Server Components** & **Client Components** dengan pemisahan yang tepat
- **Middleware** untuk session management dan role-based routing

### API Endpoints
| Endpoint | Fungsi |
|----------|--------|
| `/api/auth/*` | Authentication (login, logout, password reset) |
| `/api/transactions/*` | Transaction CRUD operations |
| `/api/profile/*` | User profile management |
| `/api/reports/*` | Financial report generation |
| `/api/forecast/*` | Financial forecasting |
| `/api/health/*` | Health check endpoint |

---

## Authentication

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Supabase Auth** | - | Email/password authentication |
| **@supabase/ssr** | v0.8.0 | SSR utilities untuk cookie-based auth |

### Fitur Authentication
- Email/password authentication
- Role-based access control (managing_director, investor, guest)
- Session management dengan automatic token refresh
- Server-side rendering dengan proper cookie handling

---

## Database

| Teknologi | Deskripsi |
|-----------|-----------|
| **Supabase PostgreSQL** | Cloud-hosted PostgreSQL database |
| **Supabase JavaScript Client** | Type-safe database access |

### Database Tables
| Table | Deskripsi |
|-------|-----------|
| `profiles` | User profiles dengan roles |
| `transactions` | Financial transactions (EARN, OPEX, VAR, CAPEX, TAX, FIN) |
| `assets` | Asset inventory |
| `bookings` | Airbnb booking records |

---

## Hosting & Deployment

| Teknologi | Deskripsi |
|-----------|-----------|
| **Vercel** | Hosting platform |
| **Next.js Build Optimization** | SWC minification, React Strict Mode |

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   └── api/               # API routes
├── components/            # Reusable React components
│   └── ui/               # UI components (Button, Input, Toast)
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── supabase/        # Supabase client (browser & server)
└── types/               # TypeScript type definitions
```

---

## Development Tools

| Tool | Deskripsi |
|------|-----------|
| **npm** | Package manager |
| **TypeScript** | ES2017 target, strict mode enabled |
| **Path Aliases** | `@/*` → `./src/*` |

---

## Tech Stack

| Layer | Tech |
|----------|-----------------|
| **UI Styling** | Tailwind CSS, Lucide React, Plus Jakarta Sans |
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Backend** | Next.js API Routes, Supabase |
| **Auth** | Supabase Auth |
| **Database** | Supabase PostgreSQL |
| **Hosting** | Vercel |

---

**Version**: 2.0.0
**License**: MIT
