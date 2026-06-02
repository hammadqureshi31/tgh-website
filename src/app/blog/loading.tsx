export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-luxury-ivory pt-24 md:pt-32">
      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        {/* Header Skeleton */}
        <div className="mb-14 lg:mb-18">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber/20" />
            <div className="w-24 h-4 bg-luxury-midnight/5 animate-pulse" />
          </div>
          <div className="w-3/4 max-w-xl h-12 bg-luxury-midnight/5 animate-pulse mb-4" />
          <div className="w-1/2 max-w-sm h-6 bg-luxury-midnight/5 animate-pulse" />
        </div>

        {/* Featured Post Hero Skeleton */}
        <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-luxury-midnight/5 animate-pulse rounded-lg mb-16 lg:mb-24" />

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-luxury-midnight/10 pb-6">
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-8 bg-luxury-midnight/5 animate-pulse rounded" />
            ))}
          </div>
          <div className="w-full md:w-64 h-10 bg-luxury-midnight/5 animate-pulse rounded" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg border border-luxury-midnight/5">
              <div className="w-full aspect-video bg-luxury-midnight/5 animate-pulse rounded mb-6" />
              <div className="w-2/3 h-6 bg-luxury-midnight/5 animate-pulse mb-3" />
              <div className="w-full h-4 bg-luxury-midnight/5 animate-pulse mb-2" />
              <div className="w-5/6 h-4 bg-luxury-midnight/5 animate-pulse mb-6" />
              <div className="flex items-center gap-3 pt-4 border-t border-luxury-midnight/5">
                <div className="w-7 h-7 rounded-full bg-luxury-midnight/5 animate-pulse" />
                <div className="w-24 h-4 bg-luxury-midnight/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
