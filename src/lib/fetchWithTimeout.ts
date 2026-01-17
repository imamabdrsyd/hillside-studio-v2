/**
 * Utility untuk melakukan fetch dengan timeout
 * Mencegah request yang hang terlalu lama (infinite loading)
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number; // dalam milliseconds
}

export class FetchTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchTimeoutError';
  }
}

/**
 * Melakukan fetch dengan timeout otomatis
 * @param url - URL yang akan di-fetch
 * @param options - Opsi fetch termasuk timeout (default: 30 detik)
 * @returns Promise dengan response atau error
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new FetchTimeoutError(
          `Request timeout setelah ${timeout / 1000} detik. Halaman terlalu lama loading, silakan coba lagi.`
        );
      }
    }

    throw error;
  }
}

/**
 * Helper untuk retry fetch dengan exponential backoff
 * @param fn - Function yang akan di-retry
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay awal dalam ms (default: 1000)
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Jika ini bukan retry terakhir, tunggu sebelum mencoba lagi
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw new Error(
    `Gagal setelah ${maxRetries} kali percobaan. Error: ${lastError!.message}`
  );
}
