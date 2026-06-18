import { getApplications, getApplicationMetrics } from '@/app/actions/admin-recruitment'
import RecruitmentTable from '@/components/admin/RecruitmentTable'
import RecruitmentMetrics from '@/components/admin/RecruitmentMetrics'

export const metadata = {
  title: "Recruitment | The Gentry's House",
  robots: 'noindex, nofollow',
}

interface RecruitmentDashboardPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    position?: string
    location?: string
    dateFrom?: string
    dateTo?: string
  }>
}

export default async function RecruitmentDashboardPage({ searchParams }: RecruitmentDashboardPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const search = params.search || ''
  const status = params.status || 'all'
  const position = params.position || 'all'
  const location = params.location || 'all'
  const dateFrom = params.dateFrom || ''
  const dateTo = params.dateTo || ''

  const [{ applications, totalCount, pageSize }, metrics] = await Promise.all([
    getApplications({ page, search, status, position, location, dateFrom, dateTo }),
    getApplicationMetrics(),
  ])
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen pt-20 bg-luxury-ivory">
      <div className="border-b border-black/10 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-playfair text-3xl font-bold text-luxury-midnight mb-2">Recruitment</h1>
          <p className="text-luxury-graphite/70 font-outfit text-sm tracking-luxury">
            {totalCount} application{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <RecruitmentMetrics metrics={metrics} />
        <RecruitmentTable
          applications={applications}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          filters={{ search, status, position, location, dateFrom, dateTo }}
        />
      </div>
    </div>
  )
}
