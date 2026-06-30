import { BaseLLMAdapter } from './base.js'
import { getConfigValue } from '../../config.js'

export class GeminiAdapter extends BaseLLMAdapter {
  constructor() {
    super()
    this.apiKey = process.env.GEMINI_API_KEY
    this.model = 'gemini-2.0-flash'
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'
  }

  get providerName() { return 'gemini' }

  async complete(systemPrompt, userMessage, options = {}) {
    const apiKey = await getConfigValue('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

    const response = await fetch(
      `${this.baseUrl}/${this.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            maxOutputTokens: options.maxTokens ?? 8192,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Gemini API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }

  async streamComplete(systemPrompt, userMessage, onChunk) {
    const apiKey = await getConfigValue('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

    const response = await fetch(
      `${this.baseUrl}/${this.model}:streamGenerateContent?key=${apiKey}&alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
        }),
      }
    )

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6))
            const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text
            if (chunk) onChunk(chunk)
          } catch {}
        }
      }
    }
  }
}
