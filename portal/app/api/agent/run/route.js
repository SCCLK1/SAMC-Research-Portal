import { auth } from '@/auth'
import { runAgent } from '@/lib/agent'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 min max for agent runs

export async function POST(request) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { prisma } = await import('@/lib/db')
  const profile = await prisma.fundManagerProfile.findUnique({
    where: { userId: session.user.id },
  })

  // Set up SSE stream
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const result = await runAgent({
          userId: session.user.id,
          runType: 'ON_DEMAND',
          profile,
          onProgress: (message) => send({ type: 'progress', message }),
        })

        send({
          type: 'done',
          runId: result.runId,
          events: result.events,
          metadata: result.metadata,
          llmProvider: process.env.ACTIVE_LLM ?? 'gemini',
        })
      } catch (error) {
        send({ type: 'error', message: error.message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
