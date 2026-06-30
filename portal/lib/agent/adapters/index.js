import { GeminiAdapter } from './gemini.js'
import { OpenAIAdapter } from './openai.js'
import { ClaudeAdapter } from './claude.js'
import { NvidiaNIMAdapter } from './nvidia.js'
import { getConfigValue } from '../../config'

/**
 * Returns the active LLM adapter based on ACTIVE_LLM system config or env var.
 */
export async function getLLMAdapter() {
  const provider = await getConfigValue('ACTIVE_LLM', 'gemini')
  switch (provider.toLowerCase()) {
    case 'openai': return new OpenAIAdapter()
    case 'claude': return new ClaudeAdapter()
    case 'nvidia': return new NvidiaNIMAdapter()
    case 'gemini':
    default:       return new GeminiAdapter()
  }
}
