'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { usePasswordValidation } from '@/hooks/usePasswordValidation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const passwordValidation = usePasswordValidation(formData.newPassword)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Password does not meet requirements'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const { error } = await updatePassword({
      newPassword: formData.newPassword,
    })

    if (error) {
      showToast(error.message, 'error')
      setLoading(false)
    } else {
      showToast('Password updated successfully!', 'success')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PasswordInput
            label="New Password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            error={errors.newPassword}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {formData.newPassword && (
            <div className="mt-3">
              <PasswordStrength password={formData.newPassword} />
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" loading={loading}>
          Update Password
        </Button>
      </form>
    </div>
  )
}
