export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-24 pb-32">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-8">
        <div className="w-64 h-4 bg-luxury-midnight/5 animate-pulse rounded" />
      </div>

      {/* Hero Image Skeleton */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-luxury-midnight/5 animate-pulse rounded-lg" />
      </div>

      <div className="max-w-luxury mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
        {/* Article Column */}
        <div className="lg:col-span-8 lg:col-start-3">
          {/* Header Skeleton */}
          <div className="mb-12 border-b border-luxury-midnight/10 pb-10">
            <div className="w-24 h-6 bg-luxury-midnight/5 animate-pulse rounded mb-6" />
            <div className="w-full h-12 bg-luxury-midnight/5 animate-pulse rounded mb-4" />
            <div className="w-3/4 h-12 bg-luxury-midnight/5 animate-pulse rounded mb-8" />
            
            <div className="w-full h-6 bg-luxury-midnight/5 animate-pulse rounded mb-3" />
            <div className="w-5/6 h-6 bg-luxury-midnight/5 animate-pulse rounded mb-8" />
            
            <div className="flex items-center gap-4 mt-8 pt-6">
              <div className="w-10 h-10 rounded-full bg-luxury-midnight/5 animate-pulse" />
              <div className="flex-1 max-w-sm">
                <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Body Skeleton */}
          <div className="space-y-6">
            <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-11/12 h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-4/5 h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <br />
            <div className="w-2/3 h-8 bg-luxury-midnight/5 animate-pulse rounded mb-4" />
            <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse rounded" />
            <div className="w-5/6 h-4 bg-luxury-midnight/5 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
