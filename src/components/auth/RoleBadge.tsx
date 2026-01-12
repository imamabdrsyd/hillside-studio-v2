import React from 'react'
import { RoleBadgeProps, roleDisplayNames, roleColors } from '@/types/auth'

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  const colors = roleColors[role]

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold border
        ${colors.bg} ${colors.text} ${colors.border}
        ${sizeClasses[size]}
      `}
    >
      {roleDisplayNames[role]}
    </span>
  )
}
