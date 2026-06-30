import { BaseLLMAdapter } from './base.js'
import { getConfigValue } from '../../config.js'

export class OpenAIAdapter extends BaseLLMAdapter {
  constructor() {
    super()
    this.apiKey = process.env.OPENAI_API_KEY
    this.model = 'gpt-4o'
    this.baseUrl = 'https://api.openai.com/v1'
  }

  get providerName() { return 'openai' }

  async complete(systemPrompt, userMessage, options = {}) {
    const apiKey = await getConfigValue('OPENAI_API_KEY')
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenAI API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? ''
  }

  async streamComplete(systemPrompt, userMessage, onChunk) {
    const apiKey = await getConfigValue('OPENAI_API_KEY')
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        stream: true,
        temperature: 0.2,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
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
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6))
            const chunk = json.choices?.[0]?.delta?.content
            if (chunk) onChunk(chunk)
          } catch {}
        }
      }
    }
  }
}
