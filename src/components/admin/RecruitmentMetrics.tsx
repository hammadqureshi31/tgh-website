interface RecruitmentMetricsProps {
  metrics: {
    total: number
    new: number
    interviewsScheduled: number
    offersSent: number
    hired: number
    rejected: number
  }
}

const CARDS = [
  { key: 'total', label: 'Total Applications' },
  { key: 'new', label: 'New Applications' },
  { key: 'interviewsScheduled', label: 'Interviews Scheduled' },
  { key: 'offersSent', label: 'Offers Sent' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
] as const

export default function RecruitmentMetrics({ metrics }: RecruitmentMetricsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-black/10 border border-black/10">
      {CARDS.map((card) => (
        <div key={card.key} className="bg-white px-5 py-6">
          <div className="font-playfair text-2xl md:text-3xl text-luxury-amber mb-1.5" style={{ lineHeight: 1 }}>
            {metrics[card.key]}
          </div>
          <div className="font-mono text-luxury-graphite/55 text-xs uppercase" style={{ letterSpacing: '0.1em' }}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  )
}
