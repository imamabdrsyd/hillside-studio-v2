# Setup Supabase untuk Hillside Studio v2

## Langkah-langkah Setup

### 1. Buat Database Schema

1. Buka **Supabase Dashboard** di https://supabase.com/dashboard
2. Pilih project kamu (atau buat project baru)
3. Pergi ke **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy semua isi file `sql/schema.sql` dan paste ke SQL Editor
6. Klik **Run** atau tekan `Ctrl+Enter`

### 2. Fix RLS Policies untuk Demo

Secara default, schema menggunakan Row Level Security (RLS) yang memerlukan authentication. Untuk demo/development, kita perlu mengubah policies:

1. Masih di **SQL Editor**, buat query baru
2. Copy semua isi file `sql/fix-rls-for-demo.sql` dan paste
3. Klik **Run**

**Catatan:** Ini hanya untuk demo/development. Untuk production, implement proper Supabase Auth!

### 3. (Opsional) Seed Data

Jika ingin menambahkan data sample:

1. Di **SQL Editor**, buat query baru
2. Copy isi file `sql/seed.sql` dan paste
3. Klik **Run**

### 4. Verifikasi Setup

Jalankan query ini untuk memastikan tabel sudah dibuat:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

Kamu harus melihat tabel: `transactions`, `users`, `assets`, `bookings`, `settings`

### 5. Test Connection

1. Buka aplikasi kamu di browser
2. Banner kuning "Supabase Belum Dikonfigurasi" seharusnya **TIDAK muncul**
3. Coba tambahkan transaction baru
4. Jika berhasil, setup sudah selesai! ✅

## Troubleshooting

### Masalah: "Failed to add transaction"

**Penyebab:** RLS policies masih restrictive

**Solusi:** Jalankan `sql/fix-rls-for-demo.sql` di SQL Editor

### Masalah: Banner kuning masih muncul

**Penyebab:** Environment variables belum di-set atau aplikasi belum redeploy

**Solusi:**
1. Pastikan environment variables sudah di-set di Vercel
2. Trigger redeploy dengan push commit baru
3. Hard refresh browser (`Ctrl+Shift+R` atau `Cmd+Shift+R`)

### Masalah: "relation 'transactions' does not exist"

**Penyebab:** Database schema belum dijalankan

**Solusi:** Jalankan `sql/schema.sql` di SQL Editor

## Security Notes

⚠️ **PENTING untuk Production:**

File `sql/fix-rls-for-demo.sql` mengizinkan **public access** tanpa authentication. Ini **TIDAK AMAN** untuk production!

Untuk production, kamu harus:
1. Implementasi Supabase Auth (login/register)
2. Gunakan RLS policies yang ada di `sql/schema.sql` (yang memerlukan authentication)
3. Pastikan hanya superadmin yang bisa insert/update/delete

## Environment Variables yang Diperlukan

Di Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://yeocvqsmydgfbjvzbzhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Dapatkan values ini dari:
Supabase Dashboard → Settings → API → Project URL dan anon/public key
