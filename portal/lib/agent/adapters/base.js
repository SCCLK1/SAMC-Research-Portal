/**
 * Base LLM Adapter interface.
 * All concrete adapters must implement these methods.
 * Swap providers via ACTIVE_LLM env var — zero app code changes.
 */
export class BaseLLMAdapter {
  /**
   * @param {string} systemPrompt
   * @param {string} userMessage
   * @param {object} options
   * @returns {Promise<string>} - The LLM response text
   */
  async complete(systemPrompt, userMessage, options = {}) {
    throw new Error(`complete() not implemented by ${this.constructor.name}`)
  }

  /**
   * @param {string} systemPrompt
   * @param {string} userMessage
   * @param {function} onChunk - called with each streamed text chunk
   * @returns {Promise<void>}
   */
  async streamComplete(systemPrompt, userMessage, onChunk) {
    throw new Error(`streamComplete() not implemented by ${this.constructor.name}`)
  }

  get providerName() {
    throw new Error(`providerName not implemented by ${this.constructor.name}`)
  }
}
