'use client'

/**
 * BlogEditor — powered by react-quill-new (Quill 2)
 *
 * Install required packages:
 *   npm install react-quill-new quill-magic-url quill-image-drop-and-paste
 *
 * Optional peer deps already in most Next.js projects:
 *   highlight.js  (for syntax-highlighted code blocks)
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import dynamic from 'next/dynamic'
import type ReactQuillType from 'react-quill-new'

// ── CSS ──────────────────────────────────────────────────────────────────────
import 'react-quill-new/dist/quill.snow.css'

// ── Dynamic import (avoids SSR issues in Next.js) ────────────────────────────
const QuillEditor = dynamic(
  async () => {
    const { Quill } = await import('react-quill-new');

    // Register quill-magic-url so typed / pasted URLs auto-become links
    try {
      const { default: MagicUrl } = await import('quill-magic-url')
      ;(Quill as any).register('modules/magicUrl', MagicUrl)
    } catch (_) {
      /* optional – silently skip if not installed */
    }

    // Register drag-and-drop image paste module
    try {
      const { default: ImageDropAndPaste } = await import('quill-image-drop-and-paste')
      ;(Quill as any).register('modules/imageDropAndPaste', ImageDropAndPaste)
    } catch (_) {
      /* optional */
    }

    return import('./QuillEditorWrapper')
  },
  { ssr: false }
)

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
  onImageUpload?: (url: string) => void
  /** Max characters allowed (default 50 000) */
  charLimit?: number
  /** Show a "read time" badge in the footer */
  showReadTime?: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
}

function computeStats(html: string) {
  const text = stripHtml(html).trim()
  const characters = text.length
  const words = text ? text.split(/\s+/).length : 0
  const readMinutes = Math.max(1, Math.ceil(words / 200))
  return { characters, words, readMinutes }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BlogEditor({
  content,
  onChange,
  onImageUpload,
  charLimit = 50_000,
  showReadTime = true,
}: BlogEditorProps) {
  const quillRef = useRef<ReactQuillType | null>(null);
  const [stats, setStats] = useState(() => computeStats(content))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // ── Image upload via your existing /api/upload-image endpoint ───────────────
  const uploadImageFile = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: fd,
        })
        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        return url as string
      } catch (err) {
        console.error('Image upload error:', err)
        alert('Image upload failed. Please try again.')
        return null
      } finally {
        setIsUploading(false)
      }
    },
    []
  )

  // ── Custom image toolbar handler (file picker) ───────────────────────────
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,image/avif,image/gif'
    input.multiple = true
    input.click()

    input.onchange = async () => {
      const files = Array.from(input.files ?? [])
      const editor = (quillRef.current as any)?.getEditor?.()
      if (!editor || !files.length) return

      for (const file of files) {
        const url = await uploadImageFile(file)
        if (!url) continue

        const range = editor.getSelection(true)
        editor.insertEmbed(range.index, 'image', url)
        editor.setSelection(range.index + 1)
        onImageUpload?.(url)
      }
    }
  }, [uploadImageFile, onImageUpload])

  // ── Drag-and-drop image handler (quill-image-drop-and-paste) ─────────────
  const imageDropHandler = useCallback(
    async (
      imageDataUrl: string,
      type: string,
      imageData: { toFile: () => File }
    ) => {
      const file = imageData.toFile()
      const editor = (quillRef.current as any)?.getEditor?.()
      if (!editor) return

      const url = await uploadImageFile(file)
      if (!url) return

      const range = editor.getSelection(true)
      editor.insertEmbed(range?.index ?? 0, 'image', url)
      onImageUpload?.(url)
    },
    [uploadImageFile, onImageUpload]
  )

  // ── Quill modules ──────────────────────────────────────────────────────────
  const modules = useMemo(
    () => ({
      // ── Toolbar ────────────────────────────────────────────────────────────
      toolbar: {
        container: [
          // Headings & paragraph styles
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // Typography
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],

          // Inline marks
          ['bold', 'italic', 'underline', 'strike'],

          // Colour
          [{ color: [] }, { background: [] }],

          // Script
          [{ script: 'sub' }, { script: 'super' }],

          // Alignment
          [{ align: [] }],

          // Lists & indentation
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ indent: '-1' }, { indent: '+1' }],

          // Block-level
          ['blockquote', 'code-block'],

          // Media & links
          ['link', 'image', 'video', 'formula'],

          // Direction
          [{ direction: 'rtl' }],

          // Reset
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },

      // ── History (undo / redo) ──────────────────────────────────────────────
      history: {
        delay: 1500,
        maxStack: 500,
        userOnly: true,
      },

      // ── Clipboard ─────────────────────────────────────────────────────────
      clipboard: {
        matchVisual: false,
      },

      // ── Auto-link URLs while typing ───────────────────────────────────────
      magicUrl: {
        urlRegularExpression: /(https?:\/\/[\S]+)|(www\.[\S]+)/gi,
        globalRegularExpression: /(https?:\/\/[\S]+)|(www\.[\S]+)/gi,
      },

      // ── Drag & drop images directly into editor ───────────────────────────
      imageDropAndPaste: {
        handler: imageDropHandler,
      },
    }),
    [imageHandler, imageDropHandler]
  )

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'align',
    'list',
    'bullet',
    'check',
    'indent',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
    'formula',
    'direction',
  ]

  // ── Change handler ────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
      setStats(computeStats(value))
    },
    [onChange]
  )

  // ── Add tooltips to toolbar buttons ───────────────────────────────────────
  useEffect(() => {
    if (!quillRef.current) return

    const toolbar = (quillRef.current.getEditor() as any).getModule('toolbar')
      .container as HTMLElement

    const tooltips: { [key: string]: string } = {
      bold: 'Bold (Ctrl+B)',
      italic: 'Italic (Ctrl+I)',
      underline: 'Underline (Ctrl+U)',
      strike: 'Strikethrough',
      blockquote: 'Blockquote',
      'code-block': 'Code Block',
      link: 'Insert Link',
      image: 'Insert Image',
      video: 'Insert Video',
      formula: 'Insert Formula',
      clean: 'Clear Formatting',
      header: 'Heading Style',
      font: 'Font Family',
      size: 'Font Size',
      color: 'Text Color',
      background: 'Highlight Color',
      align: 'Text Alignment',
    }

    // Add tooltips to simple buttons and pickers
    for (const [format, tooltip] of Object.entries(tooltips)) {
      const button = toolbar.querySelector(`.ql-${format}`)
      if (button) button.setAttribute('title', tooltip)
    }

    // Add tooltips to buttons with values
    const valueTooltips: { [key:string]: { [key:string]: string } } = {
      list: { ordered: 'Ordered List', bullet: 'Bulleted List', check: 'Checklist' },
      script: { sub: 'Subscript', super: 'Superscript' },
      indent: { '-1': 'Decrease Indent', '+1': 'Increase Indent' },
      direction: { rtl: 'Right-to-Left' },
    }

    for (const [format, values] of Object.entries(valueTooltips)) {
      for (const [value, tooltip] of Object.entries(values)) {
        const button = toolbar.querySelector(`.ql-${format}[value="${value}"]`)
        if (button) button.setAttribute('title', tooltip)
      }
    }
  }, [])

  // ── Keyboard shortcut: Escape exits fullscreen ────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFullscreen])

  // ── Warning colour for char limit ─────────────────────────────────────────
  const charRatio = stats.characters / charLimit
  const charColour =
    charRatio > 0.95
      ? '#ef4444' // red
      : charRatio > 0.8
      ? '#f59e0b' // amber
      : '#6b7280' // gray

  return (
    <>
      {/* ── Custom styles ─────────────────────────────────────────────────── */}
      <style>{`
        /* Wrapper layout */
        .ql-editor-shell {
          display: flex;
          flex-direction: column;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #fff;
          font-family: 'Georgia', serif;
          transition: box-shadow 0.2s;
        }
        .ql-editor-shell:focus-within {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .ql-editor-shell.fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          border-radius: 0;
          border: none;
        }

        /* Toolbar overrides */
        .ql-editor-shell .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 10px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          align-items: center;
        }
        .ql-editor-shell .ql-toolbar.ql-snow .ql-formats {
          margin-right: 6px;
        }
        .ql-editor-shell .ql-toolbar button,
        .ql-editor-shell .ql-toolbar .ql-picker-label {
          border-radius: 6px;
          transition: background 0.15s;
          color: #374151;
        }
        .ql-editor-shell .ql-toolbar button:hover,
        .ql-editor-shell .ql-toolbar .ql-picker-label:hover {
          background: #e5e7eb;
          color: #111827;
        }
        .ql-editor-shell .ql-toolbar button.ql-active,
        .ql-editor-shell .ql-toolbar .ql-picker-label.ql-active {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .ql-editor-shell .ql-toolbar .ql-stroke {
          stroke: currentColor;
        }
        .ql-editor-shell .ql-toolbar .ql-fill {
          fill: currentColor;
        }

        /* Container & editor area */
        .ql-editor-shell .ql-container.ql-snow {
          border: none;
          flex: 1;
          overflow: auto;
        }
        .ql-editor-shell .ql-editor {
          font-family: 'Georgia', serif;
          font-size: 1.0625rem;
          line-height: 1.85;
          color: #1a1a1a;
          padding: 28px 36px;
          min-height: 520px;
        }
        .ql-editor-shell.fullscreen .ql-editor {
          min-height: calc(100vh - 120px);
        }
        .ql-editor-shell .ql-editor.ql-blank::before {
          font-style: italic;
          color: #9ca3af;
          font-family: 'Georgia', serif;
          left: 36px;
        }

        /* Typography in editor */
        .ql-editor-shell .ql-editor h1 {
          font-size: 2rem; font-weight: 700; line-height: 1.2; margin: 1.25em 0 0.5em;
          letter-spacing: -0.025em;
        }
        .ql-editor-shell .ql-editor h2 {
          font-size: 1.5rem; font-weight: 600; line-height: 1.3; margin: 1.1em 0 0.5em;
        }
        .ql-editor-shell .ql-editor h3 {
          font-size: 1.25rem; font-weight: 600; line-height: 1.35; margin: 1em 0 0.4em;
        }
        .ql-editor-shell .ql-editor p { margin: 0.6em 0; }
        .ql-editor-shell .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1.25em 0;
          padding: 0.75em 1.25em;
          background: #eff6ff;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: #1e40af;
        }
        .ql-editor-shell .ql-editor pre.ql-syntax {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 1.25em 1.5em;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          overflow-x: auto;
        }
        .ql-editor-shell .ql-editor img {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          margin: 0.5em 0;
        }
        .ql-editor-shell .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        /* Uploading overlay */
        .ql-uploading-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 0.75rem;
          font-weight: 500;
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }

        /* Footer */
        .ql-editor-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          color: #6b7280;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ql-editor-footer-stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ql-editor-footer-stat svg {
          width: 12px; height: 12px; opacity: 0.65;
        }
        .ql-fullscreen-btn {
          margin-left: auto;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.7rem;
          color: #4b5563;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .ql-fullscreen-btn:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        /* Picker dropdowns */
        .ql-editor-shell .ql-picker-options {
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          border-color: #e5e7eb;
        }
        .ql-editor-shell .ql-snow .ql-tooltip {
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* ── Editor shell ───────────────────────────────────────────────────── */}
      <div className={`ql-editor-shell${isFullscreen ? ' fullscreen' : ''}`}>
        <QuillEditor
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing your article…"
        />

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="ql-editor-footer">
          {/* Words */}
          <span className="ql-editor-footer-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
            </svg>
            <strong>{stats.words.toLocaleString()}</strong>&nbsp;words
          </span>

          {/* Read time */}
          {showReadTime && (
            <span className="ql-editor-footer-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={12} cy={12} r={9} />
                <path d="M12 7v5l3 3" strokeLinecap="round" />
              </svg>
              ~{stats.readMinutes}&nbsp;min read
            </span>
          )}

          {/* Uploading badge */}
          {isUploading && (
            <span className="ql-uploading-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={12} height={12}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={12} y1={3} x2={12} y2={15} strokeLinecap="round" />
              </svg>
              Uploading…
            </span>
          )}

          {/* Char count */}
          <span
            className="ql-editor-footer-stat"
            style={{ marginLeft: 'auto', color: charColour, fontWeight: 500 }}
          >
            {stats.characters.toLocaleString()}&nbsp;/&nbsp;
            {charLimit.toLocaleString()}&nbsp;chars
            {charRatio > 0.95 && (
              <span style={{ color: '#ef4444', marginLeft: 4 }}>
                ⚠ Near limit
              </span>
            )}
          </span>

          {/* Fullscreen toggle */}
          <button
            className="ql-fullscreen-btn"
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen mode'}
          >
            {isFullscreen ? '⊠ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>
    </>
  )
}