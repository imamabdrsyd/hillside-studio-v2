import { useMemo } from 'react'
import { PasswordValidation } from '@/types/auth'

export function usePasswordValidation(password: string): PasswordValidation {
  return useMemo(() => {
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    const validCount = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(
      Boolean
    ).length

    let strength: 'weak' | 'medium' | 'strong' = 'weak'
    if (validCount === 4) {
      strength = 'strong'
    } else if (validCount >= 2) {
      strength = 'medium'
    }

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber

    return {
      isValid,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      strength,
    }
  }, [password])
}
