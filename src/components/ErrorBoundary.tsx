'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number;
}

/**
 * Error Boundary untuk menangkap error termasuk infinite loop
 * Mendeteksi jika error terjadi terlalu sering (indikasi infinite loop)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const timeSinceLastError = now - this.state.lastErrorTime;

    // Jika error terjadi dalam waktu < 1 detik sejak error terakhir,
    // kemungkinan ada infinite loop
    const newErrorCount = timeSinceLastError < 1000
      ? this.state.errorCount + 1
      : 1;

    this.setState({
      errorInfo,
      errorCount: newErrorCount,
      lastErrorTime: now,
    });

    // Log error
    if (newErrorCount > 5) {
      console.error(
        '⚠️ INFINITE ERROR LOOP TERDETEKSI!\n',
        'Error terjadi berulang kali dalam waktu singkat.\n',
        'Error:', error.message,
        '\nStack:', errorInfo.componentStack
      );
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isInfiniteLoop = this.state.errorCount > 5;

      // Jika ada custom fallback, gunakan itu
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isInfiniteLoop ? '⚠️ Infinite Loop Terdeteksi' : 'Terjadi Kesalahan'}
                </h1>
                <p className="text-slate-600 text-sm">
                  {isInfiniteLoop
                    ? 'Error terjadi berulang kali'
                    : 'Aplikasi mengalami error yang tidak terduga'}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-red-900 mb-2">Detail Error:</h2>
              <p className="text-red-700 text-sm font-mono break-words">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            {isInfiniteLoop && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">
                  🔄 Apa yang Terjadi?
                </h3>
                <p className="text-amber-800 text-sm mb-3">
                  Halaman mengalami <strong>infinite loop</strong> - error yang terjadi berulang kali
                  dalam waktu singkat. Ini biasanya disebabkan oleh:
                </p>
                <ul className="text-amber-800 text-sm space-y-1 list-disc list-inside">
                  <li>Request API yang gagal dan terus di-retry tanpa batas</li>
                  <li>Dependency yang tidak tepat di useEffect</li>
                  <li>State yang berubah terus-menerus (setState di render)</li>
                  <li>Koneksi database yang bermasalah</li>
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Apa yang Harus Dilakukan?</h3>

              <div className="space-y-2">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Coba Lagi (Reset Error)
                </button>

                <button
                  onClick={this.handleReload}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload Halaman
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl border-2 border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Halaman Sebelumnya
                </button>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 bg-slate-50 rounded-xl p-4">
                <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                  Stack Trace (Development Mode)
                </summary>
                <pre className="text-xs text-slate-600 overflow-auto whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
