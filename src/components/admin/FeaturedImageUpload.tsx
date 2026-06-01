'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface FeaturedImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
}

export default function FeaturedImageUpload({
  value,
  onChange,
  onRemove,
}: FeaturedImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
        setError('Please upload a JPG, PNG, WebP, or AVIF image.')
        return
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.')
        return
      }

      setError(null)
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
        onChange(url)
      } catch (err) {
        console.error('Image upload failed:', err)
        setError('Failed to upload image. Please try again.')
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleUpload(files[0])
      }
    },
    [handleUpload]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleUpload(files[0])
      }
    },
    [handleUpload]
  )

  const handleRemove = useCallback(() => {
    onChange('')
    if (onRemove) {
      onRemove()
    }
  }, [onChange, onRemove])

  return (
    <div className="w-full">
      {value ? (
        <div className="relative group">
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Featured image"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            title="Remove image"
          >
            <X size={20} />
          </button>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg cursor-pointer">
            <span className="text-white text-sm font-medium">Replace</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileInputChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-white text-sm font-medium">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer transition ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center py-12">
            <Upload
              size={40}
              className={`mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            />
            <p className="text-sm font-medium text-gray-700">
              {isUploading ? 'Uploading...' : 'Drag and drop your image here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to select (JPG, PNG, WebP, AVIF • max 5MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileInputChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
