import { NextRequest, NextResponse } from 'next/server'

/**
 * FormSync submission URL (server-only; avoids browser CORS on api.formsync.app).
 * Override with FORMSYNC_CONTACT_URL in .env.local if the form slug changes.
 */
const FORMSYNC_URL =
  process.env.FORMSYNC_CONTACT_URL ?? 'https://api.formsync.app/v1/s/1Jo-PNN'

type ContactPayload = {
  name?: string
  email?: string
  company?: string
  phone?: string
  message?: string
}

export async function POST(request: NextRequest) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const body = json as ContactPayload
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    )
  }

  const params = new URLSearchParams({
    name,
    email,
    company,
    phone,
    message,
  })

  let upstream: Response
  try {
    upstream = await fetch(FORMSYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not reach form service. Try again later.' },
      { status: 502 }
    )
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: 'Form service rejected the submission.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
