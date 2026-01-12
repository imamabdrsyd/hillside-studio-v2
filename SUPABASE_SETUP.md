# Petunjuk Implementasi Supabase Authentication

Dokumen ini berisi petunjuk lengkap untuk mengimplementasikan sistem autentikasi Supabase pada Hillside Studio Finance v2.

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Setup Database di Supabase](#setup-database-di-supabase)
3. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
4. [Membuat Test Accounts](#membuat-test-accounts)
5. [Deployment ke Vercel](#deployment-ke-vercel)
6. [Testing & Verification](#testing--verification)
7. [Role Management](#role-management)
8. [Troubleshooting](#troubleshooting)

---

## 1. Persiapan Awal

### Requirement
- Akun Supabase (gratis): https://supabase.com
- Akun Vercel (gratis): https://vercel.com
- Project sudah di-push ke GitHub

### Yang Sudah Tersedia di Code
✅ Semua file auth sudah dibuat:
- `src/app/(auth)/login/page.tsx` - Halaman login
- `src/app/(auth)/register/page.tsx` - Halaman register
- `src/app/(auth)/forgot-password/page.tsx` - Halaman lupa password
- `src/app/(auth)/reset-password/page.tsx` - Halaman reset password
- `src/app/(dashboard)/profile/page.tsx` - Halaman edit profile
- `src/app/(dashboard)/transactions/page.tsx` - Halaman transactions (hanya Director)
- `src/contexts/AuthContext.tsx` - Global auth state management
- `middleware.ts` - Protected routes & role-based access
- `database/schema.sql` - Database schema siap pakai

---

## 2. Setup Database di Supabase

### Step 1: Buat Project di Supabase

1. Login ke https://supabase.com
2. Klik **"New Project"**
3. Isi form:
   - **Name**: hillside-studio-v2 (atau nama bebas)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Singapore (terdekat dengan Indonesia)
4. Klik **"Create new project"**
5. Tunggu 1-2 menit sampai project selesai dibuat

### Step 2: Jalankan Database Schema

1. Buka project Supabase yang baru dibuat
2. Klik menu **"SQL Editor"** di sidebar kiri
3. Klik **"+ New query"**
4. Copy seluruh isi file `database/schema.sql` dari repository
5. Paste ke SQL Editor
6. Klik tombol **"Run"** (atau tekan Ctrl/Cmd + Enter)
7. Pastikan muncul pesan sukses: **"Success. No rows returned"**

### Step 3: Verifikasi Database

1. Klik menu **"Table Editor"** di sidebar
2. Pastikan tabel **"profiles"** sudah muncul dengan kolom:
   - `id` (uuid, primary key)
   - `email` (text)
   - `full_name` (text)
   - `role` (text) - dengan constraint: managing_director, investor, guest
   - `avatar_url` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## 3. Konfigurasi Environment Variables

### Step 1: Ambil API Keys dari Supabase

**CARA 1: Via Project Settings → API Keys (Recommended)**

1. Di dashboard Supabase, klik ⚙️ **"Project Settings"** di sidebar kiri (pojok bawah)
2. Klik **"API Keys"** di menu Data API
3. Copy 2 values ini:
   - **Project URL** (contoh: https://xxxxx.supabase.co) - Ada di bagian "Config"
   - **anon public** key - Ada di section "Project API keys" (string panjang yang dimulai dengan "eyJ...")

**CARA 2: Via Home Dashboard (Alternatif)**

1. Dari dashboard utama project Supabase
2. Klik **"Connect"** button (pojok kanan atas)
3. Pilih tab **"App Frameworks"** atau **"JavaScript"**
4. Copy **Project URL** dan **anon key** yang ditampilkan

**PENTING**:
- Jangan copy `service_role` key (secret key), gunakan hanya **`anon`/`public`** key
- Project URL format: `https://[project-ref].supabase.co`

### Step 2: Setup Local Development (.env.local)

1. Buka terminal di root project
2. Buat file `.env.local`:
   ```bash
   touch .env.local
   ```
3. Isi file `.env.local` dengan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **Ganti** dengan URL dan Key dari Supabase Anda!

4. Restart development server:
   ```bash
   npm run dev
   ```

---

## 4. Membuat Test Accounts

### Cara 1: Via Supabase Dashboard (Recommended)

1. Buka Supabase Dashboard
2. Klik **"Authentication"** di sidebar
3. Klik **"Users"** tab
4. Klik **"Add user"** → **"Create new user"**
5. Isi form untuk **Managing Director**:
   - Email: `imam.isyida@gmail.com`
   - Password: `YourPassword123` (ganti dengan password Anda)
   - Auto Confirm User: ✅ **Aktifkan**
   - Klik **"Create user"**
6. Isi form untuk **Investor**:
   - Email: `investor@hillsidestudio.id`
   - Password: `Investor123`
   - Auto Confirm User: ✅ **Aktifkan**
   - Klik **"Create user"**

### Cara 2: Via Register Page

1. Buka aplikasi di browser: http://localhost:3000
2. Klik **"Register"**
3. Isi form dan submit
4. ⚠️ **PENTING**: Cek email untuk verification link
5. Klik link di email untuk verify account

### Verifikasi Role Assignment

1. Di Supabase Dashboard, klik **"Table Editor"**
2. Pilih tabel **"profiles"**
3. Pastikan:
   - `imam.isyida@gmail.com` memiliki role: `managing_director`
   - `investor@hillsidestudio.id` memiliki role: `investor`
4. Jika role salah, klik pada cell dan edit manual

---

## 5. Deployment ke Vercel

### Step 1: Push Code ke GitHub

```bash
git add .
git commit -m "Add Supabase authentication system"
git push origin main
```

### Step 2: Deploy ke Vercel

1. Login ke https://vercel.com
2. Klik **"Add New"** → **"Project"**
3. Import repository GitHub Anda
4. Di **"Environment Variables"**, tambahkan:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste URL dari Supabase)
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (paste Anon Key dari Supabase)
5. Klik **"Deploy"**
6. Tunggu sampai deployment selesai (2-3 menit)

### Step 3: Update Redirect URLs di Supabase

1. Buka Supabase Dashboard
2. Klik **"Authentication"** → **"URL Configuration"**
3. Di **"Redirect URLs"**, tambahkan:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/reset-password
   ```
   ⚠️ Ganti `your-app.vercel.app` dengan domain Vercel Anda!
4. Klik **"Save"**

---

## 6. Testing & Verification

### Test Checklist

✅ **Login Flow**
1. Buka aplikasi di browser
2. Masuk dengan `imam.isyida@gmail.com`
3. Harus redirect ke `/dashboard`
4. Lihat Sidebar → Role badge harus menampilkan: **Director** (bukan "Managing Director")
5. Menu **Transactions** harus muncul

✅ **Logout Flow**
1. Klik tombol **"Logout"** di Sidebar
2. Harus redirect ke `/login`
3. Tidak bisa akses `/dashboard` tanpa login

✅ **Role-Based Access**
1. Logout
2. Login dengan `investor@hillsidestudio.id`
3. Role badge harus menampilkan: **Investor**
4. Menu **Transactions** harus **TIDAK muncul** di Sidebar
5. Coba akses `/transactions` manual → harus redirect ke `/dashboard`

✅ **Profile Management**
1. Klik dropdown user di Header
2. Klik **"Profile Settings"**
3. Nama harus terisi dengan benar (bukan "User")
4. Edit nama → klik **"Save Changes"**
5. Harus muncul notifikasi sukses
6. Nama di Sidebar harus ter-update

✅ **Password Reset**
1. Logout
2. Klik **"Forgot Password?"** di login page
3. Masukkan email
4. Cek inbox email
5. Klik link reset password
6. Set password baru
7. Harus bisa login dengan password baru

---

## 7. Role Management

### Role Types & Permissions

| Role | Display Name | Permissions |
|------|--------------|-------------|
| `managing_director` | **Director** | ✅ Full access (Dashboard, Transactions, Reports, Financials, ROI Forecast) |
| `investor` | **Investor** | 📊 View only (Dashboard, Reports, Financials, ROI Forecast) - Transactions **HIDDEN** |
| `guest` | **Guest** | 🚫 No access (future use) |

### Auto Role Assignment

Role otomatis di-assign saat user register berdasarkan email:

- **Email**: `imam.isyida@gmail.com` → Role: `managing_director` (Director)
- **Email lainnya** → Role: `investor` (Investor)

Logic ini ada di `database/schema.sql` line 32-37:
```sql
IF NEW.email = 'imam.isyida@gmail.com' THEN
  user_role := 'managing_director';
ELSE
  user_role := 'investor';
END IF;
```

### Manual Role Change

Jika perlu ubah role user secara manual:

1. Buka Supabase Dashboard
2. Klik **"Table Editor"** → tabel **"profiles"**
3. Cari user berdasarkan email
4. Klik pada cell **"role"**
5. Pilih role baru: `managing_director`, `investor`, atau `guest`
6. User harus logout & login lagi untuk melihat perubahan

---

## 8. Troubleshooting

### Problem: Infinite Loading di Homepage

**Penyebab**: Root page (`src/app/page.tsx`) adalah server component yang melakukan redirect berdasarkan session.

**Solusi**:
- ✅ Sudah diperbaiki di commit terbaru
- Root page sekarang menggunakan server-side redirect (tidak ada loop)
- Jika masih terjadi, clear browser cache: Ctrl+Shift+Delete

### Problem: Profile menampilkan "User" bukan nama asli

**Penyebab**: Profile state belum ter-load saat component render.

**Solusi**:
- ✅ Sudah diperbaiki dengan `useEffect` di `profile/page.tsx`
- Profile sekarang akan update otomatis saat data load

### Problem: Logout button tidak bekerja

**Penyebab**: signOut function tidak melakukan redirect.

**Solusi**:
- ✅ Sudah diperbaiki di `AuthContext.tsx`
- Logout sekarang akan redirect ke `/login` setelah signOut

### Problem: Transactions page tidak bisa dibuka (404)

**Penyebab**: Transactions page file tidak ada.

**Solusi**:
- ✅ Sudah dibuat di `src/app/(dashboard)/transactions/page.tsx`
- Page sekarang sudah bisa diakses oleh Director

### Problem: Build error "Supabase client not configured"

**Penyebab**: Environment variables tidak tersedia saat build time.

**Solusi**:
- ✅ Sudah diperbaiki dengan default placeholder values
- Client & server Supabase sudah handle missing env vars
- Di production: pastikan env vars sudah di-set di Vercel

### Problem: Email verification tidak terkirim

**Penyebab**: Email provider Supabase belum dikonfigurasi.

**Solusi**:
1. Buka Supabase Dashboard
2. Klik **"Authentication"** → **"Email Templates"**
3. Di **"SMTP Settings"**, pilih:
   - Development: Use Supabase SMTP (default)
   - Production: Configure custom SMTP (Gmail, SendGrid, dll)

### Problem: User tidak bisa reset password

**Penyebab**: Redirect URL belum ditambahkan di Supabase.

**Solusi**:
1. Buka Supabase Dashboard
2. Klik **"Authentication"** → **"URL Configuration"**
3. Tambahkan: `https://your-domain.com/reset-password`
4. Save

---

## 📞 Support

Jika ada masalah:

1. ✅ Check console browser (F12) untuk error messages
2. ✅ Check Supabase logs: Dashboard → Logs → Auth logs
3. ✅ Verifikasi environment variables sudah benar
4. ✅ Clear browser cache dan cookies
5. ✅ Restart development server

---

## 🎯 Summary Checklist

Sebelum Go Live, pastikan semua ini sudah ✅:

- [ ] Database schema sudah dijalankan di Supabase
- [ ] Environment variables sudah di-set di Vercel
- [ ] Redirect URLs sudah ditambahkan di Supabase
- [ ] Test account Managing Director & Investor sudah dibuat
- [ ] Login flow berhasil dan redirect ke dashboard
- [ ] Logout flow berhasil dan redirect ke login
- [ ] Role-based menu (Transactions) tampil/hidden dengan benar
- [ ] Profile page bisa load data dan save changes
- [ ] Email verification bekerja
- [ ] Password reset bekerja
- [ ] Build di Vercel berhasil tanpa error

---

**Last Updated**: 2026-01-12
**Version**: 2.0.0
**Author**: Claude (Anthropic)
