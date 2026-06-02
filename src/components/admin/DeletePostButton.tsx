'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deletePost } from '@/app/actions/blog'
import { useRouter } from 'next/navigation'

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deletePost(postId)

    if (result.success) {
      setShowDeleteConfirm(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete post')
      setShowDeleteConfirm(false)
    }

    setIsLoading(false)
  }

  return (
    <>
      <button
        className="text-red-600 hover:text-red-700 transition"
        title="Delete"
        onClick={() => setShowDeleteConfirm(true)}
      >
        <Trash2 size={18} />
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
              Delete Post?
            </h3>
            <p className="text-gray-600 mb-6 text-left">
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
    </>
  )
}

