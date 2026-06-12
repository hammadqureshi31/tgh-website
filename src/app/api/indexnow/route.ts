import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY!
const SITE_URL = 'https://thegentryhouse.com'

export async function POST(request: Request) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'urls array required' },
        { status: 400 }
      )
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

    const text = await response.text() // 👈 CRITICAL

    return NextResponse.json({
      status: response.status,
      success: response.ok, // 👈 handles 200 + 202
      message: response.ok ? 'Submitted successfully' : 'Submission failed',
      indexNowResponse: text, // 👈 shows real error if any
      payloadSent: payload, // 👈 optional but useful
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Internal error',
        error: String(error),
      },
      { status: 500 }
    )
  }
}