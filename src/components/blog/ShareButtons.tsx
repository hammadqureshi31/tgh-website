'use client'

import { useState, useEffect } from 'react'
import { Link as LinkIcon, Twitter, Check } from 'lucide-react'

// Simple custom WhatsApp icon since lucide-react doesn't have a specific brand icon
const WhatsAppIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

interface ShareButtonsProps {
  title: string
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank')
  }

  const handleWhatsAppShare = () => {
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(`${title} ${url}`)}`
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-luxury-midnight/60 text-xs uppercase" style={{ letterSpacing: '0.1em' }}>
        Share Article
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 rounded-full text-luxury-midnight/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110"
          aria-label="Copy link"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} />}
        </button>
        <button
          onClick={handleTwitterShare}
          className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 rounded-full text-luxury-midnight/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110"
          aria-label="Share on X"
        >
          <Twitter size={18} />
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 rounded-full text-luxury-midnight/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon size={18} />
        </button>
      </div>
    </div>
  )
}
