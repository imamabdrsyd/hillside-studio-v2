# 🚀 Deployment Guide - Hillside Studio v2

## ✅ Status Konversi

**Project telah berhasil dikonversi dari HTML static ke Next.js + Supabase!**

### Yang Sudah Dikerjakan:
- ✅ Setup Next.js 14 dengan TypeScript
- ✅ Konfigurasi Tailwind CSS
- ✅ Integrasi Supabase client
- ✅ Konversi semua komponen HTML ke React
- ✅ Setup CRUD operations dengan Supabase
- ✅ Dashboard dengan charts (Chart.js)
- ✅ Transaction management
- ✅ Responsive design
- ✅ Git commit dan push ke branch `claude/html-to-nextjs-supabase-ZajJd`

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up / Login
3. Klik "New Project"
4. Isi:
   - **Name**: hillside-studio-v2
   - **Database Password**: [buat password yang kuat]
   - **Region**: Southeast Asia (Singapore) - pilih yang terdekat
5. Tunggu project dibuat (~2 menit)

### 1.2 Setup Database Schema
1. Di Supabase Dashboard, klik **SQL Editor**
2. Klik **New Query**
3. Copy semua kode dari file `sql/schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl+Enter`
6. Tunggu sampai selesai (✅ Success)

### 1.3 (Optional) Load Sample Data
1. Masih di SQL Editor, klik **New Query**
2. Copy semua kode dari file `sql/seed.sql`
3. Paste ke SQL Editor
4. Klik **Run**
5. Sekarang database sudah ada sample data untuk testing

### 1.4 Copy Credentials
1. Klik **Settings** (icon gear di sidebar)
2. Klik **API**
3. Copy dua nilai ini:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (string panjang)

---

## 🌐 Step 2: Deploy ke Vercel

### Option A: Via GitHub (Recommended)

#### 2.1 Push ke GitHub
Kode sudah di-push ke branch `claude/html-to-nextjs-supabase-ZajJd`. Sekarang merge ke main:

```bash
# Checkout ke main branch
git checkout main

# Merge branch Claude
git merge claude/html-to-nextjs-supabase-ZajJd

# Push ke GitHub
git push origin main
```

#### 2.2 Deploy di Vercel
1. Kunjungi [vercel.com](https://vercel.com)
2. Sign up / Login (gunakan akun GitHub)
3. Klik **Add New** → **Project**
4. Import repository `hillside-studio-v2`
5. Vercel akan otomatis detect "Next.js"
6. **JANGAN klik Deploy dulu!**

#### 2.3 Tambahkan Environment Variables
Di Vercel project settings, klik **Environment Variables** tab:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: [paste Project URL dari Supabase]
- Environment: Production, Preview, Development (centang semua)

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: [paste anon key dari Supabase]
- Environment: Production, Preview, Development (centang semua)

#### 2.4 Deploy!
1. Klik **Deploy**
2. Tunggu ~2-3 menit
3. Klik link deployment (contoh: `hillside-studio-v2.vercel.app`)

---

### Option B: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Tambah environment variables (akan ditanya satu-satu)
vercel env add NEXT_PUBLIC_SUPABASE_URL
# [paste value, tekan Enter]

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# [paste value, tekan Enter]

# Deploy ke production
vercel --prod
```

---

## ✅ Step 3: Testing

### 3.1 Test Basic Features
1. Buka deployed URL
2. Check apakah Dashboard muncul
3. Check apakah stats cards tampil (bisa 0 jika belum ada data)

### 3.2 Test CRUD Operations
1. Klik **Transactions** di sidebar
2. Klik **Add Transaction**
3. Isi form:
   - Date: pilih tanggal hari ini
   - Category: EARN
   - Description: Test Transaction
   - Amount: 1000000
   - Account: BCA
4. Klik **Add Transaction**
5. Harusnya muncul di tabel

### 3.3 Test Dashboard Update
1. Klik **Dashboard** di sidebar
2. Stats cards harusnya update otomatis
3. Chart harusnya tampil data

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch transactions"
**Solution:**
1. Check environment variables di Vercel sudah benar
2. Check Supabase project masih aktif
3. Check RLS policies di Supabase (buka Authentication → Policies)

### Issue: Build failed di Vercel
**Solution:**
1. Check logs di Vercel dashboard
2. Pastikan `package.json` lengkap
3. Pastikan tidak ada TypeScript errors

### Issue: Dashboard tampil tapi data kosong
**Solution:**
1. Buka Supabase dashboard → Table Editor
2. Check tabel `transactions` ada isinya
3. Run `sql/seed.sql` jika mau load sample data

---

## 📱 Local Development

Untuk development di local:

```bash
# Clone repository
git clone <your-repo-url>
cd hillside-studio-v2

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local, isi Supabase credentials
nano .env.local

# Run dev server
npm run dev

# Buka http://localhost:3000
```

---

## 🎯 Next Steps (Future Enhancements)

1. **Authentication**
   - Add login/register page
   - Implement Supabase Auth
   - Add role-based access (superadmin vs viewer)

2. **PDF Export**
   - Finish PDF export functionality
   - Add monthly report export

3. **Financial Reports**
   - Implement Income Statement page
   - Implement Balance Sheet page
   - Implement Cash Flow Statement page
   - Implement ROI & Forecast page

4. **Additional Features**
   - Asset management CRUD
   - Booking management CRUD
   - Multi-currency support
   - Data backup/restore

---

## 📞 Support

Jika ada masalah:
1. Check README.md untuk dokumentasi lengkap
2. Check file log error di Vercel dashboard
3. Check Supabase logs di dashboard → Logs

---

**Created by Claude Code**
Version: 2.0.0
Date: 2026-01-10
