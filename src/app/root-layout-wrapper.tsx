'use client'

import React from 'react'
import { GoogleTagManager } from '@next/third-parties/google'

interface RootLayoutWrapperProps {
  children: React.ReactNode
}

export default function RootLayoutWrapper({ children }: RootLayoutWrapperProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-T76SSRM7" />
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
