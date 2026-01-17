# 🚨 Quick Reference: Halaman Muter Terus (Infinite Loop)

## Keterangan Error

### ❓ Apa yang Terjadi?

Ketika halaman **"muter terus"** atau **loading tidak berhenti**, artinya aplikasi mengalami **infinite loop** atau **timeout**:

| Gejala | Penjelasan |
|--------|------------|
| 🔄 **Spinner berputar terus** | Loading animation tidak berhenti lebih dari 30 detik |
| ⏰ **Timeout Error** | Muncul pesan "Request timeout setelah X detik" |
| ❌ **Error Berulang** | Console browser menampilkan error yang sama berkali-kali |
| 🐌 **Browser Lambat** | Tab menjadi tidak responsif, CPU usage tinggi |

---

## 🔍 Penyebab Umum

### 1. **Koneksi Bermasalah**
- Internet terputus atau sangat lambat
- Server database tidak merespons
- Firewall memblokir request

### 2. **Request Hang**
- API call tidak mendapat response
- Database query terlalu lama (lebih dari 25 detik)
- Server sedang down atau maintenance

### 3. **Bug di Kode** (untuk Developer)
- useEffect dengan dependency yang salah
- setState di dalam render loop
- Request tanpa timeout atau abort mechanism

---

## ✅ Solusi Cepat

### 🔧 Langkah 1-2-3

```
1️⃣ TUNGGU 30 DETIK
   → Aplikasi akan otomatis mendeteksi dan menampilkan error

2️⃣ REFRESH HALAMAN
   → Tekan F5 atau Ctrl+R (Windows)
   → Tekan Cmd+R (Mac)
   → Klik tombol "Refresh Halaman" pada error message

3️⃣ PERIKSA KONEKSI
   → Pastikan internet stabil
   → Coba buka website lain
```

### 🆘 Jika Masih Bermasalah

```
4️⃣ HARD RELOAD
   → Windows: Ctrl + Shift + R
   → Mac: Cmd + Shift + R

5️⃣ CLEAR CACHE
   → Chrome: Ctrl + Shift + Delete
   → Pilih "Cached images and files"
   → Klik "Clear data"

6️⃣ COBA BROWSER LAIN
   → Chrome, Firefox, Edge, atau Safari

7️⃣ RESTART BROWSER
   → Tutup semua tab
   → Buka browser lagi

8️⃣ HUBUNGI SUPPORT
   → Screenshot error message
   → Catat waktu kejadian
   → Laporkan ke tim IT/developer
```

---

## 📋 Pesan Error yang Mungkin Muncul

### 1. **"Loading terlalu lama"**
```
✅ Artinya: Halaman loading lebih dari 30 detik
✅ Solusi: Refresh halaman, periksa koneksi internet
```

### 2. **"Request timeout setelah 25 detik"**
```
✅ Artinya: API request tidak selesai dalam 25 detik
✅ Solusi: Server mungkin lambat, tunggu sebentar lalu refresh
```

### 3. **"Infinite loop terdeteksi"**
```
✅ Artinya: Error terjadi berulang kali dalam waktu singkat
✅ Solusi: Ada bug di kode, hubungi developer
```

### 4. **"Koneksi terlalu lama"**
```
✅ Artinya: Tidak bisa connect ke database/server
✅ Solusi: Periksa internet, tunggu beberapa menit
```

### 5. **"Gagal terhubung ke server"**
```
✅ Artinya: Server tidak dapat dijangkau
✅ Solusi: Periksa koneksi, server mungkin sedang maintenance
```

---

## 🛡️ Perlindungan Otomatis

Aplikasi ini sudah dilengkapi dengan perlindungan otomatis:

| Fitur | Fungsi | Waktu |
|-------|--------|-------|
| ⏱️ **Request Timeout** | Auto-cancel request yang terlalu lama | 25 detik |
| ⏰ **Loading Timeout** | Deteksi loading yang tidak selesai | 30 detik |
| 🛑 **AbortController** | Batalkan request saat pindah halaman | Otomatis |
| 🔄 **Loop Detection** | Deteksi useEffect yang loop | 5 detik |
| 🛡️ **Error Boundary** | Tangkap error dan prevent crash | Otomatis |

---

## 📱 Tampilan Error di Aplikasi

Ketika infinite loop terdeteksi, Anda akan melihat:

### ⚠️ Error Screen
```
┌────────────────────────────────────────┐
│ ⚠️  Terjadi Kesalahan                  │
│                                        │
│ [Detail Error Message]                 │
│                                        │
│ 🔄 Kemungkinan Penyebab:               │
│ • Koneksi internet terputus            │
│ • Server tidak merespons               │
│ • Request timeout                      │
│ • Infinite loop                        │
│                                        │
│ [🔄 Refresh Halaman]                   │
│ [❌ Tutup Pesan Error]                 │
└────────────────────────────────────────┘
```

### 🔄 Loading dengan Info
```
┌────────────────────────────────────────┐
│         [Spinner Animation]            │
│           Loading...                   │
│                                        │
│ Jika loading terlalu lama, halaman     │
│ akan otomatis menampilkan error        │
└────────────────────────────────────────┘
```

---

## 👨‍💻 Untuk Developer

### Debug Infinite Loop

1. **Buka Browser Console** (F12)
2. **Cari Warning Messages**:
   ```
   ⚠️ INFINITE LOOP TERDETEKSI di ComponentName!
   ⚠️ LOADING TIMEOUT!
   ⚠️ INFINITE ERROR LOOP TERDETEKSI!
   ```

3. **Periksa Stack Trace**
4. **Cek useEffect Dependencies**
5. **Verifikasi API Endpoints**

### Quick Fix Checklist

```typescript
// ✅ Gunakan timeout pada fetch
const response = await fetchWithTimeout('/api/data', {
  timeout: 10000
})

// ✅ Gunakan AbortController
const controller = new AbortController()
useEffect(() => {
  fetch('/api/data', { signal: controller.signal })
  return () => controller.abort()
}, [])

// ✅ Gunakan dependency array yang benar
useEffect(() => {
  fetchData()
}, [id]) // Hanya re-run jika id berubah

// ✅ Gunakan loading timeout detection
useLoadingTimeout(loading, {
  timeout: 30000,
  onTimeout: () => setError('Timeout!')
})
```

---

## 📞 Kontak Support

Jika masalah terus berlanjut:

1. **Screenshot** pesan error
2. **Catat** langkah-langkah yang menyebabkan error
3. **Buka** Browser Console (F12) dan screenshot error log
4. **Hubungi** tim developer dengan informasi di atas

---

## 🔗 Link Terkait

- [Dokumentasi Lengkap Infinite Loop Handling](./INFINITE_LOOP_HANDLING.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md) *(jika ada)*

---

**Terakhir diupdate**: 17 Januari 2026
**Versi**: 1.0.0
