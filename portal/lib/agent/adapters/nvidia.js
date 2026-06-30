import { BaseLLMAdapter } from './base.js'
import { getConfigValue } from '../../config.js'

export class NvidiaNIMAdapter extends BaseLLMAdapter {
  constructor() {
    super()
    this.baseUrl = 'https://integrate.api.nvidia.com/v1'
  }

  get providerName() { return 'nvidia' }

  async complete(systemPrompt, userMessage, options = {}) {
    const apiKey = await getConfigValue('NVIDIA_NIM_API_KEY')
    const model = await getConfigValue('NVIDIA_NIM_MODEL', 'meta/llama-3.1-70b-instruct')
    
    if (!apiKey) throw new Error('NVIDIA_NIM_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`NVIDIA NIM API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? ''
  }

  async streamComplete(systemPrompt, userMessage, onChunk) {
    const apiKey = await getConfigValue('NVIDIA_NIM_API_KEY')
    const model = await getConfigValue('NVIDIA_NIM_MODEL', 'meta/llama-3.1-70b-instruct')
    
    if (!apiKey) throw new Error('NVIDIA_NIM_API_KEY is not set')

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        stream: true,
        temperature: 0.2,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`NVIDIA NIM API error ${response.status}: ${err}`)
    }

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
