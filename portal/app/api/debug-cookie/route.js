import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split(';').map(c => c.trim())
  
  // Return only the names of the cookies for security
  const cookieNames = cookies.filter(Boolean).map(c => {
    const [name] = c.split('=')
    return name
  })
  
  return NextResponse.json({
    success: true,
    cookies: cookieNames
  })
}
