'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, getAuthorsAndCategories } from '@/app/actions/blog'
import BlogEditor from '@/components/admin/BlogEditor'
import FeaturedImageUpload from '@/components/admin/FeaturedImageUpload'
import type { Author, Category } from '@/lib/types/database'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    author_id: '',
    category_id: '',
    status: 'draft' as const,
    is_featured: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load authors and categories
  useEffect(() => {
    const loadData = async () => {
      const result = await getAuthorsAndCategories()
      if (result.success) {
        setAuthors(result.data.authors)
        setCategories(result.data.categories)
      }
    }
    loadData()
  }, [])

  // Auto-save draft every 60 seconds
  useEffect(() => {
    if (!unsavedChanges) return

    autoSaveIntervalRef.current = setInterval(async () => {
      const result = await createPost(formData)
      if (result.success) {
        setLastSavedTime(new Date().toLocaleTimeString())
        setUnsavedChanges(false)
      }
    }, 60000)

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [formData, unsavedChanges])

  // Warn on page leave if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [unsavedChanges])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    setUnsavedChanges(true)
    setError(null)
  }

  const handleEditorChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }))
    setUnsavedChanges(true)
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      featured_image: url,
    }))
    setUnsavedChanges(true)
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    setError(null)

    const result = await createPost({
      ...formData,
      status: 'draft',
    })

    if (result.success) {
      setSuccess(true)
      setUnsavedChanges(false)
      setLastSavedTime(new Date().toLocaleTimeString())
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to save draft')
    }

    setIsLoading(false)
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await createPost({
      ...formData,
      status: 'published',
    })

    if (result.success) {
      setSuccess(true)
      setUnsavedChanges(false)
      setTimeout(() => {
        router.push('/admin/blog')
      }, 1500)
    } else {
      setError(result.error || 'Failed to publish post')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
              <p className="text-gray-600 mt-1">Create and publish a new article</p>
            </div>
            {lastSavedTime && (
              <div className="text-sm text-gray-600">
                Last auto-saved: {lastSavedTime}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ Changes saved successfully
          </div>
        )}
        {unsavedChanges && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            You have unsaved changes. Auto-save is enabled.
          </div>
        )}
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              className="w-full px-4 text-luxury-charcoal py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary of the post"
              rows={3}
              className="w-full text-luxury-charcoal px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Featured Image
            </label>
            <FeaturedImageUpload
              value={formData.featured_image}
              onChange={handleImageUpload}
            />
          </div>

          {/* Editor */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Content *
            </label>
            <BlogEditor
              content={formData.content}
              onChange={handleEditorChange}
            />
          </div>

          {/* Meta Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Meta Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO title (max 60 chars)"
                  maxLength={60}
                  className="w-full text-luxury-charcoal  px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO description (max 160 chars)"
                  maxLength={160}
                  rows={2}
                  className="w-full text-luxury-charcoal px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Post Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Post Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <select
                  name="author_id"
                  value={formData.author_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border text-luxury-charcoal border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-luxury-charcoal border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured post
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end sticky bottom-0 bg-gradient-to-t from-white to-white/80 pt-4 pb-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
