'use client'

import React from 'react'
import { usePasswordValidation } from '@/hooks/usePasswordValidation'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const validation = usePasswordValidation(password)

  if (!password) return null

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-amber-500',
    strong: 'bg-emerald-500',
  }

  const strengthText = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  }

  const strengthTextColors = {
    weak: 'text-red-600',
    medium: 'text-amber-600',
    strong: 'text-emerald-600',
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-600">Password Strength</span>
          <span
            className={`text-xs font-bold ${strengthTextColors[validation.strength]}`}
          >
            {strengthText[validation.strength]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                level <=
                (validation.strength === 'weak' ? 1 : validation.strength === 'medium' ? 2 : 4)
                  ? strengthColors[validation.strength]
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        <Requirement met={validation.hasMinLength} text="At least 8 characters" />
        <Requirement met={validation.hasUpperCase} text="One uppercase letter" />
        <Requirement met={validation.hasLowerCase} text="One lowercase letter" />
        <Requirement met={validation.hasNumber} text="One number" />
      </div>
    </div>
  )
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
          met ? 'bg-emerald-500' : 'bg-slate-200'
        }`}
      >
        {met && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className={`text-xs ${met ? 'text-slate-700' : 'text-slate-400'}`}>
        {text}
      </span>
    </div>
  )
}
