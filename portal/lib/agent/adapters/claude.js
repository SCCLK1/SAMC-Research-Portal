import { BaseLLMAdapter } from './base.js'
import { getConfigValue } from '../../config.js'

export class ClaudeAdapter extends BaseLLMAdapter {
  constructor() {
    super()
    this.apiKey = process.env.ANTHROPIC_API_KEY
    this.model = 'claude-sonnet-4-5'
    this.baseUrl = 'https://api.anthropic.com/v1'
  }

  get providerName() { return 'claude' }

  async complete(systemPrompt, userMessage, options = {}) {
    const apiKey = await getConfigValue('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens ?? 8192,
        temperature: options.temperature ?? 0.2,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.content?.[0]?.text ?? ''
  }

  async streamComplete(systemPrompt, userMessage, onChunk) {
    const apiKey = await getConfigValue('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 8192,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

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
            if (json.type === 'content_block_delta') {
              const chunk = json.delta?.text
              if (chunk) onChunk(chunk)
            }
          } catch {}
        }
      }
    }
  }
}
