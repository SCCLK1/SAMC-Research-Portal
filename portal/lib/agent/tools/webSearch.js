import { getConfigValue } from '../../config.js'

/**
 * Web search tool for the agent.
 * Supports Serper (Google) and Brave Search APIs.
 * Set SEARCH_PROVIDER=serper|brave and SEARCH_API_KEY in .env
 */

/**
 * @param {string} query - Search query
 * @param {number} num - Number of results (default 5)
 * @returns {Promise<Array<{title, url, snippet}>>}
 */
export async function webSearch(query, num = 5) {
  const provider = await getConfigValue('SEARCH_PROVIDER', 'serper')
  const apiKey = await getConfigValue('SEARCH_API_KEY')

  if (!apiKey) {
    console.warn('[WebSearch] SEARCH_API_KEY not set — returning empty results')
    return []
  }

  try {
    if (provider === 'brave') {
      return await braveSearch(query, num, apiKey)
    }
    return await serperSearch(query, num, apiKey)
  } catch (err) {
    console.error('[WebSearch] Error:', err.message)
    return []
  }
}

async function serperSearch(query, num, apiKey) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, num, gl: 'in', hl: 'en' }),
  })

  if (!response.ok) throw new Error(`Serper error ${response.status}`)
  const data = await response.json()

  return (data.organic ?? []).slice(0, num).map((r) => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet,
    date: r.date,
  }))
}

async function braveSearch(query, num, apiKey) {
  const url = new URL('https://api.search.brave.com/res/v1/web/search')
  url.searchParams.set('q', query)
  url.searchParams.set('count', num)
  url.searchParams.set('country', 'IN')

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  })

  if (!response.ok) throw new Error(`Brave error ${response.status}`)
  const data = await response.json()

  return (data.web?.results ?? []).slice(0, num).map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.description,
    date: r.page_age,
  }))
}
