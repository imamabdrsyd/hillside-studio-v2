# Fix: Environment Variables untuk Production

## Masalah
Environment variables hanya di-set untuk **Preview** environment, belum untuk **Production**.

Makanya:
- ✅ Preview deployment berfungsi (bisa add data)
- ❌ Production deployment tidak berfungsi (gagal add data)

## Solusi: Enable Environment Variables untuk Production

### Langkah 1: Edit Environment Variables di Vercel

1. Buka **Vercel Dashboard** → pilih project **hillside-studio-v2**
2. Pergi ke **Settings** → **Environment Variables**
3. Klik pada **NEXT_PUBLIC_SUPABASE_URL** (yang sudah ada)
4. Klik tombol **Edit** (icon pensil)
5. Di bagian "Environments", **CENTANG juga checkbox "Production"**
   - Sebelumnya: ☑️ Preview only
   - Sekarang: ☑️ Preview ☑️ Production
6. Klik **Save**
7. Ulangi langkah 3-6 untuk **NEXT_PUBLIC_SUPABASE_ANON_KEY**

### Langkah 2: Redeploy Production

Setelah environment variables di-update, kamu perlu redeploy production:

**Opsi A: Via Git Push (Recommended)**
```bash
# Push commit baru untuk trigger deployment
git commit --allow-empty -m "Trigger production redeploy with env vars"
git push origin main
```

**Opsi B: Via Vercel Dashboard**
1. Pergi ke **Deployments** tab
2. Cari deployment terakhir dari branch **main**
3. Klik tombol **⋯** (three dots) → **Redeploy**
4. Pastikan pilih environment: **Production** ✅
5. Klik **Redeploy**

### Langkah 3: Verify

1. Tunggu deployment selesai (1-2 menit)
2. Buka production URL: `https://hillside-studio-v2.vercel.app`
3. Banner kuning "Supabase Belum Dikonfigurasi" seharusnya **HILANG**
4. Coba add transaction baru
5. Seharusnya **BERHASIL**! ✅

## Checklist

- [ ] Edit NEXT_PUBLIC_SUPABASE_URL, centang Production
- [ ] Edit NEXT_PUBLIC_SUPABASE_ANON_KEY, centang Production
- [ ] Redeploy production (via git push atau Vercel dashboard)
- [ ] Tunggu deployment selesai
- [ ] Test add transaction di production URL
- [ ] Verify data masuk ke Supabase

## Troubleshooting

### Banner kuning masih muncul setelah redeploy
- Hard refresh browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
- Clear browser cache
- Coba buka di incognito/private window

### Masih gagal add transaction
- Cek console browser (F12) untuk error details
- Pastikan RLS sudah didisable di Supabase:
  ```sql
  -- Di Supabase SQL Editor
  ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
  ```
- Verify policies dengan:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'transactions';
  ```

## Notes

⚠️ **Perbedaan Preview vs Production:**
- **Preview**: Environment dari branch yang bukan main (misal: `claude/debug-error-fix-GrrGY`)
- **Production**: Environment dari branch `main`

Pastikan environment variables di-set untuk **KEDUA** environment agar berfungsi di semua deployment!
