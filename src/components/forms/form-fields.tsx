'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

/* ─── Input / Textarea / Select shared class builder ───────────── */
export function fieldClass(hasError: boolean) {
  return [
    'w-full px-5 py-4',
    'font-outfit text-sm text-luxury-ivory',
    'bg-luxury-graphite',
    'border border-transparent',
    hasError
      ? 'border-red-500/40 focus:ring-red-500/30'
      : 'border-luxury-graphite hover:border-luxury-amber/30 focus:border-luxury-amber',
    'focus:outline-none focus:ring-1 focus:ring-luxury-amber/40',
    'transition-all duration-300',
    'placeholder:text-luxury-pearl/25',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ')
}

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: React.ReactNode
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 mb-2">
      <span className="font-mono text-luxury-pearl/50 text-xs uppercase" style={{ letterSpacing: '0.18em' }}>
        {children}
      </span>
      {optional && (
        <span className="font-mono text-luxury-pearl/25 text-xs" style={{ letterSpacing: '0.12em' }}>
          — Optional
        </span>
      )}
    </label>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 font-outfit text-xs text-red-400/80">
      <span className="w-1 h-1 rounded-full bg-red-400/80 shrink-0" />
      {message}
    </p>
  )
}

export function SuccessState({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center border border-luxury-amber/15 bg-luxury-graphite/30"
    >
      <div className="relative mb-8">
        <div className="w-16 h-16 border border-luxury-amber/30 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-luxury-amber" />
        </div>
        <div className="absolute -inset-2 border border-luxury-amber/10" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-px bg-luxury-amber/40" />
        <span className="font-mono text-luxury-amber/60 text-xs uppercase" style={{ letterSpacing: '0.25em' }}>
          {eyebrow}
        </span>
        <div className="w-6 h-px bg-luxury-amber/40" />
      </div>

      <h3 className="font-playfair text-2xl md:text-3xl text-luxury-ivory mb-3">{title}</h3>
      <p className="font-outfit text-luxury-pearl/60 text-sm leading-relaxed max-w-sm">{description}</p>
    </motion.div>
  )
}
