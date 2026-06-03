'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting element
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the first one
          setActiveId(visibleEntries[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0.1 }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      // Offset for sticky header if exists
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (!headings.length) return null

  return (
    <nav className="sticky top-32 space-y-4">
      {/* <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-px bg-luxury-amber" />
        <span
          className="font-mono text-luxury-midnight/60 text-[10px] uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Contents
        </span>
      </div> */}
      <ul className="space-y-3 relative border-l border-luxury-midnight/5 pl-4">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <li
              key={heading.id}
              className={cn(
                'relative transition-all duration-300',
                heading.level === 3 ? 'ml-4' : ''
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeToC"
                  className="absolute -left-[17px] top-1.5 w-0.5 h-3 bg-luxury-amber"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  'block font-outfit text-sm leading-snug transition-colors duration-300',
                  isActive
                    ? 'text-luxury-amber font-medium'
                    : 'text-luxury-midnight/60 hover:text-luxury-midnight'
                )}
                dangerouslySetInnerHTML={{ __html: heading.text }}
              >
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
