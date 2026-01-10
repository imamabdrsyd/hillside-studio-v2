# 🚀 Deployment Checklist - Hillside Studio v2

## ✅ Pre-Deployment Checklist

### 1. Supabase Setup (Wajib!)
- [ ] Buat project di [supabase.com](https://supabase.com)
- [ ] Run SQL schema dari `sql/schema.sql`
- [ ] (Optional) Run sample data dari `sql/seed.sql`
- [ ] Copy Project URL dan Anon Key dari Settings → API

### 2. Environment Variables
- [ ] Update file `.env.local` dengan credentials Supabase:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```

### 3. Code Quality
- [ ] Run `npm run build` - pastikan success
- [ ] Check tidak ada TypeScript errors
- [ ] Test di local dengan `npm run dev`

### 4. Git Repository
- [ ] All changes sudah di-commit
- [ ] Push ke GitHub

---

## 🌐 Deployment ke Vercel

### Option A: Automated Script (Recommended)

```bash
./deploy.sh
```

Script ini akan:
1. ✅ Check Vercel CLI installed
2. ✅ Verify environment variables
3. ✅ Run build test
4. ✅ Deploy ke Vercel
5. ✅ Setup environment variables di Vercel

### Option B: Manual via Vercel Dashboard

#### Step 1: Login ke Vercel
1. Go to [vercel.com](https://vercel.com)
2. Login dengan GitHub account

#### Step 2: Import Project
1. Click **Add New** → **Project**
2. Select repository: `hillside-studio-v2`
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `./` (default)

#### Step 3: Environment Variables
**CRITICAL:** Tambahkan sebelum deploy!

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGc... | Production, Preview, Development |

#### Step 4: Deploy
1. Click **Deploy**
2. Wait ~2-3 minutes
3. Click deployed URL

### Option C: Vercel CLI

```bash
# 1. Login
vercel login

# 2. Deploy (preview)
vercel

# 3. Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# [paste value]

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# [paste value]

# 4. Deploy to production
vercel --prod
```

---

## 🧪 Post-Deployment Testing

### Test 1: Basic Load
- [ ] Open deployed URL
- [ ] Dashboard loads without errors
- [ ] No console errors in browser DevTools

### Test 2: Database Connection
- [ ] Stats cards show data (atau 0 jika database kosong)
- [ ] No "Failed to fetch" errors

### Test 3: CRUD Operations
- [ ] Go to **Transactions** page
- [ ] Click **Add Transaction**
- [ ] Fill form and submit
- [ ] Transaction appears in table
- [ ] Dashboard updates automatically

### Test 4: Navigation
- [ ] All sidebar menu items clickable
- [ ] Tab switching works smooth
- [ ] No broken links

### Test 5: Responsive Design
- [ ] Test di mobile (DevTools → mobile view)
- [ ] Test di tablet
- [ ] All components responsive

---

## 🔧 Troubleshooting

### Issue: Build Failed
**Error:** `Module not found` or TypeScript errors

**Fix:**
```bash
# Delete node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment Variables Not Working
**Symptom:** "Failed to fetch transactions" atau console errors

**Fix:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Make sure both variables ada dan value-nya benar
3. Redeploy: Deployments → ... → Redeploy

### Issue: Database Connection Failed
**Symptom:** Data tidak muncul, errors di console

**Fix:**
1. Check Supabase project masih aktif
2. Verify Project URL benar di environment variables
3. Check RLS policies di Supabase (Table Editor → Authentication)
4. Try disable RLS temporary untuk testing:
   ```sql
   ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
   ```

### Issue: 404 on Routes
**Symptom:** Refresh page → 404 error

**Fix:**
This shouldn't happen with Next.js, but if it does:
1. Check `vercel.json` configuration
2. Redeploy project

---

## 📊 Performance Optimization (Optional)

### After Successful Deployment:

1. **Enable Vercel Analytics**
   - Vercel Dashboard → Analytics → Enable

2. **Setup Custom Domain**
   - Vercel Dashboard → Settings → Domains
   - Add your domain (e.g., `hillside-studio.com`)

3. **Enable Speed Insights**
   - Vercel Dashboard → Speed Insights → Enable

4. **Optimize Images** (future)
   - Use Next.js Image component
   - Add image optimization

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Build completes without errors
✅ Application loads on Vercel URL
✅ Dashboard displays correctly
✅ Can add/edit/delete transactions
✅ Data persists in Supabase
✅ Charts render properly
✅ Responsive on mobile/tablet
✅ No console errors

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Project Issues:** Check `DEPLOYMENT.md` for detailed guide

---

**Version:** 2.0.0
**Last Updated:** 2026-01-10
