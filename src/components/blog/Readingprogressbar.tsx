'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReadingProgressBarProps {
  /** ID of the article element to track */
  articleId?: string
  /** Post reading time in minutes */
  readingTime?: number
}

export default function ReadingProgressBar({
  articleId = 'article-body',
  readingTime,
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const compute = () => {
      const el = document.getElementById(articleId)
      if (!el) return

      const { top, height } = el.getBoundingClientRect()
      const scrolled = -top
      const trackable = height - window.innerHeight

      const pct = trackable > 0
        ? Math.max(0, Math.min(1, scrolled / trackable))
        : 0

      setProgress(pct)
      // Show bar once we've scrolled past the page header
      setStarted(scrolled > -(window.innerHeight * 0.05))
    }

    window.addEventListener('scroll', compute, { passive: true })
    compute()
    return () => window.removeEventListener('scroll', compute)
  }, [articleId])

  const minutesLeft = readingTime
    ? Math.max(1, Math.ceil(readingTime * (1 - progress)))
    : 0
  const done = progress >= 0.98
  const circumference = 2 * Math.PI * 14 // r=14

  return (
    <>
      {/* ── Fixed amber progress line — very top of viewport ── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[200] h-[2px]
          transition-opacity duration-500 pointer-events-none
          ${started ? 'opacity-100' : 'opacity-0'}`}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX: progress,
            background:
              'linear-gradient(90deg, #C9A962 0%, #B8956E 50%, #C9A962 100%)',
          }}
          transition={{ duration: 0.12, ease: 'linear' }}
        />
      </div>

      {/* ── Floating reading status — desktop, bottom-right ── */}
      <AnimatePresence>
        {started && readingTime && (
          <motion.aside
            role="status"
            aria-label={done ? 'Article complete' : `${minutesLeft} minutes remaining`}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-8 right-8 z-40 hidden lg:flex items-center gap-4
              bg-luxury-midnight/96 backdrop-blur-md
              border border-luxury-graphite/80
              px-5 py-3.5 shadow-2xl shadow-black/40"
          >
            {/* Circular SVG progress */}
            <div className="relative w-9 h-9 shrink-0">
              <svg
                width="36" height="36"
                viewBox="0 0 36 36"
                className="-rotate-90"
                aria-hidden="true"
              >
                {/* Track */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="rgba(45,45,45,0.9)"
                  strokeWidth="2"
                />
                {/* Progress arc */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#C9A962"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference * (1 - progress)}`}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              {/* Percentage label */}
              <span
                className="absolute inset-0 flex items-center justify-center
                  font-mono text-luxury-amber leading-none"
                style={{ fontSize: '8px', letterSpacing: '-0.02em' }}
              >
                {Math.round(progress * 100)}
              </span>
            </div>

            {/* Text + progress bar */}
            <div className="flex flex-col gap-1.5 min-w-[80px]">
              <p
                className="font-mono text-luxury-charcoal leading-none"
                style={{ fontSize: '10px', letterSpacing: '0.12em' }}
              >
                {done ? 'Article complete' : `${minutesLeft} min left`}
              </p>
              <div className="h-px bg-luxury-graphite overflow-hidden w-full">
                <div
                  className="h-full bg-luxury-amber"
                  style={{
                    width: `${progress * 100}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}