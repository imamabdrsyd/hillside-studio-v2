# Setup Logo Hillside Studio

## Cara Upload Logo ke Project

Aplikasi sudah di-setup untuk menggunakan logo baru! Sekarang tinggal upload file logo-nya.

### Langkah 1: Save Logo File

1. **Save logo landscape** (yang ada text "Hillside Studio" + building + waves) sebagai file PNG
2. **Nama file**: `hillside-logo.png`
3. **Recommended size**:
   - Tinggi: 200-300px
   - Lebar: proportional (auto)
   - Background: Transparent (kalau bisa)

### Langkah 2: Upload ke Project

**Ada 2 cara:**

#### Cara A: Via Git (Recommended)

```bash
# 1. Copy logo file ke folder public/images/
cp /path/to/your/hillside-logo.png public/images/

# 2. Add dan commit
git add public/images/hillside-logo.png
git commit -m "Add: Hillside Studio logo"

# 3. Push ke repository
git push origin main
```

#### Cara B: Manual Upload ke GitHub

1. Buka repository di GitHub: `https://github.com/imamabdrsyd/hillside-studio-v2`
2. Navigate ke folder `public/images/`
3. Klik **"Add file"** → **"Upload files"**
4. Upload file `hillside-logo.png`
5. Commit dengan message: "Add: Hillside Studio logo"

### Langkah 3: Verify

Setelah logo di-upload dan deployed:

1. Buka aplikasi di browser
2. Logo baru seharusnya muncul di **Sidebar** (pojok kiri atas)
3. Kalau logo belum muncul:
   - Hard refresh: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
   - Clear browser cache
   - Tunggu deployment selesai di Vercel

### Fallback

Kalau logo file belum di-upload, aplikasi akan otomatis pakai logo lama (emoji 🏔️ + text) sebagai fallback.

## Format Logo yang Direkomendasikan

- **Format**: PNG (dengan transparent background) atau SVG
- **Dimensi**:
  - Landscape logo: Width ~600-800px, Height ~150-200px
  - Akan di-resize otomatis ke height 48px (3rem) di sidebar
- **File size**: < 100KB untuk optimal loading

## Troubleshooting

### Logo tidak muncul
- Pastikan nama file **persis**: `hillside-logo.png` (case-sensitive!)
- Pastikan file ada di `public/images/hillside-logo.png`
- Check browser console (F12) untuk error
- Vercel deployment harus include file logo (check di Vercel Dashboard → Deployments → Source)

### Logo terlalu besar/kecil
Edit di `src/components/Sidebar.tsx` line 50:
```tsx
className="h-12 w-auto object-contain"  // Ubah h-12 ke h-8, h-10, h-16, dll
```

### Mau pakai format SVG instead of PNG
Ganti line 48 di `src/components/Sidebar.tsx`:
```tsx
src="/images/hillside-logo.svg"  // Ganti .png ke .svg
```

---

**Note:** Kalau logo sudah di-upload dan masih tidak muncul, coba redeploy aplikasi di Vercel!
