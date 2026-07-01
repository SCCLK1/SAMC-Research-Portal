/**
 * Parses the agent's markdown output (matching prompt.md format)
 * into structured JSON for the UI.
 */

/**
 * Parse full agent markdown output into an array of event objects.
 * @param {string} markdown - Raw markdown from the LLM agent
 * @returns {{ events: Array, metadata: object }}
 */
export function parseAgentOutput(markdown) {
  if (!markdown) return { events: [], metadata: {} }

  const metadata = extractMetadata(markdown)
  const events = extractEvents(markdown)

  return { events, metadata }
}

function extractMetadata(markdown) {
  // Extract header line: "15 Jun 2026, 14:30 IST · Constituents as of [date] · [N] verified · [M] below threshold"
  const headerMatch = markdown.match(
    /(\d{1,2}\s+\w+\s+\d{4}[^·\n]*?)·\s*Constituents as of ([^·]+)·\s*(\d+)\s*verified\s*·\s*(\d+)\s*below threshold/i
  )

  return {
    runDate: headerMatch?.[1]?.trim() ?? new Date().toLocaleDateString('en-IN'),
    constituentsAsOf: headerMatch?.[2]?.trim() ?? 'unknown',
    verifiedCount: parseInt(headerMatch?.[3] ?? '0'),
    belowThresholdCount: parseInt(headerMatch?.[4] ?? '0'),
  }
}

function extractEvents(markdown) {
  const events = []

  // Split into full brief sections by "## Company · Event · Severity N"
  const briefPattern = /^##\s+(.+?)\s+·\s+(.+?)\s+·\s+Severity\s+(\d+)/gm
  const briefMatches = [...markdown.matchAll(briefPattern)]

  // Also parse the digest table rows
  const digestRows = extractDigestRows(markdown)

  if (briefMatches.length > 0) {
    // We have full briefs
    for (let i = 0; i < briefMatches.length; i++) {
      const match = briefMatches[i]
      const startIdx = match.index
      const endIdx = briefMatches[i + 1]?.index ?? markdown.length
      const section = markdown.slice(startIdx, endIdx)

      const event = parseSingleBrief(section, match[1], match[2], parseInt(match[3]))
      if (event) events.push(event)
    }
  } else if (digestRows.length > 0) {
    // Only digest table available
    return digestRows
  }

  // Merge digest rows for events not in full briefs
  const briefCompanies = new Set(events.map((e) => e.company.toLowerCase()))
  for (const row of digestRows) {
    if (!briefCompanies.has(row.company.toLowerCase())) {
      events.push(row)
    }
  }

  // Sort by actionability descending
  return events.sort((a, b) => (b.actionability ?? 0) - (a.actionability ?? 0))
}

function extractDigestRows(markdown) {
  const rows = []
  // Match digest table rows: | # | Company | Event | Sentiment | Sev | Conf | Actionability | Age |
  const rowPattern = /\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(Bullish|Neutral|Bearish)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/gi
  const matches = [...markdown.matchAll(rowPattern)]

  for (const m of matches) {
    rows.push({
      company: m[1].trim(),
      eventSummary: m[2].trim(),
      sentiment: m[3].trim(),
      severity: parseInt(m[4]),
      confidence: parseInt(m[5]),
      actionability: parseInt(m[6]),
      age: m[7].trim(),
      hasFullBrief: false,
    })
  }

  return rows
}

function parseSingleBrief(section, company, eventType, severity) {
  const event = {
    company: company.trim(),
    eventType: eventType.trim(),
    severity,
    hasFullBrief: true,
  }

  // Verdict
  const verdictMatch = section.match(/\*\*Verdict\.\*\*\s*(.+)/i)
  event.verdict = verdictMatch?.[1]?.trim()

  // Metrics table: | Metric | Value |
  event.confidence = extractTableValue(section, 'Final Confidence', /(\d+)\s*\/\s*100/)
  event.actionability = extractTableValue(section, 'Actionability', /(\d+)\s*\/\s*100/)
  event.magnitude = extractTableValue(section, 'Magnitude', /(\d+)\s*\/\s*5/)
  event.freshness = extractTableValue(section, 'Freshness', /(\d+)\s*\/\s*100/)
  event.timeHorizon = extractTableString(section, 'Time horizon')
  event.nifty500Impact = extractTableString(section, 'Nifty 500 impact')

  // Sentiment
  const sentimentMatch = section.match(/Sentiment[^|]*\|\s*(Bullish|Neutral|Bearish)/i)
  event.sentiment = sentimentMatch?.[1] ?? 'Neutral'

  // Age
  const ageMatch = section.match(/Age[^|]*\|\s*([^|\n]+)/i)
  event.age = ageMatch?.[1]?.trim()

  // What happened
  const whatMatch = section.match(/### What happened\s*\n+([\s\S]+?)(?=###|\n##|$)/i)
  event.whatHappened = whatMatch?.[1]?.trim()

  // Why it matters (table)
  event.whyItMatters = extractWhyItMatters(section)

  // Reaction lean
  const leanMatch = section.match(/### Reaction lean\s*\n+([\s\S]+?)(?=###|\n##|$)/i)
  event.reactionLean = leanMatch?.[1]?.trim()

  // Confidence composition
  event.confidenceComposition = extractConfidenceComposition(section)

  // Evidence
  const evidenceMatch = section.match(/### Evidence\s*\n+([\s\S]+?)(?=###|\n##|$)/i)
  event.evidence = evidenceMatch?.[1]?.trim()

  // Source URL (if present in brief)
  const urlMatch = section.match(/Source URL:\s*(https?:\/\/[^\s\n|]+)/i)
  if (urlMatch) {
    event.url = urlMatch[1].trim()
  }

  // Market context
  event.marketContext = extractMarketContext(section)

  // Spillover
  event.spillover = extractSpillover(section)

  // Historical analogs
  event.historicalAnalogs = extractHistoricalAnalogs(section)

  // Risks
  const risksMatch = section.match(/### Risks to the thesis\s*\n+([\s\S]+?)(?=###|\n##|$)/i)
  event.risks = risksMatch?.[1]?.trim()?.split('\n').filter((l) => l.trim().startsWith('-')).map((l) => l.replace(/^-\s*/, ''))

  return event
}

function extractTableValue(text, label, valuePattern) {
  const rowPattern = new RegExp(`\\|\\s*${label}[^|]*\\|\\s*([^|\\n]+)`, 'i')
  const match = text.match(rowPattern)
  if (!match) return null
  const valueMatch = match[1].match(valuePattern ?? /(\d+)/)
  return valueMatch ? parseInt(valueMatch[1]) : null
}

function extractTableString(text, label) {
  const rowPattern = new RegExp(`\\|\\s*${label}[^|]*\\|\\s*([^|\\n]+)`, 'i')
  const match = text.match(rowPattern)
  return match?.[1]?.trim() ?? null
}

function extractWhyItMatters(section) {
  const block = section.match(/### Why it matters\s*\n+([\s\S]+?)(?=###|\n##|$)/i)?.[1]
  if (!block) return null
  const rows = {}
  const rowPattern = /\|\s*(\w[\w\s]*?)\s*\|\s*([^|\n]+)/g
  const matches = [...block.matchAll(rowPattern)]
  for (const m of matches) {
    const key = m[1].trim().toLowerCase()
    if (['dimension', '---', ''].includes(key)) continue
    rows[key] = m[2].trim()
  }
  return rows
}

function extractConfidenceComposition(section) {
  const block = section.match(/### Confidence composition\s*\n+([\s\S]+?)(?=###|\n##|$)/i)?.[1]
  if (!block) return null
  const components = []
  const rowPattern = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|\n]+)/g
  const matches = [...block.matchAll(rowPattern)]
  for (const m of matches) {
    const comp = m[1].trim()
    if (['component', '---', ''].includes(comp.toLowerCase())) continue
    components.push({
      component: comp,
      score: m[2].trim(),
      weight: m[3].trim(),
      contribution: m[4].trim(),
    })
  }
  return components
}

function extractMarketContext(section) {
  const block = section.match(/### Market context[\s\S]+?\n+([\s\S]+?)(?=###|\n##|$)/i)?.[1]
  if (!block) return null
  const returns = {}
  const rowPattern = /\|\s*(Day[\s\d]+|[\d]+-Day[^|]*)\s*\|\s*([^|\n]+)/gi
  const matches = [...block.matchAll(rowPattern)]
  for (const m of matches) {
    returns[m[1].trim()] = m[2].trim()
  }
  return Object.keys(returns).length > 0 ? returns : null
}

function extractSpillover(section) {
  const block = section.match(/\|\s*Spillover[^|]*\|\s*Names[^|]*\|([\s\S]+?)(?=###|\n##|$)/i)?.[0]
  if (!block) return null
  const bene = block.match(/Beneficiaries[^|]*\|\s*([^|\n]+)/i)?.[1]?.trim()
  const risk = block.match(/At risk[^|]*\|\s*([^|\n]+)/i)?.[1]?.trim()
  return { beneficiaries: bene, atRisk: risk }
}

function extractHistoricalAnalogs(section) {
  const block = section.match(/### Historical analogs\s*\n+([\s\S]+?)(?=###|\n##|$)/i)?.[1]
  if (!block || block.includes('NM')) return null
  const analogs = []
  const rowPattern = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|\n]+)/g
  const matches = [...block.matchAll(rowPattern)]
  for (const m of matches) {
    const event = m[1].trim()
    if (['event', '---', ''].includes(event.toLowerCase())) continue
    analogs.push({ event, date: m[2].trim(), outcome: m[3].trim() })
  }
  return analogs.length > 0 ? analogs : null
}
