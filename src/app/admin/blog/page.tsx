import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminPosts } from '@/app/actions/blog'
import { Plus, Pencil } from 'lucide-react'
import DeletePostButton from '@/components/admin/DeletePostButton'

export const metadata = {
  title: 'Blog | Admin | The Gentry\'s House',
  robots: 'noindex, nofollow',
}

interface BlogListPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const supabase = await createServerSupabaseClient()

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const status = params.status || 'all'

  const result = await getAdminPosts({
    page,
    search,
    status,
  })

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {result.error}
        </div>
      </div>
    )
  }

  const { posts, pagination }: any = result.data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-gray-600 mt-1">Manage all blog posts and content</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <form className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search by title or excerpt..."
                  className="flex-1 text-luxury-charcoal px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <form className="flex gap-2">
                <select
                  name="status"
                  defaultValue={status}
                  className="px-4 py-2 text-luxury-charcoal border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {posts.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post: any) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="max-w-sm">
                          <p className="font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {post.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.author?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.category?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'scheduled'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(post.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="text-blue-600 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <DeletePostButton postId={post.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Page {pagination.current} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog?page=${Math.max(1, pagination.current - 1)}&search=${search}&status=${status}`}
                    className={`px-4 py-2 rounded-lg transition ${
                      pagination.current === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-disabled={pagination.current === 1}
                  >
                    Previous
                  </Link>
                  <Link
                    href={`/admin/blog?page=${Math.min(pagination.total, pagination.current + 1)}&search=${search}&status=${status}`}
                    className={`px-4 py-2 rounded-lg transition ${
                      pagination.current === pagination.total
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-disabled={pagination.current === pagination.total}
                  >
                    Next
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No blog posts found.</p>
            <Link
              href="/admin/blog/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
