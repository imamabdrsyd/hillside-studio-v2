# 🚀 DEPLOY SEKARANG - Langkah Mudah

## ✅ SUDAH SELESAI:

1. ✅ **Konversi HTML ke Next.js** - DONE!
2. ✅ **Setup TypeScript + Tailwind** - DONE!
3. ✅ **Integrasi Supabase Client** - DONE!
4. ✅ **CRUD Operations** - DONE!
5. ✅ **Build Test** - SUCCESS!
6. ✅ **Git Commit & Push** - DONE!

---

## 🎯 YANG HARUS DILAKUKAN SEKARANG:

### STEP 1: Setup Supabase Database (5 menit)

1. **Buka:** https://supabase.com
2. **Login/Sign up** (gratis)
3. **Klik:** "New Project"
4. **Isi:**
   - Name: `hillside-studio-v2`
   - Database Password: [buat password kuat, simpan!]
   - Region: **Southeast Asia (Singapore)**
5. **Tunggu** ~2 menit (project creation)

6. **Setup Database:**
   - Klik **SQL Editor** (di sidebar)
   - Klik **New Query**
   - Copy semua dari file `sql/schema.sql`
   - Paste dan klik **Run**
   - Tunggu sampai ✅ Success

7. **(Optional) Load Sample Data:**
   - New Query lagi
   - Copy dari `sql/seed.sql`
   - Run

8. **Copy Credentials:**
   - Klik **Settings** (⚙️ di sidebar)
   - Klik **API**
   - Copy 2 ini:
     ```
     Project URL: https://xxxxx.supabase.co
     anon public: eyJhbGc... (string panjang)
     ```

---

### STEP 2: Update Environment Variables (1 menit)

Edit file `.env.local`:

```bash
nano .env.local
```

Ubah jadi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Ganti `xxxxx.supabase.co` dan `eyJhbGc...` dengan value dari Supabase!**

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

### STEP 3: Deploy ke Vercel (3 menit)

#### Option A: Pakai Script Otomatis (TERMUDAH)

```bash
./deploy.sh
```

Script akan:
- ✅ Check semua requirement
- ✅ Build project
- ✅ Login ke Vercel
- ✅ Deploy otomatis
- ✅ Setup environment variables

Ikuti instruksi di layar!

#### Option B: Manual via Dashboard

1. **Buka:** https://vercel.com
2. **Login** dengan GitHub
3. **Klik:** "Add New" → "Project"
4. **Select:** `hillside-studio-v2` repository
5. **JANGAN klik Deploy dulu!**
6. **Klik:** "Environment Variables"
7. **Tambah 2 variables:**

   Variable 1:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: [paste URL dari Supabase]
   - Environment: ✅ Production ✅ Preview ✅ Development

   Variable 2:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: [paste Key dari Supabase]
   - Environment: ✅ Production ✅ Preview ✅ Development

8. **Klik:** "Deploy"
9. **Tunggu** ~2-3 menit
10. **Klik** URL deployment

---

### STEP 4: Test Application (2 menit)

1. **Buka** deployed URL (contoh: `hillside-studio-v2.vercel.app`)
2. **Check** Dashboard tampil
3. **Klik** "Transactions" di sidebar
4. **Klik** "Add Transaction"
5. **Isi form:**
   - Date: hari ini
   - Category: EARN
   - Description: Test Pendapatan
   - Amount: 5000000
   - Account: BCA
6. **Submit**
7. **Check** data muncul di tabel
8. **Klik** "Dashboard"
9. **Check** stats card update (Revenue: Rp 5.000.000)
10. **Check** chart tampil

**SUKSES!** ✨

---

## 🔴 JIKA ADA ERROR:

### Error: "Failed to fetch transactions"

**Fix:**
```bash
# 1. Check Vercel environment variables
# Go to: Vercel Dashboard → Settings → Environment Variables
# Pastikan kedua variables ada dan benar

# 2. Redeploy
# Vercel Dashboard → Deployments → Latest → ... → Redeploy
```

### Error: "Missing Supabase environment variables"

**Fix:**
```bash
# Check .env.local ada dan isinya benar
cat .env.local

# Kalau kosong/salah, edit:
nano .env.local
# Update values
# Save: Ctrl+O, Enter, Ctrl+X

# Redeploy
vercel --prod
```

### Error: Build Failed

**Fix:**
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build

# Kalau berhasil, deploy lagi
./deploy.sh
```

---

## 📞 QUICK REFERENCE

### Useful Commands:

```bash
# Test build local
npm run build

# Run dev server local
npm run dev

# Deploy to Vercel
./deploy.sh

# Or manual
vercel --prod

# Check logs
vercel logs [deployment-url]

# Add env variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

### Important URLs:

- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/imamabdrsyd/hillside-studio-v2

---

## ✅ DEPLOYMENT CHECKLIST:

- [ ] Supabase project created
- [ ] SQL schema executed
- [ ] Credentials copied
- [ ] `.env.local` updated
- [ ] Build test passed (`npm run build`)
- [ ] Vercel project created
- [ ] Environment variables added in Vercel
- [ ] Deployed successfully
- [ ] Application loads
- [ ] Can add transactions
- [ ] Data persists
- [ ] Charts work

---

## 🎉 SETELAH SUKSES:

1. **Bookmark** deployed URL
2. **Share** dengan tim (jika ada)
3. **Mulai input** transaksi real
4. **Monitor** di dashboard

---

**SIAP DEPLOY?**

```bash
./deploy.sh
```

**LET'S GO! 🚀**
