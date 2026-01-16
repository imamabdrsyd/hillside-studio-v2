'use client'

import { useState, useEffect, useRef } from 'react'
import { X, User, Mail, Shield, Camera, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleBadge } from '../auth/RoleBadge'
import Image from 'next/image'

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
    if (profile?.avatar_url) {
      setPreviewUrl(profile.avatar_url)
    }
  }, [profile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Format tidak didukung. Gunakan JPG, PNG, atau WEBP' })
      return
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setMessage({ type: 'error', text: 'Ukuran file terlalu besar. Maksimal 2MB' })
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setMessage(null)
  }

  const uploadAvatar = async (): Promise<boolean> => {
    if (!selectedFile) return true // No file to upload

    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupload foto')
      }

      return true
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
      return false
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true)
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus foto')
      }

      setPreviewUrl(null)
      setSelectedFile(null)
      setMessage({ type: 'success', text: 'Foto berhasil dihapus' })
      await refreshProfile()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Get user initials
  const getInitials = (name?: string | null) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Nama tidak boleh kosong' })
      return
    }

    setLoading(true)

    try {
      // Upload avatar if selected
      if (selectedFile) {
        const uploadSuccess = await uploadAvatar()
        if (!uploadSuccess) {
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupdate profile')
      }

      setMessage({ type: 'success', text: 'Profile berhasil diupdate!' })
      setSelectedFile(null)

      // Refresh profile after short delay
      setTimeout(() => {
        refreshProfile()
      }, 500)

      // Close modal after success
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 1500)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMessage(null)
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
    // Reset preview to original avatar
    setPreviewUrl(profile?.avatar_url || null)
    setSelectedFile(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Pengaturan Profile</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Profile Photo Section */}
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold text-emerald-600">
                    {getInitials(profile?.full_name)}
                  </span>
                )}
              </div>
              {/* Camera button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-lg disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info & Actions */}
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-slate-500 truncate">{user?.email}</p>
              {profile?.role && (
                <div className="mt-1">
                  <RoleBadge role={profile.role} size="sm" />
                </div>
              )}
            </div>

            {/* Remove avatar button */}
            {(previewUrl || profile?.avatar_url) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Hapus foto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload hint */}
          <p className="mt-3 text-xs text-slate-500 text-center">
            Klik ikon kamera untuk mengganti foto. Max 2MB (JPG, PNG, WEBP)
          </p>

          {/* Selected file indicator */}
          {selectedFile && (
            <p className="mt-2 text-xs text-emerald-600 text-center">
              Foto baru dipilih: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Email tidak dapat diubah</p>
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Role
            </label>
            <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50">
              <Shield className="w-5 h-5 text-slate-400" />
              {profile?.role && <RoleBadge role={profile.role} size="md" />}
            </div>
            <p className="mt-1 text-xs text-slate-500">Role diatur oleh administrator</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploadingAvatar}
              className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploadingAvatar ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
