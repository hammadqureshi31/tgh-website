'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { openBooksyWidget } from '@/lib/utils'

export default function MobileBookingButton() {
  const [visible, setVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHydrated])

  const handleClick = () => {
    openBooksyWidget()
  }

  if (!isHydrated) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-4 right-4 z-40 sm:hidden"
        >
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-3 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm uppercase tracking-wide shadow-xl shadow-luxury-amber/20 active:scale-98 transition-transform"
            style={{ letterSpacing: '0.12em' }}
          >
            <CalendarCheck size={16} />
            Book Appointment
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
