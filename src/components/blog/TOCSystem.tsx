'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlignLeft, ChevronUp } from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────── */
interface Heading {
  id: string
  text: string
  level: 2 | 3
}

interface TOCSystemProps {
  headings: Heading[]
  readingTime?: number
}

/* ─── Main component ─────────────────────────────────────── */
export default function TOCSystem({ headings, readingTime }: TOCSystemProps) {
  const [activeId, setActiveId]             = useState<string>(headings[0]?.id ?? '')
  const [completedIds, setCompletedIds]     = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [sectionProgress, setSectionProgress] = useState(0)

  /* ── Single IntersectionObserver for scroll spy ── */
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost currently-intersecting heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top
          )

        if (!visible.length) return

        const topId = visible[0].target.id
        setActiveId(topId)

        const idx = headings.findIndex(h => h.id === topId)
        if (idx > 0) {
          setCompletedIds(new Set(headings.slice(0, idx).map(h => h.id)))
        } else {
          setCompletedIds(new Set())
        }
        setSectionProgress(idx >= 0 ? (idx + 1) / headings.length : 0)
      },
      { rootMargin: '-8% 0px -72% 0px', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  /* ── Lock body scroll when mobile drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── Smooth scroll to heading ── */
  const scrollTo = useCallback((id: string, fromMobile = false) => {
    if (fromMobile) setMobileOpen(false)

    const execute = () => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 108
      window.scrollTo({ top, behavior: 'smooth' })
    }

    // Brief delay after drawer close so animation completes cleanly
    fromMobile ? setTimeout(execute, 360) : execute()
  }, [])

  const activeHeading = headings.find(h => h.id === activeId)
  const activeIndex   = headings.findIndex(h => h.id === activeId)

  if (!headings.length) return null

  /* ─── Shared TOC item renderer ─────────────────────────── */
  const TOCItem = ({
    heading,
    variant = 'desktop',
  }: {
    heading: Heading
    variant?: 'desktop' | 'mobile'
  }) => {
    const isActive    = heading.id === activeId
    const isCompleted = completedIds.has(heading.id)
    const isH3        = heading.level === 3

    if (variant === 'mobile') {
      return (
        <li className={isH3 ? 'pl-4' : ''}>
          <button
            onClick={() => scrollTo(heading.id, true)}
            className={`w-full text-left flex items-center gap-3 py-3 border-b border-luxury-graphite/40
              focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-amber
              ${isH3 ? 'py-2.5' : ''}`}
          >
            <span
              className={`w-1.5 h-1.5 shrink-0 transition-all duration-300 ${
                isActive
                  ? 'bg-luxury-amber scale-125'
                  : isCompleted
                  ? 'bg-luxury-amber/30'
                  : 'bg-luxury-graphite'
              }`}
              style={{ borderRadius: 0 }}
            />
            <span
              className={`font-outfit leading-snug transition-colors duration-300
                ${isH3 ? 'text-xs' : 'text-sm'}
                ${isActive
                  ? 'text-luxury-ivory font-medium'
                  : isCompleted
                  ? 'text-luxury-pearl/30'
                  : 'text-luxury-pearl/65'}`}

                dangerouslySetInnerHTML={{ __html: heading.text }}
            >
              {/* {heading.text} */}
            </span>
          </button>
        </li>
      )
    }

    return (
      <li className={isH3 ? 'pl-3.5' : ''}>
        <button
          onClick={() => scrollTo(heading.id)}
          className={`group w-full text-left flex items-start gap-3 py-2
            transition-all duration-200 text-ellipsis 
            focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-amber
            ${isH3 ? 'py-1.5' : ''}`}
        >
          {/* Animated vertical indicator */}
          <div className="pt-1.5 shrink-0" style={{ width: 10 }}>
            <motion.div
              animate={{
                height: isActive ? 20 : 7,
                backgroundColor: isActive
                  ? '#C9A962'
                  : isCompleted
                  ? 'rgba(201,169,98,0.32)'
                  : 'rgba(13,13,13,0.12)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ width: 1.5 }}
            />
          </div>

          {/* Label */}
          <span
            className={`leading-snug transition-all duration-250 text-ellipsis overflow-hidden
              ${isH3 ? 'text-xs' : 'text-sm font-outfit'}
              ${isActive
                ? 'text-luxury-midnight font-medium'
                : isCompleted
                ? 'text-luxury-midnight/32'
                : 'text-luxury-midnight/52 group-hover:text-luxury-midnight/80 group-hover:translate-x-0.5'}`}
          >
            {isActive && (
              <motion.span
                layoutId="toc-dot"
                className="inline-block w-1 h-1 bg-luxury-amber mr-1.5 align-middle mb-px"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {/* {heading.text} */}
            <span className="text-wrap" dangerouslySetInnerHTML={{ __html: heading.text }} />
          </span>
        </button>
      </li>
    )
  }

  /* ─── Circumference for mini ring ───────────────────────── */
  const ringR = 10
  const ringC = 2 * Math.PI * ringR

  return (
    <>
      {/* ══════════════ DESKTOP SIDEBAR TOC ════════════════ */}
      <div className="hidden lg:block">
        <nav aria-label="Article table of contents">

          {/* Header row */}
          <div className="flex items-center gap-3 mb-4 mt-4 text-luxury-charcoal">
            <div className="w-5 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: '0.2em' }}
            >
              Contents
            </span>
            {readingTime && (
              <span
                className="ml-auto font-mono text-luxury-midnight/22 text-xs"
                style={{ letterSpacing: '0.1em' }}
              >
                {readingTime} min
              </span>
            )}
          </div>

          {/* Section progress track */}
          <div className="mb-1">
            <div className="h-px bg-luxury-midnight/8 overflow-hidden">
              <motion.div
                className="h-full bg-luxury-amber"
                animate={{ width: `${sectionProgress * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span
                className="font-mono text-luxury-midnight/22 text-xs"
                style={{ fontSize: '9px', letterSpacing: '0.1em' }}
              >
                {activeIndex >= 0
                  ? `${String(activeIndex + 1).padStart(2, '0')} / ${String(headings.length).padStart(2, '0')}`
                  : `— / ${String(headings.length).padStart(2, '0')}`}
              </span>
              {completedIds.size > 0 && (
                <span
                  className="font-mono text-luxury-amber/40 text-xs"
                  style={{ fontSize: '9px', letterSpacing: '0.08em' }}
                >
                  {completedIds.size} done
                </span>
              )}
            </div>
          </div>

          {/* Rule */}
          <div className="h-px bg-luxury-midnight/6 my-3" />

          {/* List */}
          <ol className="list-none space-y-0 text-luxury-charcoal">
            {headings.map(h => <TOCItem key={h.id} heading={h} variant="desktop" />)}
          </ol>
        </nav>
      </div>

      {/* ══════════════ MOBILE STICKY BAR ══════════════════ */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 320, damping: 32 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-3 mb-3 bg-luxury-midnight/97 backdrop-blur-lg border border-luxury-graphite shadow-2xl shadow-black/40">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open table of contents"
            aria-expanded={mobileOpen}
            className="w-full flex items-center gap-3 px-4 py-3 text-left
              focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-amber"
          >
            <AlignLeft size={13} className="text-luxury-amber/60 shrink-0" aria-hidden="true" />

            {/* Current section info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-mono text-luxury-amber/45 uppercase leading-none"
                style={{ fontSize: '0.6rem', letterSpacing: '0.18em' }}
              >
                {activeHeading ? 'Now reading' : 'Contents'}
              </p>
              <p className="font-outfit text-luxury-ivory/85 text-xs truncate mt-0.5 leading-snug">
                {activeHeading?.text ?? 'Table of Contents'}
              </p>
            </div>

            {/* Mini progress ring */}
            <svg
              width="26" height="26"
              viewBox={`0 0 ${ringR * 2 + 6} ${ringR * 2 + 6}`}
              className="-rotate-90 shrink-0"
              aria-hidden="true"
            >
              <circle
                cx={ringR + 3} cy={ringR + 3} r={ringR}
                fill="none" stroke="rgba(45,45,45,0.8)" strokeWidth="1.5"
              />
              <circle
                cx={ringR + 3} cy={ringR + 3} r={ringR}
                fill="none" stroke="#C9A962" strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${ringC}`}
                strokeDashoffset={`${ringC * (1 - sectionProgress)}`}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>

            <ChevronUp size={12} className="text-luxury-pearl/25 shrink-0" aria-hidden="true" />
          </button>

          {/* Amber progress strip */}
          <div className="h-px bg-luxury-graphite/80">
            <div
              className="h-full bg-luxury-amber"
              style={{ width: `${sectionProgress * 100}%`, transition: 'width 0.4s ease' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ══════════════ MOBILE DRAWER ═══════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="lg:hidden fixed inset-0 z-50 bg-luxury-midnight/72 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Table of contents"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.38, ease: [0.32, 0, 0.15, 1] }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                bg-luxury-charcoal border-t border-luxury-graphite
                max-h-[72vh] flex flex-col"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-8 h-0.5 bg-luxury-graphite" />
              </div>

              {/* Sheet header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-luxury-graphite shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-luxury-amber" />
                  <span
                    className="font-mono text-luxury-amber text-xs uppercase"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    Contents
                  </span>
                </div>

                {/* Section counter */}
                <div className="flex items-center gap-3">
                  {readingTime && (
                    <span
                      className="font-mono text-luxury-pearl/25 text-xs"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {readingTime} min read
                    </span>
                  )}
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close table of contents"
                    className="w-7 h-7 flex items-center justify-center
                      text-luxury-pearl/35 hover:text-luxury-amber
                      transition-colors duration-200
                      focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-amber"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto px-6 py-2 overscroll-contain">
                <ol className="list-none">
                  {headings.map(h => <TOCItem key={h.id} heading={h} variant="mobile" />)}
                </ol>
                {/* Bottom breathing room */}
                <div className="h-4" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}