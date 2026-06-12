'use client'

import React from 'react'
import { GoogleTagManager } from '@next/third-parties/google'

interface RootLayoutWrapperProps {
  children: React.ReactNode
}

export default function RootLayoutWrapper({ children }: RootLayoutWrapperProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-71PJRNLKZY"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-71PJRNLKZY');
            `,
          }}
        />
      </head>
      <GoogleTagManager gtmId="GTM-T76SSRM7" />
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
