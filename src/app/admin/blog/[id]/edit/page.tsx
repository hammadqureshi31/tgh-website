'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updatePost, getPost, publishPost, unpublishPost, deletePost, getAuthorsAndCategories, createCategory } from '@/app/actions/blog'
import BlogEditor from '@/components/admin/BlogEditor'
import FeaturedImageUpload from '@/components/admin/FeaturedImageUpload'
import type { BlogPost, Author, Category } from '@/lib/types/database'
import { Trash2 } from 'lucide-react'

interface EditBlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const [postId, setPostId] = useState<string>('')
  const [post, setPost] = useState<BlogPost | null>(null)
  const [authors, setAuthors] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    author_id: '',
    category_id: '',
    status: 'draft' as string,
    is_featured: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name cannot be empty')
      return
    }
    setCategoryError(null)
    const result = await createCategory(newCategoryName.trim())
    if (result.success && result.data) {
      setCategories(prev => [...prev, result.data as Category])
      setFormData(prev => ({ ...prev, category_id: result.data.id }))
      setNewCategoryName('')
      setIsCreatingCategory(false)
      setUnsavedChanges(true)
    } else {
      setCategoryError(result.error || 'Failed to create category')
    }
  }

  // Get post ID from params
  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id)
    })
  }, [params])

  // Load post and metadata
  useEffect(() => {
    if (!postId) return

    const loadData = async () => {
      setIsLoadingPost(true)
      try {
        const [postResult, metadataResult] = await Promise.all([
          getPost(postId),
          getAuthorsAndCategories(),
        ])

        if (postResult.success) {
          const post = postResult.data
          setPost(post)
          setFormData({
            title: post.title,
            excerpt: post.excerpt || '',
            content: post.content || '',
            featured_image: post.featured_image || '',
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            author_id: post.author_id || '',
            category_id: post.category_id || '',
            status: post.status as any,
            is_featured: post.is_featured || false,
          })
          setLastSavedTime(
            new Date(post.updated_at).toLocaleTimeString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          )
        } else {
          setError('Failed to load post')
        }

        if (metadataResult.success && metadataResult.data) {
          setAuthors(metadataResult.data.authors)
          setCategories(metadataResult.data.categories)
        }
      } finally {
        setIsLoadingPost(false)
      }
    }

    loadData()
  }, [postId])

  // Auto-save draft every 60 seconds
  useEffect(() => {
    if (!unsavedChanges || !postId) return

    autoSaveIntervalRef.current = setInterval(async () => {
      const result = await updatePost(postId, formData)
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
  }, [formData, unsavedChanges, postId])

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

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    const result = await updatePost(postId, formData)

    if (result.success) {
      setSuccess(true)
      setUnsavedChanges(false)
      setLastSavedTime(new Date().toLocaleTimeString())
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to save post')
    }

    setIsLoading(false)
  }

  const handleTogglePublish = async () => {
    setIsLoading(true)
    setError(null)

    const result =
      formData.status === 'published'
        ? await unpublishPost(postId)
        : await publishPost(postId)

    if (result.success) {
      setFormData((prev) => ({
        ...prev,
        status:
          formData.status === 'published' ? 'draft' : 'published',
      }))
      setSuccess(true)
      setUnsavedChanges(false)
      setLastSavedTime(new Date().toLocaleTimeString())
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to update post')
    }

    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    const result = await deletePost(postId)

    if (result.success) {
      router.push('/admin/blog')
    } else {
      setError(result.error || 'Failed to delete post')
      setShowDeleteConfirm(false)
    }

    setIsLoading(false)
  }

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Post not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
              <p className="text-gray-600 mt-1">
                {lastSavedTime && `Last saved: ${lastSavedTime}`}
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              disabled={isLoading}
            >
              <Trash2 size={18} />
              Delete
            </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Post?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The post will be archived.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-7xl mx-auto px-6 pb-12 text-luxury-charcoal">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex gap-2 mb-2">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    {isCreatingCategory ? 'Cancel' : 'New'}
                  </button>
                </div>
                {isCreatingCategory && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Create
                    </button>
                  </div>
                )}
                {categoryError && (
                  <p className="text-sm text-red-600">{categoryError}</p>
                )}
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
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50"
            >
              Save Changes
            </button>
            <button
              onClick={handleTogglePublish}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg transition font-medium disabled:opacity-50 ${
                formData.status === 'published'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {formData.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
