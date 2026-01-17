# 🔄 Penanganan Infinite Loop & Loading Timeout

## 📋 Daftar Isi
1. [Apa itu Infinite Loop?](#apa-itu-infinite-loop)
2. [Gejala & Tanda-tanda](#gejala--tanda-tanda)
3. [Penyebab Umum](#penyebab-umum)
4. [Solusi untuk Pengguna](#solusi-untuk-pengguna)
5. [Mekanisme Perlindungan](#mekanisme-perlindungan)
6. [Untuk Developer](#untuk-developer)

---

## Apa itu Infinite Loop?

**Infinite Loop** adalah kondisi dimana halaman web terus melakukan proses yang sama berulang-ulang tanpa henti, menyebabkan:
- Loading yang tidak pernah selesai (spinner berputar terus)
- Halaman menjadi tidak responsif
- Browser menjadi lambat atau hang
- Penggunaan CPU/memori yang tinggi

---

## Gejala & Tanda-tanda

### ✅ Tanda-tanda Halaman Mengalami Infinite Loop:

1. **Loading Spinner Tidak Berhenti**
   - Animasi loading berputar lebih dari 30 detik
   - Tidak ada perubahan atau progress

2. **Console Browser Menampilkan Error Berulang**
   - Pesan error yang sama muncul terus-menerus
   - Console dipenuhi log yang sama

3. **Tab Browser Menjadi Lambat**
   - Tab menggunakan CPU tinggi
   - Browser menjadi tidak responsif

4. **Pesan Error Timeout**
   - "Request timeout setelah X detik"
   - "Loading terlalu lama"
   - "Infinite loop terdeteksi"

---

## Penyebab Umum

### 1. **Request API yang Hang**
```
❌ Request ke database tidak mendapat response
❌ Koneksi internet terputus saat fetching data
❌ Server tidak merespons dalam waktu yang wajar
```

### 2. **useEffect Dependency Issues** (Untuk Developer)
```javascript
// ❌ SALAH - Infinite loop
useEffect(() => {
  setData({ ...data, updated: true })
}, [data]) // data berubah → trigger useEffect → data berubah lagi

// ✅ BENAR - Tidak loop
useEffect(() => {
  fetchData()
}, []) // Hanya run sekali saat mount
```

### 3. **Koneksi Database Bermasalah**
```
❌ Supabase URL tidak valid
❌ Database credentials salah
❌ Database server down atau maintenance
```

### 4. **Network Issues**
```
❌ Koneksi internet lambat atau terputus
❌ Firewall memblokir request
❌ DNS resolution gagal
```

---

## Solusi untuk Pengguna

### 🚨 Langkah-langkah Ketika Halaman "Muter Terus"

#### 1️⃣ **Tunggu hingga Timeout Otomatis (30 detik)**
   - Aplikasi akan otomatis mendeteksi loading yang terlalu lama
   - Setelah 30 detik, akan muncul pesan error dengan opsi recovery

#### 2️⃣ **Refresh/Reload Halaman**
   ```
   Cara 1: Tekan tombol "Refresh Halaman" pada error message
   Cara 2: Tekan F5 atau Ctrl+R (Windows) / Cmd+R (Mac)
   Cara 3: Klik icon refresh di browser
   ```

#### 3️⃣ **Periksa Koneksi Internet**
   - Pastikan device terhubung ke internet
   - Coba buka website lain untuk memastikan koneksi stabil
   - Reset WiFi/router jika perlu

#### 4️⃣ **Clear Browser Cache**
   ```
   Chrome/Edge:
   - Tekan Ctrl+Shift+Delete
   - Pilih "Cached images and files"
   - Klik "Clear data"

   Firefox:
   - Tekan Ctrl+Shift+Delete
   - Pilih "Cache"
   - Klik "Clear Now"
   ```

#### 5️⃣ **Coba Browser Lain**
   - Buka aplikasi di browser berbeda (Chrome, Firefox, Edge, Safari)
   - Jika berhasil, mungkin ada masalah di browser lama

#### 6️⃣ **Hard Reload (Force Refresh)**
   ```
   Windows: Ctrl + Shift + R atau Ctrl + F5
   Mac: Cmd + Shift + R
   ```
   Ini akan reload halaman tanpa menggunakan cache

#### 7️⃣ **Restart Browser**
   - Tutup semua tab dan window browser
   - Buka browser kembali
   - Akses aplikasi lagi

#### 8️⃣ **Hubungi Administrator/Developer**
   Jika masalah tetap terjadi setelah langkah di atas, kemungkinan ada masalah di sisi server:
   - Screenshot pesan error
   - Catat waktu kejadian
   - Laporkan ke tim IT/developer

---

## Mekanisme Perlindungan

Aplikasi ini dilengkapi dengan beberapa mekanisme perlindungan otomatis:

### ✅ 1. **Request Timeout (25 detik)**
- Semua API request otomatis dibatalkan jika tidak selesai dalam 25 detik
- Mencegah request yang hang forever

### ✅ 2. **Loading Timeout Detection (30 detik)**
- Halaman otomatis mendeteksi jika loading lebih dari 30 detik
- Menampilkan pesan error dengan opsi recovery

### ✅ 3. **AbortController**
- Request otomatis dibatalkan ketika user meninggalkan halaman
- Mencegah memory leak dan background request yang tidak perlu

### ✅ 4. **Infinite Loop Detection Hook**
- Mendeteksi jika useEffect dipanggil terlalu sering (>20x dalam 5 detik)
- Memberikan warning di console untuk developer

### ✅ 5. **Error Boundary**
- Menangkap error yang tidak tertangani
- Mendeteksi infinite error loop (error berulang dalam <1 detik)
- Memberikan UI recovery yang user-friendly

---

## Untuk Developer

### 📦 Utilities yang Tersedia

#### 1. **`fetchWithTimeout()`**
```typescript
import { fetchWithTimeout } from '@/lib/fetchWithTimeout'

// Fetch dengan timeout 10 detik
const response = await fetchWithTimeout('/api/data', {
  timeout: 10000,
  method: 'GET'
})
```

#### 2. **`fetchWithRetry()`**
```typescript
import { fetchWithRetry } from '@/lib/fetchWithTimeout'

// Retry hingga 3 kali dengan exponential backoff
const data = await fetchWithRetry(
  async () => {
    const res = await fetch('/api/data')
    return res.json()
  },
  3, // maxRetries
  1000 // initial delay (1 detik)
)
```

#### 3. **`useLoadingTimeout()`**
```typescript
import { useLoadingTimeout } from '@/hooks/useInfiniteLoopDetection'

const [loading, setLoading] = useState(true)

useLoadingTimeout(loading, {
  timeout: 30000,
  onTimeout: () => {
    setError('Loading terlalu lama')
    setLoading(false)
  }
})
```

#### 4. **`useInfiniteLoopDetection()`**
```typescript
import { useInfiniteLoopDetection } from '@/hooks/useInfiniteLoopDetection'

useInfiniteLoopDetection('MyComponent', {
  maxExecutions: 20,
  timeWindow: 5000,
  onDetected: () => {
    console.error('Infinite loop detected!')
  }
})
```

#### 5. **`<ErrorBoundary>`**
```typescript
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### 🛠️ Best Practices

#### ✅ DO:
```typescript
// 1. Gunakan AbortController
const controller = new AbortController()
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/data', {
      signal: controller.signal
    })
  }
  fetchData()
  return () => controller.abort()
}, [])

// 2. Set timeout pada Promise
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 25000)
)
const data = await Promise.race([fetchPromise, timeoutPromise])

// 3. Gunakan dependency array yang tepat
useEffect(() => {
  fetchData()
}, [id]) // Hanya re-run jika id berubah
```

#### ❌ DON'T:
```typescript
// 1. JANGAN set state di dependency yang sama
useEffect(() => {
  setData({ ...data, updated: true })
}, [data]) // ❌ Infinite loop!

// 2. JANGAN fetch tanpa cleanup
useEffect(() => {
  fetch('/api/data') // ❌ Tidak ada abort/cleanup
}, [])

// 3. JANGAN nested setState
const updateData = () => {
  setData(prevData => {
    setOtherData(prevData) // ❌ Don't nest setState
    return newData
  })
}
```

### 📊 Monitoring

Buka browser console untuk melihat warnings:
```
⚠️ INFINITE LOOP TERDETEKSI di ComponentName!
useEffect dipanggil 25 kali dalam 5 detik.
Kemungkinan ada dependency yang berubah terus-menerus.

⚠️ LOADING TIMEOUT!
Halaman masih loading setelah 30 detik.
Kemungkinan terjadi infinite loop atau request yang hang.

⚠️ INFINITE ERROR LOOP TERDETEKSI!
Error terjadi berulang kali dalam waktu singkat.
```

---

## 📞 Support

Jika masalah berlanjut:
1. Check browser console untuk detail error
2. Screenshot pesan error
3. Catat langkah-langkah yang menyebabkan error
4. Hubungi tim developer dengan informasi di atas

---

## 📝 Changelog

### v1.0.0 (2025-01-17)
- ✅ Implementasi `fetchWithTimeout()` utility
- ✅ Implementasi `useLoadingTimeout()` hook
- ✅ Implementasi `useInfiniteLoopDetection()` hook
- ✅ Implementasi `ErrorBoundary` component
- ✅ Update dashboard page dengan timeout protection
- ✅ Dokumentasi lengkap infinite loop handling

---

**Dibuat oleh**: Hillside Studio Development Team
**Terakhir diupdate**: 17 Januari 2026
