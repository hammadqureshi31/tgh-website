import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const SITE_URL = 'https://thegentryhouse.com'

export async function POST(request: Request) {
  const { urls } = await request.json()

  if (!urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: 'urls array required' }, { status: 400 })
  }

  const payload = {
    host: 'thegentryhouse.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return NextResponse.json({
    status: response.status,
    message: response.status === 200 ? 'URLs submitted' : 'Submission failed',
  })
}