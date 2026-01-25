import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook untuk mendeteksi infinite loop pada component
 * Berguna untuk mendeteksi jika useEffect terpanggil terlalu sering
 */
export function useInfiniteLoopDetection(
  componentName: string = 'Component',
  options: {
    maxExecutions?: number; // Maksimal eksekusi dalam window waktu tertentu
    timeWindow?: number; // Window waktu dalam ms (default: 5 detik)
    onDetected?: () => void; // Callback ketika loop terdeteksi
  } = {}
) {
  const {
    maxExecutions = 20,
    timeWindow = 5000,
    onDetected,
  } = options;

  const executionTimestamps = useRef<number[]>([]);
  const warningShown = useRef(false);

  useEffect(() => {
    const now = Date.now();

    // Tambahkan timestamp eksekusi saat ini
    executionTimestamps.current.push(now);

    // Filter hanya timestamp dalam window waktu yang ditentukan
    executionTimestamps.current = executionTimestamps.current.filter(
      timestamp => now - timestamp < timeWindow
    );

    // Cek apakah sudah melebihi batas
    if (executionTimestamps.current.length > maxExecutions) {
      if (!warningShown.current) {
        console.error(
          `⚠️ INFINITE LOOP TERDETEKSI di ${componentName}!\n` +
          `useEffect dipanggil ${executionTimestamps.current.length} kali dalam ${timeWindow / 1000} detik.\n` +
          `Kemungkinan ada dependency yang berubah terus-menerus atau missing dependency array.`
        );

        warningShown.current = true;

        if (onDetected) {
          onDetected();
        }
      }

      // Reset untuk menghindari spam console
      if (executionTimestamps.current.length > maxExecutions + 10) {
        executionTimestamps.current = [];
      }
    }
  });

  return {
    executionCount: executionTimestamps.current.length,
    isLooping: executionTimestamps.current.length > maxExecutions,
  };
}

/**
 * Hook untuk membatasi jumlah loading state
 * Mencegah loading yang tidak pernah selesai
 *
 * PENTING: Menggunakan ref untuk callback agar tidak menyebabkan infinite loop
 * ketika onTimeout diteruskan sebagai inline function
 */
export function useLoadingTimeout(
  isLoading: boolean,
  options: {
    timeout?: number; // Timeout dalam ms (default: 30 detik)
    onTimeout?: () => void; // Callback ketika timeout
  } = {}
) {
  const { timeout = 30000, onTimeout } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimedOut = useRef(false);

  // Gunakan ref untuk menyimpan callback terbaru
  // Ini mencegah infinite loop ketika onTimeout adalah inline function
  const onTimeoutRef = useRef(onTimeout);

  // Update ref setiap kali onTimeout berubah
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (isLoading) {
      hasTimedOut.current = false;

      // Set timer untuk timeout
      timerRef.current = setTimeout(() => {
        if (!hasTimedOut.current) {
          hasTimedOut.current = true;
          console.error(
            `⚠️ LOADING TIMEOUT!\n` +
            `Halaman masih loading setelah ${timeout / 1000} detik.\n` +
            `Kemungkinan terjadi infinite loop atau request yang hang.`
          );

          // Panggil callback dari ref (bukan dari closure)
          if (onTimeoutRef.current) {
            onTimeoutRef.current();
          }
        }
      }, timeout);
    } else {
      // Clear timer jika loading selesai
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      hasTimedOut.current = false;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading, timeout]); // PENTING: onTimeout TIDAK termasuk dalam dependency array

  return hasTimedOut.current;
}
