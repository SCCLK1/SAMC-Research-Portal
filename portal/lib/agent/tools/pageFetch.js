/**
 * URL Context / Page Fetch tool.
 * Fetches specific page text content to provide deep context to the LLM (matching social_agent_url_context_agent).
 */

export async function fetchPageContent(url) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000) // 6 sec timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) return `Error fetching page: HTTP ${response.status}`

    const html = await response.text()
    
    // Strip HTML tags and script/style elements
    let text = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Truncate to first 3000 characters to keep prompt sizes efficient
    return text.length > 3000 ? `${text.slice(0, 3000)}... [Truncated]` : text
  } catch (error) {
    return `Failed to load url context: ${error.message}`
  }
}
