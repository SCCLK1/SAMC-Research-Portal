const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

const mockEvents = [
  {
    company: "Tata Motors Limited",
    eventType: "Business Expansion",
    sentiment: "Bullish",
    severity: 4,
    magnitude: 4,
    actionability: 82,
    confidence: 85,
    magnitudeExplanation: "High fundamental impact due to premium capacity expansion and capital deployment in high-margin EV segment.",
    freshness: 90,
    age: "12 hours ago",
    timeHorizon: "Medium-term",
    nifty500Impact: "Significant",
    verdict: "Strategic EV capacity expansion and private equity funding secure leadership position in India's electric passenger vehicle segment.",
    whatHappened: "Tata Motors' EV subsidiary signed a memorandum of understanding with the Tamil Nadu government to invest Rs 9,000 crore over five years in a new electric vehicle manufacturing facility, expected to add 150,000 units of annual capacity.",
    whyItMatters: {
      "Market share": "Defends 70%+ market share in India passenger EV segment against foreign and domestic entry.",
      "Capex scale": "Rs 9,000 crore represents major capital commitment, funded mostly through internal accruals and PE equity.",
      "Local ecosystems": "Establishes localized battery assembly, lowering supply chain import risks."
    },
    confidenceComposition: [
      { component: "Official Filing", score: 95, weight: "0.70", contribution: "66.5" },
      { component: "Media Consensus", score: 80, weight: "0.20", contribution: "16.0" },
      { component: "Historical Analog", score: 25, weight: "0.10", contribution: "2.5" }
    ],
    reactionLean: "Bullish market reaction anticipated; EV capex scale confirms execution timeline and margin protection.",
    evidence: "Official disclosure to National Stock Exchange (NSE) dated June 28,  Tamil Nadu State industrial policy report, and media coverage in Economic Times.",
    marketContext: {
      "1-Day return": "+1.8%",
      "5-Day return": "+3.2%",
      "P/E ratio": "18.5x",
      "Sector average P/E": "24.2x"
    },
    spillover: {
      beneficiaries: "Sona BLW (EV drivetrains), Tata Power (charging network)",
      atRisk: "Traditional auto parts suppliers without EV transit parts"
    },
    historicalAnalogs: [
      { event: "Tata Motors Sanand Plant EV Conversion", date: "2022", outcome: "Resulted in 40% volume growth in Nexon EV within 12 months." }
    ],
    risks: [
      "Short-term margins compression due to high initial depreciation charges.",
      "Delays in localization of battery cell production causing supply bottlenecks."
    ]
  },
  {
    company: "HDFC Bank Limited",
    eventType: "Earnings",
    sentiment: "Bullish",
    severity: 4,
    magnitude: 3,
    actionability: 75,
    confidence: 90,
    magnitudeExplanation: "Moderate to high impact as credit expansion eases NIM compression concerns post-merger.",
    freshness: 95,
    age: "6 hours ago",
    timeHorizon: "Short-term",
    nifty500Impact: "High",
    verdict: "Robust credit growth and deposit accretion post-merger stabilize Net Interest Margins (NIM), signaling positive outlook.",
    whatHappened: "HDFC Bank reported gross advances growth of 15.8% YoY and deposit accretion of 18.2% YoY for the quarter, beating analyst consensus and easing concerns regarding deposit franchise liquidity.",
    whyItMatters: {
      "Margin stability": "Stables NIM at 3.45%, beating estimates of 3.38%.",
      "Credit expansion": "Advances driven by retail and corporate credit segments.",
      "LDR recovery": "Loan-to-deposit ratio improves by 120 bps."
    },
    confidenceComposition: [
      { component: "Official Filing", score: 98, weight: "0.70", contribution: "68.6" },
      { component: "Media Consensus", score: 90, weight: "0.20", contribution: "18.0" },
      { component: "Historical Analog", score: 34, weight: "0.10", contribution: "3.4" }
    ],
    reactionLean: "Strong institutional buying expected. Restores confidence in deposit franchise scale.",
    evidence: "HDFC Bank quarterly business update filed with BSE/NSE on June 29.",
    marketContext: {
      "1-Day return": "+2.4%",
      "5-Day return": "+4.1%",
      "P/B ratio": "2.8x",
      "5-Year average P/B": "3.4x"
    },
    spillover: {
      beneficiaries: "Private sector banking peers (ICICI Bank, Axis Bank) on positive sector sentiment",
      atRisk: "NBFCs facing higher cost of capital from banking system"
    },
    historicalAnalogs: [
      { event: "HDFC Merger advances stabilization", date: "Q3FY24", outcome: "Led to a 6% rally in private banks index within 2 weeks." }
    ],
    risks: [
      "Elevated cost of deposits due to persistent competitive pressure in retail banking.",
      "Unsecured retail credit growth could trigger regulatory risk weighs."
    ]
  },
  {
    company: "Adani Enterprises Limited",
    eventType: "Regulatory",
    sentiment: "Bullish",
    severity: 5,
    magnitude: 4,
    actionability: 88,
    confidence: 95,
    magnitudeExplanation: "High impact due to resolution of regulatory overhang that has depressed multiples for 18 months.",
    freshness: 90,
    age: "18 hours ago",
    timeHorizon: "Long-term",
    nifty500Impact: "High",
    verdict: "SEBI settlement of administrative show-cause notices removes a key systemic overhang, boosting retail and institutional sentiment.",
    whatHappened: "Adani Enterprises settled administrative proceedings with SEBI regarding public shareholding norms and disclosure disclosures, paying a consent fee of Rs 28 crore without admitting or denying the allegations.",
    whyItMatters: {
      "Overhang removal": "Settlement closes probe on minimum public shareholding issues.",
      "Capital costs": "Enables refinance of dollar-denominated debt at lower yields.",
      "FII sentiment": "Clears regulatory compliance requirements for global fund inclusion."
    },
    confidenceComposition: [
      { component: "Official Filing", score: 100, weight: "0.70", contribution: "70.0" },
      { component: "Media Consensus", score: 85, weight: "0.20", contribution: "17.0" },
      { component: "Historical Analog", score: 10, weight: "0.10", contribution: "1.0" }
    ],
    reactionLean: "Highly bullish; retail volumes likely to surge. Institutional re-entry anticipated.",
    evidence: "SEBI Settlement Order WTM/AD/CFD/2026/08 published on SEBI official portal.",
    marketContext: {
      "1-Day return": "+4.6%",
      "5-Day return": "+8.9%",
      "P/E ratio": "95.4x",
      "1-Year range": "Rs 2,100 - Rs 3,450"
    },
    spillover: {
      beneficiaries: "All Adani Group constituents (Adani Ports, Adani Power)",
      atRisk: "Short-sellers and hedging counterparties"
    },
    historicalAnalogs: [
      { event: "Reliance Industries SEBI settlement", date: "2018", outcome: "Resulted in a 12% valuation multiple expansion over the next quarter." }
    ],
    risks: [
      "Remaining litigation risks in international jurisdictions.",
      "Elevated leverage ratio across group holding entities."
    ]
  },
  {
    company: "Infosys Limited",
    eventType: "Regulatory",
    sentiment: "Neutral",
    severity: 3,
    magnitude: 2,
    actionability: 55,
    confidence: 95,
    magnitudeExplanation: "Low fundamental impact as the settlement amount is immaterial relative to Infosys' cash reserves.",
    freshness: 80,
    age: "24 hours ago",
    timeHorizon: "Short-term",
    nifty500Impact: "Minor",
    verdict: "Settlement of long-standing tax dispute removes regulatory overhang; fiscal impact remains minimal.",
    whatHappened: "Infosys settled a tax dispute with the Income Tax Department regarding transfer pricing for Q4FY21, paying a revised assessment fee of Rs 140 crore, which has already been fully provisioned in previous fiscal years.",
    whyItMatters: {
      "No financial hit": "Amount already accounted for in prior provisions.",
      "Legal clarity": "Prevents future litigation costs and interest charges.",
      "Overhead closure": "Concludes a multi-year audit review cycle."
    },
    confidenceComposition: [
      { component: "Official Filing", score: 100, weight: "0.70", contribution: "70.0" },
      { component: "Media Consensus", score: 95, weight: "0.20", contribution: "19.0" },
      { component: "Historical Analog", score: 60, weight: "0.10", contribution: "6.0" }
    ],
    reactionLean: "Neutral to mildly positive; stock stability expected due to complete overhang closure.",
    evidence: "Infosys disclosure to NSE/BSE dated June 28.",
    marketContext: {
      "1-Day return": "+0.2%",
      "5-Day return": "-1.1%",
      "P/E ratio": "22.8x",
      "Dividend yield": "2.8%"
    },
    spillover: {
      beneficiaries: "None; company-specific tax resolution",
      atRisk: "None"
    },
    historicalAnalogs: [
      { event: "Wipro tax assessment settlement", date: "2023", outcome: "Stock flat; volatility dropped 15%." }
    ],
    risks: [
      "Potential audits of later financial years under similar transfer pricing rules."
    ]
  }
]

const mockMetadata = {
  asOfDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  totalSearches: 15,
  verifiedSignals: 4,
  insufficientVerification: [
    { item: "Reliance Retail IPO timeline", reason: "Rumors in media blogs; no exchange filings or official board notifications to confirm." },
    { item: "Zomato acquisition of blinkit competitor", reason: "Single anonymous sourcing from tech blog; both companies issued denials." }
  ]
}

const rawMarkdown = `
# Nifty 500 Intelligence Event Digest - ${mockMetadata.asOfDate}

## Daily Digest Table
| Rank | Company | Event Category | Sentiment | Severity | Magnitude | Actionability | Horizon |
|------|---------|----------------|-----------|----------|-----------|---------------|---------|
| 1 | Adani Enterprises Limited | Regulatory | Bullish | 5 | 4 | 88 | Long-term |
| 2 | Tata Motors Limited | Business Expansion | Bullish | 4 | 4 | 82 | Medium-term |
| 3 | HDFC Bank Limited | Earnings | Bullish | 4 | 3 | 75 | Short-term |
| 4 | Infosys Limited | Regulatory | Neutral | 3 | 2 | 55 | Short-term |

## Full Briefs

### 1. Adani Enterprises Limited
- **Verdict**: ${mockEvents[2].verdict}
- **Actionability**: 88/100 | **Confidence**: 95/100 | **Severity**: 5/5 | **Magnitude**: 4/5 | **Freshness**: 90/100
- **What Happened**: ${mockEvents[2].whatHappened}
- **Why It Matters**:
  - Overhang removal: closes shareholding compliance probe.
  - Refinance: lowers international borrowing costs.
- **Evidence**: ${mockEvents[2].evidence}

### 2. Tata Motors Limited
- **Verdict**: ${mockEvents[0].verdict}
- **Actionability**: 82/100 | **Confidence**: 85/100 | **Severity**: 4/5 | **Magnitude**: 4/5 | **Freshness**: 90/100
- **What Happened**: ${mockEvents[0].whatHappened}
- **Why It Matters**:
  - Market share: secures passenger EV dominance.
  - Capex scale: Rs 9,000 crore Tamil Nadu investment.
- **Evidence**: ${mockEvents[0].evidence}

### 3. HDFC Bank Limited
- **Verdict**: ${mockEvents[1].verdict}
- **Actionability**: 75/100 | **Confidence**: 90/100 | **Severity**: 4/5 | **Magnitude**: 3/5 | **Freshness**: 95/100
- **What Happened**: ${mockEvents[1].whatHappened}
- **Why It Matters**:
  - Advances growth: 15.8% YoYAdvances expansion.
  - Deposit stability: advances LDR ratio recovery.
- **Evidence**: ${mockEvents[1].evidence}
`

async function seed() {
  console.log("🌱 Seeding mock completed AgentRun into database...")
  
  try {
    // Find first user to attach the run to (e.g. admin)
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.error("❌ No user found. Please run: npm run db:seed first to create users.")
      process.exit(1)
    }

    const run = await prisma.agentRun.create({
      data: {
        userId: user.id,
        runType: "SCHEDULED",
        status: "DONE",
        llmProvider: "gemini",
        rawOutput: rawMarkdown,
        parsedOutput: JSON.stringify({
          events: mockEvents,
          metadata: mockMetadata
        }),
        startedAt: new Date(),
        completedAt: new Date()
      }
    })

    console.log(`✅ Success! Created mock AgentRun with ID: ${run.id}`)
    console.log("📊 Your dashboard is now pre-populated with realistic Nifty 500 events.")
  } catch (error) {
    console.error("❌ Error seeding events:", error)
  } finally {
    process.exit(0)
  }
}

seed()
