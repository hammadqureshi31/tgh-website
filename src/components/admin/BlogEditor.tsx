'use client'

import React, { useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  ImagePlus,
  Minus,
} from 'lucide-react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
  onImageUpload?: (url: string) => void
}

export default function BlogEditor({
  content,
  onChange,
  onImageUpload,
}: BlogEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleAddLink = useCallback(() => {
    if (!editor || !linkUrl) return

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run()

    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || !editor) return

      for (const file of Array.from(files)) {
        setIsUploading(true)

        try {
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Upload failed')
          }

          const { url } = await response.json()

          editor.chain().focus().setImage({ src: url }).run()

          if (onImageUpload) {
            onImageUpload(url)
          }
        } catch (error) {
          console.error('Image upload failed:', error)
          alert('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }

      // Reset input
      event.target.value = ''
    },
    [editor, onImageUpload]
  )

  if (!editor) {
    return null
  }

  const charCount = editor.storage.characterCount.characters()

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap text-luxury-charcoal  items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-gray-300'
              : 'bg-transparent'
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-300'
              : 'bg-transparent'
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-300'
              : 'bg-transparent'
          }`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('bold') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('italic') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('strike') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('bulletList') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('orderedList') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Blockquote and Code */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('blockquote') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('codeBlock') ? 'bg-gray-300' : 'bg-transparent'
          }`}
          title="Code Block"
        >
          <Code size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Horizontal Rule */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200 transition"
          title="Horizontal Rule"
        >
          <Minus size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Link */}
        <div className="relative">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor.isActive('link') ? 'bg-gray-300' : 'bg-transparent'
            }`}
            title="Add Link"
          >
            <LinkIcon size={18} />
          </button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-2 z-10 w-64">
              <input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-2 text-luxury-charcoal py-1 border border-gray-300 rounded text-sm mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLink()
                  if (e.key === 'Escape') setShowLinkInput(false)
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddLink}
                  className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Add Link
                </button>
                <button
                  onClick={() => setShowLinkInput(false)}
                  className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <label className="p-2 rounded hover:bg-gray-200 transition cursor-pointer relative">
          <ImagePlus size={18} />
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        <div className="w-px h-6 bg-gray-300" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
          title="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
          title="Redo"
        >
          <Redo size={18} />
        </button>

        {/* Character Count */}
        <div className="ml-auto text-xs text-gray-600 font-medium">
          {charCount} / 50,000 characters
        </div>
      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="prose text-luxury-charcoal prose-sm max-w-none p-6 min-h-[500px] overflow-y-auto focus:outline-none"
      />
    </div>
  )
}
