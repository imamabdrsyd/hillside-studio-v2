# 🚀 Deployment Guide - Hillside Studio Finance App v2

## Quick Deploy Options

### Option 1: Vercel (Recommended - FREE)

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/hillside-studio-v2.git
   git push -u origin main
   ```

2. **Deploy ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub
   - Klik "Import Project"
   - Pilih repository `hillside-studio-v2`
   - Klik "Deploy"
   - Done! App akan live di `https://hillside-studio-v2.vercel.app`

### Option 2: Netlify (FREE)

1. Drag & drop folder project ke https://app.netlify.com/drop
2. Done!

### Option 3: GitHub Pages (FREE)

1. Push ke GitHub
2. Settings > Pages > Source: main branch
3. Done! Live di `https://USERNAME.github.io/hillside-studio-v2`

---

## Full-Stack Setup (dengan Supabase)

### Step 1: Setup Supabase

1. Buat akun di https://supabase.com
2. Create new project
3. Copy credentials:
   - Project URL: `https://xxx.supabase.co`
   - API Key (anon): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 2: Setup Database

1. Buka SQL Editor di Supabase Dashboard
2. Copy & paste isi file `sql/schema.sql`
3. Run
4. Copy & paste isi file `sql/seed.sql`
5. Run

### Step 3: Setup Auth

1. Supabase Dashboard > Authentication > Settings
2. Enable Email provider
3. (Optional) Enable Google OAuth:
   - Buat credentials di Google Cloud Console
   - Masukkan Client ID & Secret

### Step 4: Update Frontend

Tambahkan Supabase client di `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
</script>
```

### Step 5: Environment Variables (Vercel)

1. Vercel Dashboard > Project > Settings > Environment Variables
2. Add:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your anon key

---

## Mobile Access (iOS/macOS)

### Progressive Web App (PWA)

App sudah responsive dan bisa diakses di mobile browser. Untuk install sebagai PWA:

**iOS Safari:**
1. Buka app di Safari
2. Tap Share button
3. "Add to Home Screen"

**macOS Safari:**
1. Buka app di Safari
2. File > Add to Dock

### Native App (Future)

Untuk native app, bisa menggunakan:
- **Capacitor**: Wrap web app jadi native
- **React Native**: Full rewrite dengan shared logic

---

## Custom Domain

### Vercel
1. Vercel Dashboard > Project > Settings > Domains
2. Add domain: `finance.hillsidestudio.id`
3. Update DNS di registrar

### Cloudflare (Recommended)
1. Add site ke Cloudflare
2. Update nameservers
3. Add CNAME record ke Vercel

---

## Troubleshooting

### Build Error
```bash
# Clear cache
rm -rf node_modules
npm install
```

### CORS Error
- Pastikan Supabase URL sudah benar
- Cek RLS policies di Supabase

### Auth Not Working
- Cek email confirmation settings
- Verify redirect URLs di Supabase

---

## Support

- GitHub Issues: https://github.com/USERNAME/hillside-studio-v2/issues
- Email: imam@hillsidestudio.id
