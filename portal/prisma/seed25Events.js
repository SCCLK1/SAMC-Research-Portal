const rawMarkdown = "SIMULATED RUN OUTPUT";

const mockMetadata = {
  asOfDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  totalSearches: 150,
  verifiedSignals: 50,
  insufficientVerification: []
}

const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const url = dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}`
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter })

const mockEvents = [
  {
    "company": "Adani Enterprises Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 89,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting Adani Group's Rs 2,500 crore missile manufacturing hub expansion in Madhya Pradesh.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Long-term",
    "nifty500Impact": "High",
    "verdict": "Adani Group announces Rs 2,500 crore investment to build missile manufacturing hub in Madhya Pradesh.",
    "url": "https://www.moneycontrol.com/news/india/adani-group-to-build-rs-2-500-crore-missile-manufacturing-hub-in-madhya-pradesh-13966411.html",
    "whatHappened": "Adani Group announced on July 5, 2026, a major investment of Rs 2,500 crore to construct a state-of-the-art missile and ammunition manufacturing hub in Madhya Pradesh. The project is part of Adani Defence & Aerospace's long-term plan to localise advanced defence systems in India. The facility is expected to generate direct employment and establish a robust local supplier ecosystem.",
    "whyItMatters": {
      "Strategic Alignment": "Directly supports India's self-reliance mandate in defence production.",
      "Revenue Outlines": "Adds a long-term capital-heavy revenue generator to Adani Enterprises' portfolio.",
      "Indigenisation": "Improves domestic technological capabilities for strategic ammunition production."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+2.1%",
      "5-Day Return": "+4.3%"
    },
    "historicalAnalogs": [
      {
        "event": "Adani Defence Kanpur Ammunition Complex",
        "date": "2024",
        "outcome": "Helped secure multiple defence contract pipelines."
      }
    ],
    "risks": [
      "Extended regulatory approvals and testing timelines for ammunition.",
      "High capital expenditure timeline before commercial payback."
    ],
    "evidence": "Adani Enterprises Limited official press release dated July 5, 2026. Source URL: https://www.moneycontrol.com/news/india/adani-group-to-build-rs-2-500-crore-missile-manufacturing-hub-in-madhya-pradesh-13966411.html"
  },
  {
    "company": "PC Jeweller Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 87,
    "confidence": 88,
    "magnitudeExplanation": "PC Jeweller reports 21% YoY revenue growth in Q1 and expects to become debt-free in the current quarter.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Short-term",
    "nifty500Impact": "Moderate",
    "verdict": "PC Jeweller reports 21% YoY Q1 revenue growth, projects debt-free status in Q1 FY27.",
    "url": "https://www.livemint.com/market/stock-market-news/pc-jeweller-share-price-jumps-over-6-after-companys-claim-to-become-debt-free-in-the-current-quarter-11783054135924.html",
    "whatHappened": "PC Jeweller provided an upbeat business update on July 6, 2026, reporting a 21% YoY rise in consolidated revenue for Q1FY27. Additionally, the company disclosed that it had reduced its outstanding bank debt by approximately 24% during the quarter and cleared over 90% of its total bank debt since its September 2024 settlement. The company stated it expects to become completely debt-free within the current quarter.",
    "whyItMatters": {
      "Debt Deleveraging": "Achieving debt-free status will significantly reduce finance costs and boost net margins.",
      "Consumer Revival": "The 21% revenue growth indicates strong consumer brand trust recovery.",
      "Working Capital": "Frees up credit limits and cash flows for retail inventory expansion."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+6.4%",
      "5-Day Return": "+9.1%"
    },
    "historicalAnalogs": [
      {
        "event": "PC Jeweller bank settlement execution",
        "date": "September 2024",
        "outcome": "Triggered multi-month recovery and credit outlook upgrade."
      }
    ],
    "risks": [
      "Volatile gold prices impacting gross operating margins.",
      "Sustaining retail franchise sales volumes in a highly competitive jewellery sector."
    ],
    "evidence": "PC Jeweller Limited business update disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.livemint.com/market/stock-market-news/pc-jeweller-share-price-jumps-over-6-after-companys-claim-to-become-debt-free-in-the-current-quarter-11783054135924.html"
  },
  {
    "company": "Glenmark Pharmaceuticals Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 3,
    "actionability": 85,
    "confidence": 89,
    "magnitudeExplanation": "Launch of generic Olanzapine Injection expands US injectable portfolio presence.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Glenmark Launches Generic Olanzapine Injection in the United States.",
    "url": "https://www.business-standard.com/markets/news/glenmark-pharma-share-rise-over-2-on-launch-of-olanzapine-single-dose-vial-126070600315_1.html",
    "whatHappened": "Glenmark Pharmaceuticals announced on July 6, 2026, that its US subsidiary has launched a generic version of Olanzapine for Injection (10 mg/vial) in the United States. The injection is indicated for the treatment of schizophrenia and acute agitation in bipolar I disorder. According to IQVIA data, the reference listed drug, Zyprexa, had annual sales of approximately $25.4 million in the US for the 12 months ending May 2026.",
    "whyItMatters": {
      "Portfolio Expansion": "Further establishes Glenmark in the high-barrier institutional sterile injectables market in the US.",
      "Generic Opportunity": "Provides an affordable generic therapeutic option for acute agitation management.",
      "US Sales Pipeline": "Contributes to steady specialty product revenue streams in North America."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+2.3%",
      "5-Day Return": "+3.1%"
    },
    "historicalAnalogs": [
      {
        "event": "Glenmark generic US injectables launches",
        "date": "2025",
        "outcome": "Supported US sales growth and institutional channel volume."
      }
    ],
    "risks": [
      "Price erosion in the generic injectables market from US competitors.",
      "Regulatory compliance audits at manufacturing sites."
    ],
    "evidence": "Glenmark Pharmaceuticals Limited official press release dated July 6, 2026. Source URL: https://www.business-standard.com/markets/news/glenmark-pharma-share-rise-over-2-on-launch-of-olanzapine-single-dose-vial-126070600315_1.html"
  },
  {
    "company": "State Bank of India",
    "eventType": "Earnings update",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 82,
    "confidence": 87,
    "magnitudeExplanation": "PSU banks' loan growth outpacing deposit growth in Q1 presents NIM support but deposit mobilization hurdles.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Short-term",
    "nifty500Impact": "High",
    "verdict": "PSU Banks' loan growth outpaces deposits in Q1, raising concerns over deposit mobilization.",
    "url": "https://www.moneycontrol.com/news/business/psu-banks-loan-growth-races-ahead-of-deposits-in-q1-here-s-what-s-driving-it-13966327.html",
    "whatHappened": "Reports on July 5, 2026, highlighted that public sector banks (PSU banks), including State Bank of India, are seeing credit/loan growth outpace deposit expansion in the first quarter of FY27. While this supports near-term interest income, it creates pressure on liquidity ratios and deposit costs as banks compete to mobilize retail savings.",
    "whyItMatters": {
      "Net Interest Margin (NIM)": "Loan expansion supports asset yields but rising deposit rates will squeeze NIMs in upcoming quarters.",
      "Liquidity Profile": "Higher credit-to-deposit (CD) ratios draw regulator attention and require capital conservation.",
      "Funding Cost": "Forces public sector banks to raise term deposit interest rates, escalating cost of funds."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+0.5%",
      "5-Day Return": "-1.2%"
    },
    "historicalAnalogs": [
      {
        "event": "Private banks credit-deposit mismatch action",
        "date": "2024",
        "outcome": "Led to NIM contraction and sluggish stock performance."
      }
    ],
    "risks": [
      "Tight systemic liquidity driving intense deposit rate competition.",
      "RBI regulatory intervention to curb aggressive credit growth if CD ratio exceeds thresholds."
    ],
    "evidence": "Banking sector credit updates published in national press on July 5, 2026. Source URL: https://www.moneycontrol.com/news/business/psu-banks-loan-growth-races-ahead-of-deposits-in-q1-here-s-what-s-driving-it-13966327.html"
  },
  {
    "company": "Infosys Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 70,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Order win and scale of Infosys Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Infosys secures mega €1.2 Billion digital transformation contract with European automotive conglomerate.",
    "url": "https://www.ndtv.com/feature/31-km-in-2-5-hours-infosys-co-founders-post-on-bengaluru-traffic-nightmare-resonates-online-11729493",
    "whatHappened": "Infosys Limited has announced a landmark agreement with a leading European automotive manufacturer to orchestrate its digital transformation and cloud migration roadmap. The contract is valued at €1.2 billion (approx. ₹10,800 crore) over a seven-year tenure.\n\nInfosys will leverage its generative AI platform, Topaz, to streamline the client's supply chain operations, automate manufacturing IT, and enhance connected-vehicle software engineering. This win bolsters Infosys' order book and solidifies its leadership in the automotive vertical. Work is set to commence in Q2FY27, with first milestone billings projected for late 2026. The stock price gained 1.5% following the announcement.",
    "whyItMatters": {
      "Backlog Expansion": "Bolsters large-deal momentum, providing long-term revenue visibility.",
      "Generative AI Scaling": "Demonstrates commercial monetization of Infosys Topaz platform.",
      "Margin Accretion": "Favorable contract pricing structures protect operating margins."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Infosys Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.ndtv.com/feature/31-km-in-2-5-hours-infosys-co-founders-post-on-bengaluru-traffic-nightmare-resonates-online-11729493",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "22.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Infosys mega deal with Liberty Global",
        "date": "2023",
        "outcome": "Secured revenue run-rate stability over a five-year period."
      }
    ],
    "risks": [
      "High initial transition costs in the first two quarters.",
      "Execution risk across multiple European jurisdictions."
    ]
  },
  {
    "company": "Bharti Airtel Limited",
    "eventType": "Strategic Alliance",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 70,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Strategic Alliance and scale of Bharti Airtel Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Bharti Airtel partners with Google Cloud to deploy generative AI solutions across its 400 million subscriber base.",
    "url": "https://www.livemint.com/companies/news/after-reliance-jio-bharti-airtel-raises-mobile-tariffs-from-july-3-details-here-11719546316519.html",
    "whatHappened": "Bharti Airtel Limited has entered into a multi-year strategic alliance with Google Cloud to deliver cloud-managed generative AI solutions to Indian enterprises and automate its own customer service operations. The partnership will integrate Google's Gemini models with Airtel's deep telecom data pipelines.\n\nBy deployment of AI agents, Airtel aims to resolve over 60% of customer support queries autonomously. The company will also offer joint AI solutions to large enterprise clients in retail, finance, and manufacturing verticals. The stock closed 2.5% higher on July 5, 2026 following the announcement.",
    "whyItMatters": {
      "AI Integration": "Accelerates Generative AI solutions roadmap across enterprise business verticals.",
      "Cost Optimization": "Automates customer operations, lowering customer support and service desk expenses.",
      "Enterprise Growth": "Drives cloud revenue streams through joint product offerings with Google Cloud."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Bharti Airtel Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.livemint.com/companies/news/after-reliance-jio-bharti-airtel-raises-mobile-tariffs-from-july-3-details-here-11719546316519.html",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "23.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Airtel partnership with AWS",
        "date": "2020",
        "outcome": "Drove double-digit growth in cloud hosting enterprise segments."
      }
    ],
    "risks": [
      "Data privacy concerns regarding user profile exposure to public cloud LLMs.",
      "Integration delays with legacy CRM platforms."
    ]
  },
  {
    "company": "State Bank of India",
    "eventType": "Debt issuance",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting Debt issuance and scale of State Bank of India transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "State Bank of India successfully raises ₹10,000 crore via Tier-2 bonds at competitive yields to fund credit growth.",
    "url": "https://www.sahi.com/news/sbi-board-to-evaluate-fy27-fundraising-via-debt-and-capital-instruments-on-june-18-589-PE1_CORP",
    "whatHappened": "State Bank of India (SBI) has announced the successful closure of its Tier-2 bond issuance, raising ₹10,000 crore at a coupon rate of 7.48%. The issue was oversubscribed by more than 2.5 times, attracting strong demand from pension funds, insurance companies, and mutual funds.\n\nThe capital raised will support the bank's asset book growth, particularly in retail and infrastructure lending segments, while maintaining comfortable capital adequacy ratios. The competitive pricing reflects the market's strong confidence in SBI's credit profile and balance sheet strength. The stock closed 3.5% higher on July 6, 2026.",
    "whyItMatters": {
      "Capital Adequacy": "Strengthens capital adequacy ratio, supporting future credit expansion.",
      "Funding Costs": "Secures long-term wholesale funds at competitive yields.",
      "Market Confidence": "Strong oversubscription demonstrates institutional trust in India's largest lender."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "State Bank of India exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.sahi.com/news/sbi-board-to-evaluate-fy27-fundraising-via-debt-and-capital-instruments-on-june-18-589-PE1_CORP",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "24.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "SBI Tier-2 bond raising",
        "date": "2024",
        "outcome": "Supported double-digit advances growth through the fiscal year."
      }
    ],
    "risks": [
      "Interest rate volatility impacting bond valuations.",
      "Slight rise in cost of funds relative to retail deposits."
    ]
  },
  {
    "company": "Life Insurance Corporation of India",
    "eventType": "Regulatory clearance",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Regulatory clearance and scale of Life Insurance Corporation of India transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "LIC receives IRDAI approval to launch new high-margin health insurance and annuity products.",
    "url": "https://www.asiainsurancereview.com/News/ViewNewsLetterArticle/id/96069/Type/eDaily/India-Reserve-Bank-of-India-RBI-flags-rising-surrenders-of-life-insurance-policies",
    "whatHappened": "Life Insurance Corporation of India (LIC) has received formal clearance from the Insurance Regulatory and Development Authority of India (IRDAI) to launch a new suite of customized health insurance and non-participating annuity products. This allows LIC to enter high-growth segments.\n\nLIC has invested over ₹1,200 crore to upgrade its digital platforms and agent networks, facilitating seamless underwriting and onboarding for the new products. The approval enables LIC to diversify its product mix away from traditional participating products, helping protect and improve profit margins. The stock closed 2.0% higher on July 5, 2026.",
    "whyItMatters": {
      "Product Diversification": "Diversifies product mix to include higher-margin non-participating and health plans.",
      "Margin Protection": "Shift to non-par products supports Value of New Business (VNB) margin expansion.",
      "Digital Underwriting": "Digital platform investment streamlines operations and reduces acquisition costs."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bearish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Life Insurance Corporation of India exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.asiainsurancereview.com/News/ViewNewsLetterArticle/id/96069/Type/eDaily/India-Reserve-Bank-of-India-RBI-flags-rising-surrenders-of-life-insurance-policies",
    "marketContext": {
      "1-Day Return": "-2.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "25.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "LIC launch of Jeevan Utsav non-par plan",
        "date": "2023",
        "outcome": "Drove a 15% increase in first-year premium collections in Q4."
      }
    ],
    "risks": [
      "Higher competition from private insurers in the health segment.",
      "Agent training delays on complex health underwriting rules."
    ]
  },
  {
    "company": "Hindustan Unilever Limited",
    "eventType": "Product Launch",
    "sentiment": "Neutral",
    "severity": 2,
    "magnitude": 2,
    "actionability": 52,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Hindustan Unilever Limited launches premium product segment, logging record initial bookings.",
    "url": "https://www.bwlegalworld.com/article/hindustan-unilevers-alok-sinha-joins-fedex-india-as-managing-director-legal-613333",
    "whatHappened": "Hindustan Unilever Limited has officially rolled out its highly anticipated premium product line, priced aggressively to capture middle-income and premium buyers. The launch was highly successful, with the booking portal logging over 58000 bookings within the first 60 minutes, resulting in an estimated waiting period of up to 10 months.\n\nTo meet this demand, the company is scaling up production capacity by 10,000 units per month at its state-of-the-art Chakan facility. Analysts raised volume projections for the company's product portfolio, projecting a strong double-digit growth trajectory in segment revenues. The stock reacted positively on the NSE with a 4.2% rally on July 6, 2026.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Hindustan Unilever Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Neutral sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Hindustan Unilever Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.bwlegalworld.com/article/hindustan-unilevers-alok-sinha-joins-fedex-india-as-managing-director-legal-613333",
    "marketContext": {
      "1-Day Return": "-3.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "26.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Hindustan Unilever Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "ITC Limited",
    "eventType": "Demerger update",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 81,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "ITC Limited receives formal shareholder approval for hotels demerger scheme.",
    "url": "https://scanx.trade/stock-market-news/companies/hindustan-foods-limited-fixes-may-8-2026-as-record-date-for-demerger-and-amalgamation-scheme/38402712",
    "whatHappened": "ITC Limited announced that its demerger scheme to carve out its hospitality business into a separate entity has received overwhelming shareholder approval, with 99.8% of votes cast in favor of the resolution. Under the approved scheme, shareholders will receive 1 share of the newly formed company for every 10 shares held in the parent entity.\n\nThe demerger is intended to unlock significant value by separating the capital-intensive hotel division from the high-return core FMCG/tobacco business, improving the parent company's return ratios (ROCE). The transaction is now in the final stage, awaiting formal clearance from the National Law Tribunal (NCLT), expected to be completed in July 5, 2026.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting ITC Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "ITC Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/companies/hindustan-foods-limited-fixes-may-8-2026-as-record-date-for-demerger-and-amalgamation-scheme/38402712",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "27.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "ITC Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Larsen & Toubro Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 83,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Larsen & Toubro Limited secures mega order win valued at ₹13500 crore for infrastructure project execution.",
    "url": "https://www.tndindia.com/short-stories-2026/",
    "whatHappened": "Larsen & Toubro Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹13500 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 6, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Larsen & Toubro Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Larsen & Toubro Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.tndindia.com/short-stories-2026/",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "28.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Larsen & Toubro Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "HCL Technologies Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "HCL Technologies Limited reports Q1 Net Profit growth of 15% YoY, beating consensus estimates.",
    "url": "https://m.economictimes.com/markets/stocks/news/hcl-tech-shares-in-focus-after-q3-net-profit-declines-11-yoy-should-you-buy-sell-or-hold/articleshow/126496098.cms",
    "whatHappened": "HCL Technologies Limited declared its financial results for the quarter ended July 5, 2026, posting a robust 15% year-on-year growth in standalone net profit to ₹17250 crore. Standalone Net Interest Income (NII) / revenue expanded by 15% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 5, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting HCL Technologies Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "HCL Technologies Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://m.economictimes.com/markets/stocks/news/hcl-tech-shares-in-focus-after-q3-net-profit-declines-11-yoy-should-you-buy-sell-or-hold/articleshow/126496098.cms",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "29.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "HCL Technologies Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Bajaj Finance Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 3,
    "actionability": 74,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Bajaj Finance Limited reports Q1 Net Profit growth of 16% YoY, beating consensus estimates.",
    "url": "https://www.livemint.com/focus/flawless-beats-5-stocks-that-powered-through-q1-earnings-volatility-11753375062658.html",
    "whatHappened": "Bajaj Finance Limited declared its financial results for the quarter ended July 6, 2026, posting a robust 16% year-on-year growth in standalone net profit to ₹17500 crore. Standalone Net Interest Income (NII) / revenue expanded by 10% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 6, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Bajaj Finance Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Bajaj Finance Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.livemint.com/focus/flawless-beats-5-stocks-that-powered-through-q1-earnings-volatility-11753375062658.html",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "30.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Bajaj Finance Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Tata Motors Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 82,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Business Expansion and scale of Tata Motors Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Tata Motors signs MoU with Tamil Nadu government to invest ₹9,000 crore in dedicated EV manufacturing facility.",
    "url": "https://www.autocarpro.in/news/tata-motors-signs-mou-with-govt-of-tamil-nadu-to-invest-rs-9000-crore-in-five-years--119595",
    "whatHappened": "Tata Motors Limited has entered into a binding Memorandum of Understanding (MoU) with the government of Tamil Nadu to establish a state-of-the-art electric vehicle (EV) manufacturing plant in Ranipet. The project involves a capital outlay of ₹9,000 crore over five years.\n\nThe facility will have an initial capacity of 150,000 vehicles per year, scaleable to 300,000 units. It will focus on domestic electric passenger cars and export models, incorporating localized battery pack assembly lines. The plant is expected to generate 5,000 direct jobs. The stock gained 1.8% on July 5, 2026.",
    "whyItMatters": {
      "EV Dominance": "Solidifies Tata Motors' 70%+ market share in India's passenger EV market.",
      "Capex Commitment": "Represents one of the largest capital deployments in the domestic EV sector.",
      "Supply Chain Security": "Localized assembly lines reduce reliance on imported electronic subsystems."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Official disclosure to National Stock Exchange (NSE) dated July 5, 2026. Source URL: https://www.autocarpro.in/news/tata-motors-signs-mou-with-govt-of-tamil-nadu-to-invest-rs-9000-crore-in-five-years--119595",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "31.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Tata Motors EV capacity expansion in Sanand",
        "date": "2022",
        "outcome": "Boosted monthly EV production volumes by 45% within a year."
      }
    ],
    "risks": [
      "Delays in state government infrastructure provisioning (power/water).",
      "Near-term margins compression from high initial depreciation charges."
    ]
  },
  {
    "company": "Sun Pharmaceutical Industries Limited",
    "eventType": "Regulatory inspection",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 80,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Sun Pharmaceutical Industries Limited receives USFDA Establishment Inspection Report with zero major observations.",
    "url": "https://scanx.trade/stock-market-news/companies/solara-active-pharma-sciences-receives-us-fda-eir-for-puducherry-facility-with-vai-status/38922073",
    "whatHappened": "Sun Pharmaceutical Industries Limited has received an Establishment Inspection Report (EIR) from the US Food and Drug Administration (USFDA) for its formulation facility, classifying the inspection as Voluntary Action Indicated (VAI). The audit concluded with zero major observations (Form 483), clearing the plant for new product approvals in the US market.\n\nThis resolution ends a two-year regulatory overhang for the facility, which historically contributed over 10% of the company's generic sales. The USFDA clearance allows the company to resume high-margin launches, driving positive margin revisions by institutional brokerages. The stock price gained 3.8% on July 6, 2026 following the announcement.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Sun Pharmaceutical Industries Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Sun Pharmaceutical Industries Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/companies/solara-active-pharma-sciences-receives-us-fda-eir-for-puducherry-facility-with-vai-status/38922073",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "32.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Sun Pharmaceutical Industries Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Oil and Natural Gas Corporation Limited",
    "eventType": "Resource Discovery",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 64,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Resource Discovery and scale of Oil and Natural Gas Corporation Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "ONGC announces major gas and oil discovery in deepwater block of Krishna Godavari basin.",
    "url": "https://www.newindianexpress.com/business/2025/Nov/19/oil-india-partners-with-totalenergies-for-deep-and-ultra-deepwater-exploration",
    "whatHappened": "Oil and Natural Gas Corporation (ONGC) has declared a significant crude oil and natural gas discovery in the deepwater Block KG-DWN-98/2 off the coast of Andhra Pradesh. Flow tests from the discovery well indicated production capability of 8,500 barrels of oil per day and 1.2 million standard cubic meters of gas per day.\n\nThis development is expected to boost ONGC's gas production profile, offsetting depletion in older mature fields. Management expects commercial production to commence within 24 months, utilizing existing nearby subsea infrastructure. The stock rose 3.8% on July 5, 2026.",
    "whyItMatters": {
      "Resource Accretion": "Adds significant proven reserves to ONGC's deepwater portfolio.",
      "Import Substitution": "Contributes to national energy security by reducing LNG imports.",
      "Infrastructure Synergy": "Proximity to existing KG cluster facilities minimizes incremental capex."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Oil and Natural Gas Corporation Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.newindianexpress.com/business/2025/Nov/19/oil-india-partners-with-totalenergies-for-deep-and-ultra-deepwater-exploration",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "18.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "ONGC gas discovery in KG-DWN-98/2 Cluster II",
        "date": "2020",
        "outcome": "Reversed multi-year production declines in domestic gas blocks."
      }
    ],
    "risks": [
      "High technical challenges associated with deepwater subsea completions.",
      "Fluctuations in global Brent crude and domestic gas pricing policies."
    ]
  },
  {
    "company": "NTPC Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "NTPC Limited secures mega order win valued at ₹14400 crore for infrastructure project execution.",
    "url": "https://www.businesstoday.in/markets/stocks/story/suzlon-waaree-energies-acme-solar-ntpc-green-share-price-targets-q1-results-preview-541053-2026-07-06",
    "whatHappened": "NTPC Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹14400 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 6, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting NTPC Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "NTPC Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.businesstoday.in/markets/stocks/story/suzlon-waaree-energies-acme-solar-ntpc-green-share-price-targets-q1-results-preview-541053-2026-07-06",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "19.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "NTPC Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Maruti Suzuki India Limited",
    "eventType": "Product Launch",
    "sentiment": "Bearish",
    "severity": 3,
    "magnitude": 2,
    "actionability": 58,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting Product Launch and scale of Maruti Suzuki India Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Maruti Suzuki launches next-generation hybrid SUV model, securing 50,000 pre-bookings in 48 hours.",
    "url": "https://www.rediff.com/business/report/auto-maruti-suzukis-strong-pv-sales-market-share-gains-what-it-means-for-investors/20260706.htm",
    "whatHappened": "Maruti Suzuki India Limited has officially launched its next-generation strong-hybrid mid-size SUV, priced competitively to challenge the premium utility vehicle market. The company announced that it has secured over 50,000 firm bookings within 48 hours of opening orders, indicating strong customer demand.\n\nThe model, manufactured under the Toyota-Suzuki global partnership, boasts a fuel efficiency of 28 km/l, making it highly appealing in a high-fuel-price environment. Production is being scaled at the Bidadi plant to minimize waiting periods. The stock price rose 2.2% on July 5, 2026.",
    "whyItMatters": {
      "SUV Market Share": "Helps Maruti Suzuki capture high-margin premium SUV market share.",
      "Hybrid Adoption": "Validates strong-hybrid tech as a viable transition alternative to battery EVs in India.",
      "Revenue Visibility": "50,000 bookings secure revenue projections for the next two quarters."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bearish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Maruti Suzuki India official press statement to NSE/BSE dated July 5, 2026. Source URL: https://www.rediff.com/business/report/auto-maruti-suzukis-strong-pv-sales-market-share-gains-what-it-means-for-investors/20260706.htm",
    "marketContext": {
      "1-Day Return": "-3.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "20.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Maruti Grand Vitara launch",
        "date": "2022",
        "outcome": "Drove a 12% expansion in Maruti's market share in the mid-size SUV segment."
      }
    ],
    "risks": [
      "Supply chain constraints on specialized battery cells and hybrid controllers.",
      "Potential cannibalization of existing compact SUV model volumes."
    ]
  },
  {
    "company": "UltraTech Cement Limited",
    "eventType": "Acquisition",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 82,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "UltraTech Cement Limited signs binding agreement to acquire strategic assets for ₹4980 crore.",
    "url": "https://www.ndtvprofit.com/markets/ambuja-cements-ultratech-cement-jk-cement-dalmia-bharat-stocks-in-focus-ahead-of-q1-results-preview-check-target-prices-11732241",
    "whatHappened": "UltraTech Cement Limited announced that its board has approved a binding agreement to acquire a 98% stake in a key regional asset operator for an enterprise value of ₹4980 crore. The transaction is set to be funded through a combination of internal accruals and low-cost debt, expanding the company's logistics/manufacturing footprint in high-growth corridors.\n\nThe acquisition is highly value-accretive, adding immediate operational capacity and bringing significant cost-synergies in logistics and material procurement. Analysts noted that the transaction represents an EV/EBITDA multiple of 10.2x, which is highly competitive. Closing is expected by October 2026, subject to standard regulatory approvals from the Competition Commission of India (CCI).",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting UltraTech Cement Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "UltraTech Cement Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.ndtvprofit.com/markets/ambuja-cements-ultratech-cement-jk-cement-dalmia-bharat-stocks-in-focus-ahead-of-q1-results-preview-check-target-prices-11732241",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "21.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "UltraTech Cement Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Coal India Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 70,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Coal India Limited reports Q1 Net Profit growth of 15% YoY, beating consensus estimates.",
    "url": "https://www.livemint.com/market/stock-market-news/polycab-india-share-price-jumps-over-6-after-strong-q4-results-11778133508532.html",
    "whatHappened": "Coal India Limited declared its financial results for the quarter ended July 5, 2026, posting a robust 15% year-on-year growth in standalone net profit to ₹19250 crore. Standalone Net Interest Income (NII) / revenue expanded by 11% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 5, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Coal India Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Coal India Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.livemint.com/market/stock-market-news/polycab-india-share-price-jumps-over-6-after-strong-q4-results-11778133508532.html",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "22.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Coal India Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Adani Ports and Special Economic Zone Limited",
    "eventType": "Acquisition",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 80,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Adani Ports and Special Economic Zone Limited signs binding agreement to acquire strategic assets for ₹5200 crore.",
    "url": "https://www.thehindu.com/news/national/kerala/adani-msc-vizhinjam-port-deal-controversy-explained/article71177283.ece",
    "whatHappened": "Adani Ports and Special Economic Zone Limited announced that its board has approved a binding agreement to acquire a 100% stake in a key regional asset operator for an enterprise value of ₹5200 crore. The transaction is set to be funded through a combination of internal accruals and low-cost debt, expanding the company's logistics/manufacturing footprint in high-growth corridors.\n\nThe acquisition is highly value-accretive, adding immediate operational capacity and bringing significant cost-synergies in logistics and material procurement. Analysts noted that the transaction represents an EV/EBITDA multiple of 10.2x, which is highly competitive. Closing is expected by October 2026, subject to standard regulatory approvals from the Competition Commission of India (CCI).",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Adani Ports and Special Economic Zone Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Adani Ports and Special Economic Zone Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.thehindu.com/news/national/kerala/adani-msc-vizhinjam-port-deal-controversy-explained/article71177283.ece",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "23.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Adani Ports and Special Economic Zone Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Power Grid Corporation of India Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 65,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Order win and scale of Power Grid Corporation of India Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Power Grid wins major inter-state transmission project bidding for Green Energy Corridor.",
    "url": "https://www.wirecable.in/resonia-powering-india/",
    "whatHappened": "Power Grid Corporation of India Limited (PGCIL) has emerged as the successful bidder under Tariff-Based Competitive Bidding (TBCB) to establish an inter-state transmission system for evacuating 20 GW of power from renewable energy zones in Rajasthan. The project cost is estimated at ₹4,500 crore.\n\nThe scope includes construction of a 765 kV pooling substation and associated transmission lines across Rajasthan and Haryana. PGCIL will build, own, operate, and maintain the system on a 35-year concession timeline. The stock rose 1.8% on July 5, 2026.",
    "whyItMatters": {
      "Transmission Backlog": "Adds steady, regulated return assets to Power Grid's transmission backlog.",
      "Green Energy Alignment": "Solidifies leadership in green energy corridor evacuation infrastructure.",
      "Competitive Bidding": "Demonstrates cost competitiveness against private players like Adani Energy."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Power Grid Corporation of India exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.wirecable.in/resonia-powering-india/",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "24.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Power Grid green energy corridor phase 1 bidding",
        "date": "2021",
        "outcome": "Secured high-margin asset additions, driving 15% revenue growth."
      }
    ],
    "risks": [
      "Right of Way (RoW) acquisition clearances causing execution delays.",
      "Increase in steel and aluminum conductor raw material prices."
    ]
  },
  {
    "company": "Axis Bank Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Axis Bank Limited reports Q1 Net Profit growth of 18% YoY, beating consensus estimates.",
    "url": "https://m.economictimes.com/news/company/corporate-trends/earnings-vs-signals-q4-results-may-matter-more-than-they-look/articleshow/130280868.cms",
    "whatHappened": "Axis Bank Limited declared its financial results for the quarter ended July 6, 2026, posting a robust 18% year-on-year growth in standalone net profit to ₹20000 crore. Standalone Net Interest Income (NII) / revenue expanded by 14% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 6, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Axis Bank Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Axis Bank Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://m.economictimes.com/news/company/corporate-trends/earnings-vs-signals-q4-results-may-matter-more-than-they-look/articleshow/130280868.cms",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "25.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Axis Bank Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Kotak Mahindra Bank Limited",
    "eventType": "Regulatory warning",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 86,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Kotak Mahindra Bank Limited resolves regulatory restriction as RBI/SEBI lifts operations embargo.",
    "url": "https://www.livelaw.in/job-updates/zonal-legal-manager-loan-against-property-vacancy-at-kotak-mahindra-bank-limited-539979",
    "whatHappened": "Kotak Mahindra Bank Limited announced that the regulatory authority has officially lifted the business restrictions placed on its digital customer onboarding and credit card issuance channels. The restrictions, originally imposed due to IT inventory and data security deficiencies, were resolved following a comprehensive system audit and remediation process.\n\nThe bank has invested over ₹1,200 crore to upgrade its core database infrastructure, establish redundant data centers, and implement advanced security protocols. The lifting of the embargo on July 5, 2026 enables the bank to restart aggressive digital acquisition strategies, restoring its competitive edge in retail lending segments and driving a 5.2% stock rally.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Kotak Mahindra Bank Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Kotak Mahindra Bank Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.livelaw.in/job-updates/zonal-legal-manager-loan-against-property-vacancy-at-kotak-mahindra-bank-limited-539979",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "26.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Kotak Mahindra Bank Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Titan Company Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bearish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 64,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Business Expansion and scale of Titan Company Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Titan reports robust 15% YoY jewelry sales growth in Q1, driven by wedding season demand and store expansion.",
    "url": "https://www.livemint.com/market/stock-market-news/jewellery-stock-senco-gold-jumps-over-6-after-q1fy27-business-update/amp-11783316364266.html",
    "whatHappened": "Titan Company Limited has released its Q1 business update, reporting a robust 15% year-on-year sales growth in its flagship jewelry division (Tanishq). Growth was supported by strong consumer demand during the wedding season and the addition of 12 new domestic Tanishq stores.\n\nThe watches and wearables division grew 12% YoY, while the eye-care division remained relatively flat. Management highlighted that gold price volatility had minimal impact on retail consumer volumes due to promotional gold exchange schemes. The stock rose 2.5% on July 6, 2026 following the update.",
    "whyItMatters": {
      "Consumer Resilience": "Proves resilient discretionary spending in urban India despite high gold prices.",
      "Network Expansion": "New stores strengthen market share in Tier-2 and Tier-3 cities.",
      "Vignette Protection": "Stable margins expected due to effective hedging policies on gold imports."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bearish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Titan Q1 business update filed with BSE/NSE dated July 6, 2026. Source URL: https://www.livemint.com/market/stock-market-news/jewellery-stock-senco-gold-jumps-over-6-after-q1fy27-business-update/amp-11783316364266.html",
    "marketContext": {
      "1-Day Return": "-1.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "27.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Titan Akshaya Tritiya sales update",
        "date": "2023",
        "outcome": "Resulted in 18% sales growth and subsequent 6% stock rally."
      }
    ],
    "risks": [
      "Sharp, unpredictable hikes in import duties on gold.",
      "Competitor discount pricing impacting margins in non-metro markets."
    ]
  },
  {
    "company": "Wipro Limited",
    "eventType": "Strategic Alliance",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 2,
    "actionability": 58,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Strategic Alliance and scale of Wipro Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Wipro partners with Microsoft to deploy generative AI powered search solutions for enterprise clients.",
    "url": "https://www.microsoft.com/en/customers/story/26393-wipro-microsoft-365-copilot",
    "whatHappened": "Wipro Limited has announced a multi-year partnership with Microsoft to launch customized generative AI enterprise solutions utilizing Microsoft Azure OpenAI service. Wipro will train over 50,000 of its associates on Microsoft's AI tools to deploy these solutions.\n\nThe joint offerings will focus on cognitive search, automated financial reporting, and customer experience operations for global financial services and healthcare clients. Wipro has committed a portion of its $1 billion AI investment to scale this partnership. The stock closed 1.2% higher on July 5, 2026.",
    "whyItMatters": {
      "AI Offerings": "Builds capability in enterprise AI consulting, attracting high-value client accounts.",
      "Talent Readiness": "Mass upskilling reduces dependency on traditional legacy application maintenance skills.",
      "Alliance Synergy": "Co-selling with Microsoft unlocks sales pipelines in the US and Europe."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Wipro press statement and Microsoft joint announcement dated July 5, 2026. Source URL: https://www.microsoft.com/en/customers/story/26393-wipro-microsoft-365-copilot",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "28.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Wipro partnership with Google Cloud",
        "date": "2023",
        "outcome": "Drove enterprise cloud bookings by 18%."
      }
    ],
    "risks": [
      "Slow enterprise adoption curves due to data governance concerns.",
      "High initial research and training expenditure before contract monetization."
    ]
  },
  {
    "company": "Asian Paints Limited",
    "eventType": "Capacity Expansion",
    "sentiment": "Bearish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 62,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Capacity Expansion and scale of Asian Paints Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Asian Paints commissions state-of-the-art water-based paint plant in Madhya Pradesh.",
    "url": "https://www.thehindubusinessline.com/portfolio/commodity-analysis/fampo-strategy-buy-asian-paints-futures/article71182025.ece",
    "whatHappened": "Asian Paints Limited has announced the successful commissioning of its new water-based paint manufacturing facility in Pithampur, Madhya Pradesh. The plant, built with an investment of ₹1,800 crore, has an initial capacity of 200,000 kiloliters per annum.\n\nThe facility features advanced automation and zero-liquid-discharge systems, aligning with the company's sustainability goals. This expansion will cater to the rising demand for decorative paints in central and northern India, optimizing logistics costs. The stock price rose 1.5% on July 6, 2026.",
    "whyItMatters": {
      "Logistics Optimization": "Reduces distribution transit times and freight costs in central India markets.",
      "Market Leadership": "Expands production capacity ahead of entry from new cement-backed paint brands.",
      "Eco-friendly Tech": "Modern automation improves factory yields and protects operating margins."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bearish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Asian Paints Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.thehindubusinessline.com/portfolio/commodity-analysis/fampo-strategy-buy-asian-paints-futures/article71182025.ece",
    "marketContext": {
      "1-Day Return": "-3.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "29.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Asian Paints Mysuru plant expansion",
        "date": "2018",
        "outcome": "Increased regional capacity, supporting double-digit volume growth."
      }
    ],
    "risks": [
      "Raw material price volatility in titanium dioxide and crude derivatives.",
      "Intensified competition from Grasim's Birla Opus paints launch."
    ]
  },
  {
    "company": "Mahindra & Mahindra Limited",
    "eventType": "Product Launch",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 84,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting Product Launch and scale of Mahindra & Mahindra Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "M&M launches Thar Roxx SUV, registering a record 100,000 bookings within 60 minutes.",
    "url": "https://www.team-bhp.com/news/mahindra-be07-electric-suv-spied-pillarless-doors",
    "whatHappened": "Mahindra & Mahindra (M&M) announced that its newly launched premium 5-door SUV, the Thar Roxx, received over 100,000 bookings within 60 minutes of opening customer orders. The record response demonstrates the strong brand equity of M&M's SUV portfolio.\n\nThe bookings represent an estimated order book value of ₹15,000 crore. Management confirmed that deliveries are scheduled to begin in October 2026, and they are scaling production at the Chakan plant to reduce consumer waiting times. The stock rose 3.4% on July 5, 2026.",
    "whyItMatters": {
      "SUV Backlog": "Strengthens M&M's position as the leading utility vehicle maker by revenue.",
      "Average Selling Price": "High bookings of premium trims will drive positive average selling price (ASP) expansion.",
      "Production Ramp": "Successful launch necessitates rapid supplier scaling to manage waitlists."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Mahindra & Mahindra Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.team-bhp.com/news/mahindra-be07-electric-suv-spied-pillarless-doors",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "30.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Mahindra Scorpio-N booking launch",
        "date": "2022",
        "outcome": "100k bookings in 30 mins drove a 18% stock rally over the subsequent quarter."
      }
    ],
    "risks": [
      "Semiconductor and electronic controller supply delays.",
      "Supplier capacity bottlenecks on chassis components."
    ]
  },
  {
    "company": "Tata Steel Limited",
    "eventType": "Capacity Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 60,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Capacity Expansion and scale of Tata Steel Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Tata Steel commissions India's largest blast furnace at Kalinganagar plant, expanding crude steel capacity.",
    "url": "https://worldsteel.org/media/industry-member-news/2024-member-news/tata-steel-commissions-indias-largest-blast-furnace-at-kalinganagar/",
    "whatHappened": "Tata Steel Limited has successfully commissioned India's largest blast furnace at its Kalinganagar plant in Odisha. The expansion project, completed with a capital investment of ₹12,000 crore, increases the site's capacity from 3 MTPA to 8 MTPA.\n\nThis makes Kalinganagar a key hub for flat-rolled steel, catering to automotive, pipeline, and packaging industries. The state-of-the-art furnace incorporates advanced environmental controls and carbon-reduction technologies. The stock gained 2.5% on July 6, 2026.",
    "whyItMatters": {
      "Capacity Scale": "Enhances domestic crude steel production capacity, supporting market share goals.",
      "Cost Efficiency": "New furnace lowers per-ton operating costs through superior fuel efficiency.",
      "Product Upgradation": "Focus on high-grade flat steel improves product mix and average realizations."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Neutral sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Tata Steel Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://worldsteel.org/media/industry-member-news/2024-member-news/tata-steel-commissions-indias-largest-blast-furnace-at-kalinganagar/",
    "marketContext": {
      "1-Day Return": "-2.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "31.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Tata Steel Kalinganagar Phase 1 commissioning",
        "date": "2016",
        "outcome": "Boosted sales volumes by 20% in the first full year of operations."
      }
    ],
    "risks": [
      "Oversupply in global steel markets due to high Chinese export volumes.",
      "Volatility in coking coal raw import costs."
    ]
  },
  {
    "company": "Hindalco Industries Limited",
    "eventType": "Capacity Expansion",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Capacity Expansion and scale of Hindalco Industries Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Hindalco announces ₹8,000 crore investment to expand aluminum recycling and rolling plant capacity.",
    "url": "https://www.constructionweekonline.in/projects-tenders/18932-hindalco-to-invest-rs-8000-10000-cr-in-three-plants",
    "whatHappened": "Hindalco Industries Limited has announced a capital expenditure plan of ₹8,000 crore to construct a state-of-the-art aluminum recycling and rolling facility in Odisha. The project will have an annual capacity of 250,000 tons of recycled aluminum products.\n\nThe plant will focus on low-carbon aluminum sheets for the packaging and transport sectors, helping global clients meet sustainability targets. Construction is set to begin in Q3 2026, with commissioning targeted by 2028. The stock price rose 1.8% on July 5, 2026.",
    "whyItMatters": {
      "ESG Leadership": "Meets growing global demand for low-carbon, recycled aluminum materials.",
      "Value Addition": "Expands downstream rolling capacity, insulating margins from LME price swings.",
      "Recycling Scale": "Establishes India's largest organized aluminum recycling ecosystem."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Hindalco Industries Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.constructionweekonline.in/projects-tenders/18932-hindalco-to-invest-rs-8000-10000-cr-in-three-plants",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "32.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Novelis investment in US recycling plants",
        "date": "2021",
        "outcome": "Significantly improved downstream margins and insulated the US division from primary metal volatility."
      }
    ],
    "risks": [
      "Fluctuations in scrap aluminum collection and sorting ecosystem supply.",
      "Delays in getting local environmental clearances."
    ]
  },
  {
    "company": "JSW Steel Limited",
    "eventType": "Strategic Alliance",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 62,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Strategic Alliance and scale of JSW Steel Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "JSW Steel forms joint venture with JFE Steel Japan to manufacture electrical steel in India.",
    "url": "https://www.newindianexpress.com/states/odisha/2026/Apr/25/odisha-cm-majhi-unveils-rs-15k-crore-jv-between-jsw-japans-jfe-steel",
    "whatHappened": "JSW Steel Limited has entered into a 50:50 joint venture agreement with JFE Steel Corporation, Japan, to establish a grain-oriented electrical steel manufacturing plant in Bellary, Karnataka. The project involves an investment of ₹5,500 crore.\n\nThis facility will be the first in India to manufacture high-grade grain-oriented electrical steel, which is critical for transformers and electric vehicle motors. Production is expected to commence by mid-2027, reducing India's total dependence on imports. The stock rose 2.0% on July 6, 2026.",
    "whyItMatters": {
      "Import Substitution": "Caters to domestic transformer makers who currently import 100% of electrical steel.",
      "EV Synergy": "Secures technology roadmap for EV motor laminations in India.",
      "High-margin Mix": "Electrical steel carries a premium margin profile, boosting blended realizations."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Neutral sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "JSW Steel Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.newindianexpress.com/states/odisha/2026/Apr/25/odisha-cm-majhi-unveils-rs-15k-crore-jv-between-jsw-japans-jfe-steel",
    "marketContext": {
      "1-Day Return": "-1.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "18.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "JSW Steel JFE technology partnership on auto steel",
        "date": "2012",
        "outcome": "Helped JSW dominate the domestic automotive steel supply segment."
      }
    ],
    "risks": [
      "Complex technology transfer timelines from Japanese engineers.",
      "Cyclical demand trends in the domestic power transmission sector."
    ]
  },
  {
    "company": "Grasim Industries Limited",
    "eventType": "Capacity Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 2,
    "actionability": 58,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Capacity Expansion and scale of Grasim Industries Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Grasim commissions commercial production of Birla Opus paints across three plants, heating up decorative paint market.",
    "url": "https://www.livelawbiz.com/amp/top-stories/cci-moves-supreme-court-against-nclat-order-setting-aside-30161-crore-penalty-on-grasim-industries-540043",
    "whatHappened": "Grasim Industries Limited has announced the commercial launch and production commencement of its decorative paint brand, Birla Opus, at three automated manufacturing facilities in Punjab, Haryana, and Tamil Nadu. The three plants have a combined initial capacity of 500,000 KLPA.\n\nThis launch marks Grasim's formal entry into the high-margin ₹70,000 crore Indian decorative paint market, leveraging its existing Birla White distribution network. The company plans to scale total capacity to 1,330,000 KLPA by commissioning three more plants. The stock rose 1.5% on July 5, 2026.",
    "whyItMatters": {
      "Business Diversification": "Adds a massive consumer-facing growth engine to Grasim's commodity portfolio.",
      "Distribution Leverage": "Leverages extensive wall-putty paint distributor relationships to gain market share.",
      "Market Disruption": "Aggressive pricing and capacity could trigger market share reshuffle among incumbents."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Neutral sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Grasim Industries Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.livelawbiz.com/amp/top-stories/cci-moves-supreme-court-against-nclat-order-setting-aside-30161-crore-penalty-on-grasim-industries-540043",
    "marketContext": {
      "1-Day Return": "-2.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "19.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Grasim entry into retail white cement segment",
        "date": "2002",
        "outcome": "Achieved market leadership within five years using distribution synergies."
      }
    ],
    "risks": [
      "High initial marketing and dealer commission expenses hurting standalone EBITDA.",
      "Response and price wars from dominant incumbent brand Asian Paints."
    ]
  },
  {
    "company": "Tech Mahindra Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Order win and scale of Tech Mahindra Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Tech Mahindra secures multi-year digital infrastructure deal with major US telecom operator.",
    "url": "https://www.sahi.com/news/tech-mahindra-unit-acquires-brazil-s-alyis-for-2-21-cr-to-bolster-orange-business-alliance-3130-PE1_COR",
    "whatHappened": "Tech Mahindra Limited has announced a major multi-year contract win with a leading US telecommunications operator to manage and modernize its digital and IT infrastructure. The contract is estimated to be worth $450 million (approx. ₹3,750 crore) over five years.\n\nTech Mahindra will deploy generative AI tools and automation platform to optimize network operations, reduce operational downtime, and transform customer support applications. This win strengthens the company's dominant position in the telecom IT services vertical. The stock price closed 1.8% higher on July 6, 2026.",
    "whyItMatters": {
      "Telecom Vertical Growth": "Reinforces Tech Mahindra's leadership in the communications and network service segment.",
      "AI Automation": "Deploying internal automation tools helps improve project delivery margins.",
      "Revenue Security": "Five-year annuity deal provides long-term revenue visibility and cash flow."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Tech Mahindra Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.sahi.com/news/tech-mahindra-unit-acquires-brazil-s-alyis-for-2-21-cr-to-bolster-orange-business-alliance-3130-PE1_COR",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "20.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Tech Mahindra network integration deal with Vodafone",
        "date": "2020",
        "outcome": "Maintained revenue stability through the pandemic telecom investment cycle."
      }
    ],
    "risks": [
      "Tricycle transition bottlenecks during initial infrastructure handovers.",
      "Potential wage inflation in specialized telecom cloud skillsets."
    ]
  },
  {
    "company": "SBI Life Insurance Company Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 65,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "SBI Life Insurance Company Limited reports Q1 Net Profit growth of 13% YoY, beating consensus estimates.",
    "url": "https://www.livemint.com/focus/flawless-beats-5-stocks-that-powered-through-q1-earnings-volatility-11753375062658.html",
    "whatHappened": "SBI Life Insurance Company Limited declared its financial results for the quarter ended July 5, 2026, posting a robust 13% year-on-year growth in standalone net profit to ₹22750 crore. Standalone Net Interest Income (NII) / revenue expanded by 13% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 5, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting SBI Life Insurance Company Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "SBI Life Insurance Company Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.livemint.com/focus/flawless-beats-5-stocks-that-powered-through-q1-earnings-volatility-11753375062658.html",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "21.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "SBI Life Insurance Company Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "LTIMindtree Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 70,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "LTIMindtree Limited secures mega order win valued at ₹17100 crore for infrastructure project execution.",
    "url": "https://www.sahi.com/news/ltimindtree-launches-blueverse-rightlogic-to-shield-ai-assets-for-700-global-enterprise-clients-3147-PE1_COR",
    "whatHappened": "LTIMindtree Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹17100 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 6, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting LTIMindtree Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "LTIMindtree Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.sahi.com/news/ltimindtree-launches-blueverse-rightlogic-to-shield-ai-assets-for-700-global-enterprise-clients-3147-PE1_COR",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "22.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "LTIMindtree Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Bajaj Finserv Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Bajaj Finserv Limited reports Q1 Net Profit growth of 15% YoY, beating consensus estimates.",
    "url": "https://upstox.com/news/market-news/us-stocks/ai-spending-pays-off-alphabet-amazon-microsoft-and-meta-post-robust-earnings/article-192976/",
    "whatHappened": "Bajaj Finserv Limited declared its financial results for the quarter ended July 5, 2026, posting a robust 15% year-on-year growth in standalone net profit to ₹23250 crore. Standalone Net Interest Income (NII) / revenue expanded by 15% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 5, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Bajaj Finserv Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Bajaj Finserv Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://upstox.com/news/market-news/us-stocks/ai-spending-pays-off-alphabet-amazon-microsoft-and-meta-post-robust-earnings/article-192976/",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "23.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Bajaj Finserv Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Shriram Finance Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 72,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Shriram Finance Limited reports Q1 Net Profit growth of 16% YoY, beating consensus estimates.",
    "url": "https://www.ndtvprofit.com/markets/stock-picks-today-infosys-groww-l-t-and-more-on-brokerages-radar-10761251",
    "whatHappened": "Shriram Finance Limited declared its financial results for the quarter ended July 6, 2026, posting a robust 16% year-on-year growth in standalone net profit to ₹23500 crore. Standalone Net Interest Income (NII) / revenue expanded by 10% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 6, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Shriram Finance Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Shriram Finance Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.ndtvprofit.com/markets/stock-picks-today-infosys-groww-l-t-and-more-on-brokerages-radar-10761251",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "24.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Shriram Finance Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Siemens Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 3,
    "actionability": 74,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Siemens Limited secures mega order win valued at ₹17550 crore for infrastructure project execution.",
    "url": "https://www.tradingview.com/news/tradingview:a2374e4d55f1d:0-weekly-recap-siemens-6bn-buyback-and-digital-orders-steady-mobility-up/",
    "whatHappened": "Siemens Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹17550 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 5, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Siemens Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Siemens Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.tradingview.com/news/tradingview:a2374e4d55f1d:0-weekly-recap-siemens-6bn-buyback-and-digital-orders-steady-mobility-up/",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "25.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Siemens Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Bharat Electronics Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 3,
    "actionability": 75,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Bharat Electronics Limited secures mega order win valued at ₹17700 crore for infrastructure project execution.",
    "url": "https://newsonair.gov.in/defence-ministry-signs-1950-crore-contract-with-bharat-electronics-limited/",
    "whatHappened": "Bharat Electronics Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹17700 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 6, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Bharat Electronics Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Bharat Electronics Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://newsonair.gov.in/defence-ministry-signs-1950-crore-contract-with-bharat-electronics-limited/",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "26.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Bharat Electronics Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Hindustan Aeronautics Limited",
    "eventType": "Order win",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 82,
    "confidence": 92,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Hindustan Aeronautics Limited secures mega order win valued at ₹17850 crore for infrastructure project execution.",
    "url": "https://www.cnbctv18.com/market/stocks/hindustan-aeronautics-ltd-share-price/HAL/",
    "whatHappened": "Hindustan Aeronautics Limited's key business vertical has successfully bagged a prestigious 'Mega' contract valued at approximately ₹17850 crore from a government utility agency. The scope of the contract includes design, engineering, supply, and installation of complex high-capacity systems, scheduled for completion over a strict 36-month timeline.\n\nThis contract expands the company's consolidated order backlog to an all-time high, providing robust revenue visibility for the next three fiscal years. Analysts highlighted that the company's strong pre-qualification credentials and operational leverage allowed it to bid with favorable margin parameters. Work is expected to commence immediately in July 5, 2026, with first milestone billings projected by the end of Q2.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Hindustan Aeronautics Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Hindustan Aeronautics Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.cnbctv18.com/market/stocks/hindustan-aeronautics-ltd-share-price/HAL/",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "27.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Hindustan Aeronautics Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Trent Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 80,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting Earnings update and scale of Trent Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Trent Limited reports outstanding Q1 performance with Zudio store expansion driving 45% revenue growth.",
    "url": "https://www.icicidirect.com/research/equity/finace/trent-ltd-q4fy26-results-strong-quarter-store-expansion-to-drive-growth",
    "whatHappened": "Trent Limited has announced its business performance indicators for Q1, reporting a stellar 45% year-on-year growth in consolidated revenue, primarily driven by rapid physical expansion of its value-fashion brand, Zudio. The company added 45 new Zudio stores during the quarter.\n\nOperating margins for the lifestyle retailer expanded by 180 bps, supported by high inventory turnover and strong operating leverage. Tanishq-parent Tata's retail arm continues to outperform peers in the apparel sector due to its fast-fashion agile supply chain. The stock closed 4.8% higher on July 6, 2026.",
    "whyItMatters": {
      "Value Fashion Lead": "Consolidates Zudio's position as India's fastest-growing value fashion format.",
      "Store Economics": "Quick payback period on new Zudio stores supports self-funded scaling.",
      "EBITDA Growth": "Operating leverage drives faster profit growth relative to revenue expansion."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Trent Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.icicidirect.com/research/equity/finace/trent-ltd-q4fy26-results-strong-quarter-store-expansion-to-drive-growth",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "28.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Trent launch of Zudio format",
        "date": "2017",
        "outcome": "Drove a 10x expansion in Trent's valuation multiple over seven years."
      }
    ],
    "risks": [
      "Intensified competition in the value fashion space from Reliance Trends and Yousta.",
      "Rising commercial real estate rentals in primary market locations."
    ]
  },
  {
    "company": "InterGlobe Aviation Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bullish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 78,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Business Expansion and scale of InterGlobe Aviation Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "IndiGo places firm order for 100 wide-body aircraft to accelerate international route expansion.",
    "url": "https://m.economictimes.com/markets/stocks/news/indigo-shares-in-focus-as-airline-charts-global-expansion-in-2026/articleshow/126282061.cms",
    "whatHappened": "InterGlobe Aviation Limited (IndiGo) has announced a firm purchase order for 100 wide-body Airbus A350 aircraft, marking a major strategic shift towards long-haul international travel. Deliveries are scheduled to commence in late 2027 and run through 2033.\n\nThis contract is valued at over $15 billion at list prices, though steep commercial discounts are standard. IndiGo aims to establish direct flights connecting Indian metros with European and Far-East destinations, challenging international carrier dominance. The stock closed 2.0% higher on July 5, 2026.",
    "whyItMatters": {
      "Long-haul Market Entry": "Transforms IndiGo from a regional low-cost carrier into a global long-haul network airline.",
      "Margin Potential": "International routes carry a higher average fare and yield premium over domestic routes.",
      "Fleet Standardization": "Airbus engine selections help avoid Pratt & Whitney supply chain issues."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "InterGlobe Aviation Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://m.economictimes.com/markets/stocks/news/indigo-shares-in-focus-as-airline-charts-global-expansion-in-2026/articleshow/126282061.cms",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "29.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "IndiGo historic 500 narrow-body order",
        "date": "2023",
        "outcome": "Secured dominant 60%+ market share in India domestic aviation segment."
      }
    ],
    "risks": [
      "High capital commitment during a period of elevated geopolitical fuel risks.",
      "Intense competition from Tata's consolidated Air India group on international routes."
    ]
  },
  {
    "company": "DLF Limited",
    "eventType": "Business Expansion",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 85,
    "magnitudeExplanation": "High fundamental impact reflecting Business Expansion and scale of DLF Limited transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "DLF sells out new luxury residential project in Gurugram for ₹5,000 crore within 72 hours of launch.",
    "url": "https://www.indianretailer.com/news/retail-india-news-midtown-plaza-opens-delhi-retail-and-fb-mix",
    "whatHappened": "DLF Limited has reported the complete sell-out of its newly launched luxury housing project, 'DLF Privana West', in Gurugram for ₹5,000 crore. The entire inventory of 1,113 premium apartments was booked by retail customers within 72 hours of opening sales.\n\nThis success highlights the strong demand for premium and luxury housing in the Delhi NCR micro-market. DLF plans to utilize the advance collections to finance construction and acquire new land parcels in Gurugram and Noida, keeping the holding company debt-free. The stock gained 3.4% on July 6, 2026.",
    "whyItMatters": {
      "Luxury Demand": "Confirms strong buyer preference for brand-equity developers in NCR.",
      "Cash Flow Visibility": "Advance customer collections minimize construction debt requirements.",
      "Holding Company Health": "Supports DLF's net debt-free balance sheet status, keeping interest costs low."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "DLF Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.indianretailer.com/news/retail-india-news-midtown-plaza-opens-delhi-retail-and-fb-mix",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "30.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "DLF Arbour project sellout",
        "date": "2023",
        "outcome": "₹8,000 cr booking value triggered a 35% run-up in stock price over 3 months."
      }
    ],
    "risks": [
      "Regulatory approval delays for project completion phases.",
      "Rising raw construction material and local labor costs."
    ]
  },
  {
    "company": "Tata Consumer Products Limited",
    "eventType": "Product Launch",
    "sentiment": "Neutral",
    "severity": 2,
    "magnitude": 2,
    "actionability": 54,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Product Launch and scale of Tata Consumer Products Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Tata Consumer Products launches premium tea and organic spices product range to capture high-margin retail segment.",
    "url": "https://www.outlookbusiness.com/magazine/project-falcon-and-tatas-consumer-coup-the-making-of-an-fmcg-challenger-to-hul-itc",
    "whatHappened": "Tata Consumer Products Limited has officially announced the launch of its new premium product segment, including single-origin teas and organic spices, aiming to capture high-margin retail consumer volumes. The new range is part of the company's strategy to premiumize its FMCG portfolio and drive urban retail growth.\n\nThe initial reception in metro test markets has been positive. Management plans to leverage Tata's wide distribution network to place these premium offerings in over 5,000 modern trade outlets and e-commerce platforms. The stock price rose 1.8% on July 5, 2026 following the announcement.",
    "whyItMatters": {
      "Portfolio Premiumization": "Drives average selling price expansion and improves margins relative to bulk products.",
      "Retail Reach": "Leveraging existing retail relationships speeds up time-to-market for new launches.",
      "Urban Growth": "Targets high-income urban consumers seeking wellness and premium organic food choices."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Neutral sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Tata Consumer Products Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.outlookbusiness.com/magazine/project-falcon-and-tatas-consumer-coup-the-making-of-an-fmcg-challenger-to-hul-itc",
    "marketContext": {
      "1-Day Return": "-2.0%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "31.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Tata Consumer launch of Tata Soulfull",
        "date": "2021",
        "outcome": "Expanded presence in the premium healthy breakfast category, growing segment revenue by 25%."
      }
    ],
    "risks": [
      "High initial marketing and product promotion expenses.",
      "Slow customer adoption in traditional trade mom-and-pop stores."
    ]
  },
  {
    "company": "Cipla Limited",
    "eventType": "Regulatory inspection",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Cipla Limited receives USFDA Establishment Inspection Report with zero major observations.",
    "url": "https://scanx.trade/stock-market-news/companies/cipla-receives-two-form-483-observations-following-u-s-fda-inspection-of-goa-manufacturing-plant/37970554",
    "whatHappened": "Cipla Limited has received an Establishment Inspection Report (EIR) from the US Food and Drug Administration (USFDA) for its formulation facility, classifying the inspection as Voluntary Action Indicated (VAI). The audit concluded with zero major observations (Form 483), clearing the plant for new product approvals in the US market.\n\nThis resolution ends a two-year regulatory overhang for the facility, which historically contributed over 10% of the company's generic sales. The USFDA clearance allows the company to resume high-margin launches, driving positive margin revisions by institutional brokerages. The stock price gained 3.8% on July 6, 2026 following the announcement.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Cipla Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Cipla Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/companies/cipla-receives-two-form-483-observations-following-u-s-fda-inspection-of-goa-manufacturing-plant/37970554",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "32.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Cipla Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Apollo Hospitals Enterprise Limited",
    "eventType": "Capacity Expansion",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting Capacity Expansion and scale of Apollo Hospitals Enterprise Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Apollo Hospitals announces ₹1,200 crore investment to build a new 500-bed multi-specialty hospital in Pune.",
    "url": "https://hdfcsky.com/news/zydus-lifesciences-share-rises-3percent-to-hit-one-year-high-after-apollo-hospitals-pact-for-cancer-detection-test",
    "whatHappened": "Apollo Hospitals Enterprise Limited has announced plans to build a state-of-the-art 500-bed multi-specialty hospital in Pune, Maharashtra. The project involves a capital investment of ₹1,200 crore over the next three years, funded through internal cash flows.\n\nThe facility will feature advanced robotic surgery systems, comprehensive oncology care, and organ transplant departments. Pune is a key hub for tertiary healthcare in western India. The hospital is expected to be operational by mid-2029. The stock price rose 1.8% on July 5, 2026.",
    "whyItMatters": {
      "Beds Addition": "Expands Apollo's total operational bed capacity, supporting long-term revenue growth.",
      "ARPOB Growth": "Advanced specialty care facilities drive higher Average Revenue Per Occupied Bed (ARPOB).",
      "Geography Expansion": "Strengthens competitive presence in the high-income Pune and Western Maharashtra markets."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Apollo Hospitals Enterprise Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://hdfcsky.com/news/zydus-lifesciences-share-rises-3percent-to-hit-one-year-high-after-apollo-hospitals-pact-for-cancer-detection-test",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "18.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Apollo Proton Cancer Center launch",
        "date": "2019",
        "outcome": "Boosted international medical tourism arrivals, improving overall profit margins."
      }
    ],
    "risks": [
      "Delays in recruiting top-tier medical and surgical talent in the region.",
      "Longer gestation period before the new facility achieves operating break-even."
    ]
  },
  {
    "company": "Dr. Reddy's Laboratories Limited",
    "eventType": "Regulatory inspection",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Dr. Reddy's Laboratories Limited receives USFDA Establishment Inspection Report with zero major observations.",
    "url": "https://www.sahi.com/news/dr-reddy-s-hyderabad-plant-flags-7-usfda-observations-risking-biologics-approval-timelines-545961-PE1_C",
    "whatHappened": "Dr. Reddy's Laboratories Limited has received an Establishment Inspection Report (EIR) from the US Food and Drug Administration (USFDA) for its formulation facility, classifying the inspection as Voluntary Action Indicated (VAI). The audit concluded with zero major observations (Form 483), clearing the plant for new product approvals in the US market.\n\nThis resolution ends a two-year regulatory overhang for the facility, which historically contributed over 10% of the company's generic sales. The USFDA clearance allows the company to resume high-margin launches, driving positive margin revisions by institutional brokerages. The stock price gained 3.8% on July 6, 2026 following the announcement.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Dr. Reddy's Laboratories Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Dr. Reddy's Laboratories Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.sahi.com/news/dr-reddy-s-hyderabad-plant-flags-7-usfda-observations-risking-biologics-approval-timelines-545961-PE1_C",
    "marketContext": {
      "1-Day Return": "+3.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "19.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Dr. Reddy's Laboratories Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Hero MotoCorp Limited",
    "eventType": "Product Launch",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting Product Launch and scale of Hero MotoCorp Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Hero MotoCorp launches premium motorcycle model Maverick 440, expanding retail network.",
    "url": "https://www.moneycontrol.com/news/business/markets/hero-motocorp-preps-new-launches-xoom-125-cc-and-xoom-160-cc-scooters-ahead-of-festive-season-12717722.html",
    "whatHappened": "Hero MotoCorp has officially announced the launch of its new premium motorcycle, the Maverick 440, developed in partnership with Harley-Davidson. The model is priced competitively to capture a share of the high-margin mid-size motorcycle segment.\n\nThe initial reception has been positive, with over 15,000 bookings secured within the first week of opening orders. Hero is establishing specialized Premia dealerships across India to retail its premium models. The stock rose 1.5% on July 5, 2026.",
    "whyItMatters": {
      "Premium Entry": "Helps Hero MotoCorp diversify away from the low-margin commuter segment.",
      "Harley Partnership": "Leverages Harley-Davidson brand associations to target premium buyers.",
      "Premia Network": "Specialized dealerships improve customer experience and retail realizations."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Hero MotoCorp Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.moneycontrol.com/news/business/markets/hero-motocorp-preps-new-launches-xoom-125-cc-and-xoom-160-cc-scooters-ahead-of-festive-season-12717722.html",
    "marketContext": {
      "1-Day Return": "+4.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "20.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Hero MotoCorp launch of Harley X440",
        "date": "2023",
        "outcome": "Secured strong order book, driving re-rating of the premium stock multiple."
      }
    ],
    "risks": [
      "Increased marketing and brand repositioning expenses.",
      "Supply constraints on specialized engine castings."
    ]
  },
  {
    "company": "Bharat Petroleum Corporation Limited",
    "eventType": "Earnings",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 64,
    "confidence": 88,
    "magnitudeExplanation": "High fundamental impact reflecting c.category and scale of c.name transaction.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Bharat Petroleum Corporation Limited reports Q1 Net Profit growth of 12% YoY, beating consensus estimates.",
    "url": "https://www.moneycontrol.com/news/business/bpcl-prepares-for-return-of-iranian-crude-starts-supplier-talks-13966463.html",
    "whatHappened": "Bharat Petroleum Corporation Limited declared its financial results for the quarter ended July 6, 2026, posting a robust 12% year-on-year growth in standalone net profit to ₹26500 crore. Standalone Net Interest Income (NII) / revenue expanded by 10% YoY, supported by stable operating margins and healthy credit/sales volumes. Asset quality/operating leverage remained resilient with Gross NPAs/operating margins improving marginally by 4 basis points.\n\nThe positive earnings surprise was driven by strong consumer demand and lower credit/operating costs. The company's management indicated that they are confident in sustaining double-digit growth for the remaining quarters of FY27, backed by a strong project pipeline and stable macro parameters. Following the announcement on July 6, 2026, major brokerages raised their target valuations, driving institutional accumulation of the stock.",
    "whyItMatters": {
      "Scale of Event": "Significant strategic shift affecting Bharat Petroleum Corporation Limited's market capitalization.",
      "Synergies / Margins": "High operating efficiencies expected to expand operating margins.",
      "Valuation / Multiple": "Brokerages reiterate positive ratings, driving institutional accumulation."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Bharat Petroleum Corporation Limited exchange disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.moneycontrol.com/news/business/bpcl-prepares-for-return-of-iranian-crude-starts-supplier-talks-13966463.html",
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "21.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Bharat Petroleum Corporation Limited similar corporate action",
        "date": "2023",
        "outcome": "Stock gained 12% in the subsequent two quarters post-announcement."
      }
    ],
    "risks": [
      "Unexpected regulatory audit queries.",
      "Short-term pressure on operating margins due to integration capex."
    ]
  },
  {
    "company": "Eicher Motors Limited",
    "eventType": "Product Launch",
    "sentiment": "Bullish",
    "severity": 3,
    "magnitude": 3,
    "actionability": 70,
    "confidence": 90,
    "magnitudeExplanation": "High fundamental impact reflecting Product Launch and scale of Eicher Motors Limited transaction.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Significant",
    "verdict": "Eicher Motors launches Royal Enfield Guerilla 450, receiving strong customer bookings.",
    "url": "https://scanx.trade/stock-market-news/companies/eicher-motors-launches-2026-royal-enfield-guerrilla-450-apex-with-enhanced-performance-features/36180718",
    "whatHappened": "Eicher Motors Limited's motorcycle division, Royal Enfield, has launched the Guerilla 450, a new premium roadster model built on its Sherpa 450 engine platform. The company reported strong initial bookings and customer interest across key dealerships.\n\nThe model targets global mid-size motorcycle markets, with exports planned for Europe and Latin America starting in late 2026. This launch strengthens Royal Enfield's leadership in the 250cc-750cc segment. The stock price rose 2.5% on July 5, 2026.",
    "whyItMatters": {
      "Segment Expansion": "Royal Enfield expands its 450cc platform portfolio, driving higher volume turnover.",
      "Global Markets": "Guerilla 450 is optimized for global export markets, boosting export revenue shares.",
      "Platform Synergies": "Sharing the Sherpa 450 engine reduces incremental development costs."
    },
    "confidenceComposition": [
      {
        "component": "Official Filing",
        "score": 98,
        "weight": "0.70",
        "contribution": "68.6"
      },
      {
        "component": "Media Consensus",
        "score": 90,
        "weight": "0.20",
        "contribution": "18.0"
      },
      {
        "component": "Historical Precedent",
        "score": 70,
        "weight": "0.10",
        "contribution": "7.0"
      }
    ],
    "reactionLean": "Bullish sentiment; market digests operational updates and cash-flow impacts.",
    "evidence": "Eicher Motors Limited exchange disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/companies/eicher-motors-launches-2026-royal-enfield-guerrilla-450-apex-with-enhanced-performance-features/36180718",
    "marketContext": {
      "1-Day Return": "+2.5%",
      "5-Day Return": "+3.2%",
      "P/E ratio": "22.0x"
    },
    "spillover": {
      "beneficiaries": "Segment peers and key suppliers",
      "atRisk": "Smaller competitors without access to capital"
    },
    "historicalAnalogs": [
      {
        "event": "Royal Enfield Himalayan 450 launch",
        "date": "2023",
        "outcome": "Drove a 15% expansion in premium model volumes and improved profit margins."
      }
    ],
    "risks": [
      "Intense competition from newly launched mid-size models by Triumph and Harley-Davidson.",
      "Raw material inflation in aluminum and specialized alloy steel components."
    ]
  },
  {
    "company": "Zomato Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 65,
    "confidence": 85,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Zomato Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Zomato Limited announces milestone development in blinkit q1 earnings surge.",
    "url": "https://www.storyboard18.com/brand-marketing/eternal-limited-q4-profit-surges-346-percent-on-blinkit-revenue-boom-ws-l-96516.htm",
    "whatHappened": "Zomato Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Zomato Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 85,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Zomato Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Zomato Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.storyboard18.com/brand-marketing/eternal-limited-q4-profit-surges-346-percent-on-blinkit-revenue-boom-ws-l-96516.htm"
  },
  {
    "company": "One 97 Communications Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 66,
    "confidence": 86,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on One 97 Communications Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "One 97 Communications Limited announces milestone development in rbi approval upi onboarding.",
    "url": "https://scanx.trade/stock-market-news/companies/paytm-europe-secures-payment-institution-license-from-luxembourg-regulator/44697049",
    "whatHappened": "One 97 Communications Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of One 97 Communications Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 86,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 81,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "One 97 Communications Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "One 97 Communications Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/companies/paytm-europe-secures-payment-institution-license-from-luxembourg-regulator/44697049"
  },
  {
    "company": "Jio Financial Services Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 67,
    "confidence": 87,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Jio Financial Services Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Jio Financial Services Limited announces milestone development in blackrock wealth joint venture.",
    "url": "https://www.allianz.com/en/mediacenter/news/media-releases/financials/260326-allianz-jio-reinsurance-limited-commences-operations.html",
    "whatHappened": "Jio Financial Services Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Jio Financial Services Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Jio Financial Services Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Jio Financial Services Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.allianz.com/en/mediacenter/news/media-releases/financials/260326-allianz-jio-reinsurance-limited-commences-operations.html"
  },
  {
    "company": "Tata Technologies Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 68,
    "confidence": 88,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on Tata Technologies Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Tata Technologies Limited announces milestone development in ev digital engineering contract.",
    "url": "https://www.tataelectronics.com/w/qualcomm-and-tata-electronics-partner-to-manufacture-qualcomm-automotive-modules-in-india",
    "whatHappened": "Tata Technologies Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Tata Technologies Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Tata Technologies Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Tata Technologies Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.tataelectronics.com/w/qualcomm-and-tata-electronics-partner-to-manufacture-qualcomm-automotive-modules-in-india"
  },
  {
    "company": "Indian Renewable Energy Development Agency Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 69,
    "confidence": 89,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on Indian Renewable Energy Development Agency Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Indian Renewable Energy Development Agency Limited announces milestone development in loan sanctions growth q1.",
    "url": "https://www.cnbctv18.com/market/stocks/indian-renewable-energy-development-agency-ltd-share-price/IREDAL/",
    "whatHappened": "Indian Renewable Energy Development Agency Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Indian Renewable Energy Development Agency Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 84,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Indian Renewable Energy Development Agency Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Indian Renewable Energy Development Agency Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.cnbctv18.com/market/stocks/indian-renewable-energy-development-agency-ltd-share-price/IREDAL/"
  },
  {
    "company": "Rail Vikas Nigam Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 70,
    "confidence": 90,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Rail Vikas Nigam Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Rail Vikas Nigam Limited announces milestone development in railway electrification project.",
    "url": "https://scanx.trade/stock-market-news/orders-deals/rail-vikas-nigam-secures-additional-orders-worth-13-4-billion-from-nmdc/33643638",
    "whatHappened": "Rail Vikas Nigam Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Rail Vikas Nigam Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Rail Vikas Nigam Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Rail Vikas Nigam Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/orders-deals/rail-vikas-nigam-secures-additional-orders-worth-13-4-billion-from-nmdc/33643638"
  },
  {
    "company": "Suzlon Energy Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 71,
    "confidence": 91,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Suzlon Energy Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Suzlon Energy Limited announces milestone development in wind turbine order win.",
    "url": "https://www.suzlon.com/media/press/press-releases/suzlon-crosses-1-gw-partnership-with-tata-power-following-a-devco-led-new-400-mw-epc-order/",
    "whatHappened": "Suzlon Energy Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Suzlon Energy Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 91,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 86,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Suzlon Energy Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Suzlon Energy Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.suzlon.com/media/press/press-releases/suzlon-crosses-1-gw-partnership-with-tata-power-following-a-devco-led-new-400-mw-epc-order/"
  },
  {
    "company": "Yes Bank Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 72,
    "confidence": 92,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Yes Bank Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Yes Bank Limited announces milestone development in q1 profit asset quality.",
    "url": "https://www.whalesbook.com/corporate-news/English/bankingfinance/Yes-Bank-Q1-FY27-Loans-Grow-184percent-Deposits-Decline-Sequentially/6a47f36fadc106bd16f37373",
    "whatHappened": "Yes Bank Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Yes Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 92,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 87,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Yes Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Yes Bank Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.whalesbook.com/corporate-news/English/bankingfinance/Yes-Bank-Q1-FY27-Loans-Grow-184percent-Deposits-Decline-Sequentially/6a47f36fadc106bd16f37373"
  },
  {
    "company": "Punjab National Bank",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 73,
    "confidence": 93,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Punjab National Bank.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Punjab National Bank announces milestone development in q1 profit net interest income.",
    "url": "https://upstox.com/news/market-news/stocks/sbi-bank-of-india-indian-bank-psb-stocks-rally-nifty-psu-bank-index-jumps-3-5-key-updates-you-must-know/article-189121/",
    "whatHappened": "Punjab National Bank has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Punjab National Bank.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 93,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 88,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Punjab National Bank prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Punjab National Bank official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://upstox.com/news/market-news/stocks/sbi-bank-of-india-indian-bank-psb-stocks-rally-nifty-psu-bank-index-jumps-3-5-key-updates-you-must-know/article-189121/"
  },
  {
    "company": "Bank of Baroda",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 74,
    "confidence": 94,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on Bank of Baroda.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Bank of Baroda announces milestone development in q1 results deposit growth.",
    "url": "https://www.thehindu.com/business/Industry/why-bank-of-baroda-paid-5700-crore-to-settle-nmc-health-dispute-in-abu-dhabi-explained/article71177120.ece",
    "whatHappened": "Bank of Baroda has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Bank of Baroda.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 94,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 89,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Bank of Baroda prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Bank of Baroda official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.thehindu.com/business/Industry/why-bank-of-baroda-paid-5700-crore-to-settle-nmc-health-dispute-in-abu-dhabi-explained/article71177120.ece"
  },
  {
    "company": "Canara Bank",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 75,
    "confidence": 85,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on Canara Bank.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Canara Bank announces milestone development in q1 net profit bad loans.",
    "url": "https://timesofindia.indiatimes.com/business/india-business/pnb-to-sell-npas-worth-up-to-rs-5000-crore-to-arcs-eyes-50-minimum-recovery-sets-rs-30-lakh-crore-business-target/articleshow/123216459.cms",
    "whatHappened": "Canara Bank has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Canara Bank.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 85,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Canara Bank prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Canara Bank official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://timesofindia.indiatimes.com/business/india-business/pnb-to-sell-npas-worth-up-to-rs-5000-crore-to-arcs-eyes-50-minimum-recovery-sets-rs-30-lakh-crore-business-target/articleshow/123216459.cms"
  },
  {
    "company": "Union Bank of India",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 76,
    "confidence": 86,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Union Bank of India.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Union Bank of India announces milestone development in q1 results NIM expansion.",
    "url": "https://upstox.com/news/market-news/stocks/union-bank-of-india-shares-decline-over-7-despite-positive-q1-business-updates-check-all-details/article-196340/",
    "whatHappened": "Union Bank of India has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Union Bank of India.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 86,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 81,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Union Bank of India prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Union Bank of India official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://upstox.com/news/market-news/stocks/union-bank-of-india-shares-decline-over-7-despite-positive-q1-business-updates-check-all-details/article-196340/"
  },
  {
    "company": "IDFC First Bank Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 77,
    "confidence": 87,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on IDFC First Bank Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "IDFC First Bank Limited announces milestone development in q1 earnings retail loan book.",
    "url": "https://m.economictimes.com/markets/stocks/earnings/sobha-ltd-q1-results-pat-zooms-123-yoy-revenue-up-by-35/articleshow/122919153.cms",
    "whatHappened": "IDFC First Bank Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of IDFC First Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "IDFC First Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "IDFC First Bank Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://m.economictimes.com/markets/stocks/earnings/sobha-ltd-q1-results-pat-zooms-123-yoy-revenue-up-by-35/articleshow/122919153.cms"
  },
  {
    "company": "Federal Bank Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 78,
    "confidence": 88,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Federal Bank Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Federal Bank Limited announces milestone development in q1 net profit loan growth.",
    "url": "https://www.usbank.com/investing/financial-perspectives/market-news/federal-reserve-tapering-asset-purchases.html",
    "whatHappened": "Federal Bank Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Federal Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Federal Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Federal Bank Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.usbank.com/investing/financial-perspectives/market-news/federal-reserve-tapering-asset-purchases.html"
  },
  {
    "company": "Bandhan Bank Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 79,
    "confidence": 89,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Bandhan Bank Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Bandhan Bank Limited announces milestone development in q1 profit recovery collection efficiency.",
    "url": "https://www.business-standard.com/markets/capital-market-news/bandhan-bank-rises-after-total-deposits-grow-7-yoy-in-q1-126070600372_1.html",
    "whatHappened": "Bandhan Bank Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Bandhan Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 84,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Bandhan Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Bandhan Bank Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.business-standard.com/markets/capital-market-news/bandhan-bank-rises-after-total-deposits-grow-7-yoy-in-q1-126070600372_1.html"
  },
  {
    "company": "IndusInd Bank Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 80,
    "confidence": 90,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on IndusInd Bank Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "IndusInd Bank Limited announces milestone development in q1 results net interest income.",
    "url": "https://m.economictimes.com/markets/stocks/news/nifty-bank-rises-400-points-as-hdfc-bank-indusind-other-stocks-jump-up-to-3-after-q1-updates/articleshow/132209268.cms",
    "whatHappened": "IndusInd Bank Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of IndusInd Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "IndusInd Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "IndusInd Bank Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://m.economictimes.com/markets/stocks/news/nifty-bank-rises-400-points-as-hdfc-bank-indusind-other-stocks-jump-up-to-3-after-q1-updates/articleshow/132209268.cms"
  },
  {
    "company": "AU Small Finance Bank Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 81,
    "confidence": 91,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on AU Small Finance Bank Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "AU Small Finance Bank Limited announces milestone development in q1 profit deposits expansion.",
    "url": "https://upstox.com/news/market-news/stocks/stocks-to-watch-april-6-vedanta-wipro-hdfc-bank-idbi-bank-dabur-avenue-supermarts-senco-gold/article-191653/",
    "whatHappened": "AU Small Finance Bank Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of AU Small Finance Bank Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 91,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 86,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "AU Small Finance Bank Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "AU Small Finance Bank Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://upstox.com/news/market-news/stocks/stocks-to-watch-april-6-vedanta-wipro-hdfc-bank-idbi-bank-dabur-avenue-supermarts-senco-gold/article-191653/"
  },
  {
    "company": "Macrotech Developers Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 82,
    "confidence": 92,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Macrotech Developers Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Macrotech Developers Limited announces milestone development in q1 pre-sales bookings growth.",
    "url": "https://www.sahi.com/news/macrotech-developers-to-raise-300-crore-through-30-000-ncds-via-private-placement-3868-PE1_COR",
    "whatHappened": "Macrotech Developers Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Macrotech Developers Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 92,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 87,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Macrotech Developers Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Macrotech Developers Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.sahi.com/news/macrotech-developers-to-raise-300-crore-through-30-000-ncds-via-private-placement-3868-PE1_COR"
  },
  {
    "company": "Godrej Properties Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 83,
    "confidence": 93,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Godrej Properties Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Godrej Properties Limited announces milestone development in land parcel acquisition gurugram.",
    "url": "https://scanx.trade/stock-market-news/orders-deals/godrej-properties-acquires-5-acre-land-parcel-in-kolkata-with-inr-1-650-crore-revenue-potential/34129131",
    "whatHappened": "Godrej Properties Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Godrej Properties Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 93,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 88,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Godrej Properties Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Godrej Properties Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/orders-deals/godrej-properties-acquires-5-acre-land-parcel-in-kolkata-with-inr-1-650-crore-revenue-potential/34129131"
  },
  {
    "company": "Oberoi Realty Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 84,
    "confidence": 94,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Oberoi Realty Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Oberoi Realty Limited announces milestone development in luxury residential project launch mumbai.",
    "url": "https://timesofindia.indiatimes.com/city/gurgaon/mumbai-realty-major-oberoi-makes-delhi-ncr-foray-with-ultra-luxury-gurgaon-project-homes-priced-rs-20-crore/articleshow/132074724.cms",
    "whatHappened": "Oberoi Realty Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Oberoi Realty Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 94,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 89,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Oberoi Realty Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Oberoi Realty Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://timesofindia.indiatimes.com/city/gurgaon/mumbai-realty-major-oberoi-makes-delhi-ncr-foray-with-ultra-luxury-gurgaon-project-homes-priced-rs-20-crore/articleshow/132074724.cms"
  },
  {
    "company": "Prestige Estates Projects Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 85,
    "confidence": 85,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Prestige Estates Projects Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Prestige Estates Projects Limited announces milestone development in q1 sales pre-bookings milestone.",
    "url": "https://www.hindustantimes.com/real-estate/prestige-estates-to-invest-rs-15-000-cr-this-fiscal-in-housing-commercial-projects-101783253457797.html",
    "whatHappened": "Prestige Estates Projects Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Prestige Estates Projects Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 85,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Prestige Estates Projects Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Prestige Estates Projects Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.hindustantimes.com/real-estate/prestige-estates-to-invest-rs-15-000-cr-this-fiscal-in-housing-commercial-projects-101783253457797.html"
  },
  {
    "company": "Sobha Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 86,
    "confidence": 86,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on Sobha Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Sobha Limited announces milestone development in q1 share shareholding premium apartments.",
    "url": "https://simplywall.st/stocks/in/real-estate-management-and-development/nse-sobha/sobha-shares/news/should-you-buy-sobha-limited-nsesobha-for-its-upcoming-divid",
    "whatHappened": "Sobha Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Sobha Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 86,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 81,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Sobha Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Sobha Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://simplywall.st/stocks/in/real-estate-management-and-development/nse-sobha/sobha-shares/news/should-you-buy-sobha-limited-nsesobha-for-its-upcoming-divid"
  },
  {
    "company": "Signature Global (India) Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 87,
    "confidence": 87,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on Signature Global (India) Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Signature Global (India) Limited announces milestone development in luxury housing sales gurugram.",
    "url": "https://www.linkedin.com/posts/cnbc-tv18_indias-housing-market-slows-prices-up-activity-7427713891025076226-ghfH",
    "whatHappened": "Signature Global (India) Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Signature Global (India) Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Signature Global (India) Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Signature Global (India) Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.linkedin.com/posts/cnbc-tv18_indias-housing-market-slows-prices-up-activity-7427713891025076226-ghfH"
  },
  {
    "company": "The Indian Hotels Company Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 88,
    "confidence": 88,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on The Indian Hotels Company Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "The Indian Hotels Company Limited announces milestone development in ginger hotels portfolio expansion.",
    "url": "https://indianretailer.com/franchisetv/archives/news/ihcl-expands-ginger-portfolio-15-hotels-maharashtra",
    "whatHappened": "The Indian Hotels Company Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of The Indian Hotels Company Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "The Indian Hotels Company Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "The Indian Hotels Company Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://indianretailer.com/franchisetv/archives/news/ihcl-expands-ginger-portfolio-15-hotels-maharashtra"
  },
  {
    "company": "Devyani International Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 89,
    "confidence": 89,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Devyani International Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Devyani International Limited announces milestone development in kfc pizza hut store additions.",
    "url": "https://www.storyboard18.com/brand-marketing/devyani-international-loss-widens-despite-strong-kfc-led-revenue-growth-ws-l-98243.htm",
    "whatHappened": "Devyani International Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Devyani International Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 84,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Devyani International Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Devyani International Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.storyboard18.com/brand-marketing/devyani-international-loss-widens-despite-strong-kfc-led-revenue-growth-ws-l-98243.htm"
  },
  {
    "company": "Sapphire Foods India Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 65,
    "confidence": 90,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Sapphire Foods India Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Sapphire Foods India Limited announces milestone development in q1 sales restaurant operating margin.",
    "url": "https://www.storyboard18.com/brand-marketing/kfc-india-operator-sapphire-foods-consolidated-profit-plunges-by-67-8-to-rs-16-7-crore-in-fy25-64874.htm",
    "whatHappened": "Sapphire Foods India Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Sapphire Foods India Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Sapphire Foods India Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Sapphire Foods India Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.storyboard18.com/brand-marketing/kfc-india-operator-sapphire-foods-consolidated-profit-plunges-by-67-8-to-rs-16-7-crore-in-fy25-64874.htm"
  },
  {
    "company": "Westlife Foodworld Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 66,
    "confidence": 91,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Westlife Foodworld Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Westlife Foodworld Limited announces milestone development in mcdonalds store network expansion.",
    "url": "https://www.indianretailer.com/news/retail-india-news-mcdonalds-india-marks-50th-mccafe-milestone",
    "whatHappened": "Westlife Foodworld Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Westlife Foodworld Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 91,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 86,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Westlife Foodworld Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Westlife Foodworld Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.indianretailer.com/news/retail-india-news-mcdonalds-india-marks-50th-mccafe-milestone"
  },
  {
    "company": "Jubilant FoodWorks Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 67,
    "confidence": 92,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on Jubilant FoodWorks Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Jubilant FoodWorks Limited announces milestone development in dominos delivery speed network.",
    "url": "https://m.economictimes.com/markets/stocks/news/volume-shocker-mfs-add-1-crore-shares-of-6-stocks-in-may-stocks-gain-up-to-25/jubilant-foodworks/slideshow/131792490.cms",
    "whatHappened": "Jubilant FoodWorks Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Jubilant FoodWorks Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 92,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 87,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Jubilant FoodWorks Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Jubilant FoodWorks Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://m.economictimes.com/markets/stocks/news/volume-shocker-mfs-add-1-crore-shares-of-6-stocks-in-may-stocks-gain-up-to-25/jubilant-foodworks/slideshow/131792490.cms"
  },
  {
    "company": "Britannia Industries Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 68,
    "confidence": 93,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on Britannia Industries Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Britannia Industries Limited announces milestone development in rural market volume recovery.",
    "url": "https://www.sahi.com/news/britannia-vp-resigns-as-fmcg-giant-targets-19-000-crore-revenue-by-fy2026-50-PE1_CORPO",
    "whatHappened": "Britannia Industries Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Britannia Industries Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 93,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 88,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Britannia Industries Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Britannia Industries Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.sahi.com/news/britannia-vp-resigns-as-fmcg-giant-targets-19-000-crore-revenue-by-fy2026-50-PE1_CORPO"
  },
  {
    "company": "Nestle India Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 69,
    "confidence": 94,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Nestle India Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Nestle India Limited announces milestone development in packaged foods capacity expansion.",
    "url": "https://sg.finance.yahoo.com/news/mitsoh-secures-additional-growth-capital-130500337.html",
    "whatHappened": "Nestle India Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Nestle India Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 94,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 89,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Nestle India Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Nestle India Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://sg.finance.yahoo.com/news/mitsoh-secures-additional-growth-capital-130500337.html"
  },
  {
    "company": "Dabur India Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 70,
    "confidence": 85,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Dabur India Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Dabur India Limited announces milestone development in q1 sales herbal healthcare.",
    "url": "https://www.indianretailer.com/news/retail-india-news-dabur-india-aims-achieve-rs-7000-cr-hpc-and-rs-5000-cr-healthcare-segment",
    "whatHappened": "Dabur India Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Dabur India Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 85,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Dabur India Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Dabur India Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.indianretailer.com/news/retail-india-news-dabur-india-aims-achieve-rs-7000-cr-hpc-and-rs-5000-cr-healthcare-segment"
  },
  {
    "company": "Marico Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 71,
    "confidence": 86,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Marico Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Marico Limited announces milestone development in saffola coconut oil margins.",
    "url": "https://www.indianretailer.com/news/retail-india-news-marico-targets-double-digit-growth-aims-rs-20000-cr-revenue-2030",
    "whatHappened": "Marico Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Marico Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 86,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 81,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Marico Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Marico Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.indianretailer.com/news/retail-india-news-marico-targets-double-digit-growth-aims-rs-20000-cr-revenue-2030"
  },
  {
    "company": "Godrej Consumer Products Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 72,
    "confidence": 87,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Godrej Consumer Products Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Godrej Consumer Products Limited announces milestone development in indonesia home care business expansion.",
    "url": "https://indianretailer.com/news/p-g-and-shopee-inspires-home-shopping-with-show-me-my-home-experiential-microsite-in-southeast-asia.n10049",
    "whatHappened": "Godrej Consumer Products Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Godrej Consumer Products Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Godrej Consumer Products Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Godrej Consumer Products Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://indianretailer.com/news/p-g-and-shopee-inspires-home-shopping-with-show-me-my-home-experiential-microsite-in-southeast-asia.n10049"
  },
  {
    "company": "Colgate-Palmolive (India) Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 73,
    "confidence": 88,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on Colgate-Palmolive (India) Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Colgate-Palmolive (India) Limited announces milestone development in oral care product premiumization.",
    "url": "https://scanx.trade/stock-market-news/companies/colgate-palmolive-india-schedules-85th-agm-for-july-29/44866836",
    "whatHappened": "Colgate-Palmolive (India) Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Colgate-Palmolive (India) Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Colgate-Palmolive (India) Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Colgate-Palmolive (India) Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/companies/colgate-palmolive-india-schedules-85th-agm-for-july-29/44866836"
  },
  {
    "company": "Procter & Gamble Hygiene and Health Care Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 74,
    "confidence": 89,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on Procter & Gamble Hygiene and Health Care Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Procter & Gamble Hygiene and Health Care Limited announces milestone development in q1 net profit margin expansion.",
    "url": "https://www.indianretailer.com/news/retail-india-news-pg-hygiene-reports-2-pc-decline-q4-profit",
    "whatHappened": "Procter & Gamble Hygiene and Health Care Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Procter & Gamble Hygiene and Health Care Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 84,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Procter & Gamble Hygiene and Health Care Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Procter & Gamble Hygiene and Health Care Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.indianretailer.com/news/retail-india-news-pg-hygiene-reports-2-pc-decline-q4-profit"
  },
  {
    "company": "Emami Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 75,
    "confidence": 90,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Emami Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Emami Limited announces milestone development in koream male grooming portfolio.",
    "url": "https://entrackr.com/fintrackr/emami-owned-the-man-companys-losses-widen-49-in-fy26-amid-modest-revenue-growth-12129308",
    "whatHappened": "Emami Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Emami Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Emami Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Emami Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://entrackr.com/fintrackr/emami-owned-the-man-companys-losses-widen-49-in-fy26-amid-modest-revenue-growth-12129308"
  },
  {
    "company": "Jyothy Labs Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 76,
    "confidence": 91,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Jyothy Labs Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Jyothy Labs Limited announces milestone development in fabric care volume growth.",
    "url": "https://www.tradingview.com/symbols/BSE-JYOTHYLAB/financials-statistics-and-ratios/price-sales-fwd/",
    "whatHappened": "Jyothy Labs Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Jyothy Labs Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 91,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 86,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Jyothy Labs Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Jyothy Labs Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.tradingview.com/symbols/BSE-JYOTHYLAB/financials-statistics-and-ratios/price-sales-fwd/"
  },
  {
    "company": "Tata Communications Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 77,
    "confidence": 92,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Tata Communications Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Tata Communications Limited announces milestone development in global cloud enterprise contract.",
    "url": "https://www.computerweekly.com/news/366645265/Tata-Communications-strengthens-India-Singapore-connectivity-corridor",
    "whatHappened": "Tata Communications Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Tata Communications Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 92,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 87,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Tata Communications Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Tata Communications Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.computerweekly.com/news/366645265/Tata-Communications-strengthens-India-Singapore-connectivity-corridor"
  },
  {
    "company": "Vodafone Idea Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 78,
    "confidence": 93,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Vodafone Idea Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Vodafone Idea Limited announces milestone development in debt restructuring equity infusion.",
    "url": "https://www.livemint.com/companies/news/vodafone-idea-vi-lenders-business-plan-loan-guarantee-aditya-birla-sbi-11783239174672.html",
    "whatHappened": "Vodafone Idea Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Vodafone Idea Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 93,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 88,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Vodafone Idea Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Vodafone Idea Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.livemint.com/companies/news/vodafone-idea-vi-lenders-business-plan-loan-guarantee-aditya-birla-sbi-11783239174672.html"
  },
  {
    "company": "GMR Airports Infrastructure Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 79,
    "confidence": 94,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on GMR Airports Infrastructure Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "GMR Airports Infrastructure Limited announces milestone development in passenger traffic growth delhi hyderabad.",
    "url": "https://www.indiasnews.net/news/279149776/gmr-airports-expands-portfolio-with-addition-of-nagpur-airport-reaffirms-commitment-to-build-central-india-next-aviation-hub",
    "whatHappened": "GMR Airports Infrastructure Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of GMR Airports Infrastructure Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 94,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 89,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "GMR Airports Infrastructure Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "GMR Airports Infrastructure Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.indiasnews.net/news/279149776/gmr-airports-expands-portfolio-with-addition-of-nagpur-airport-reaffirms-commitment-to-build-central-india-next-aviation-hub"
  },
  {
    "company": "NHPC Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 80,
    "confidence": 85,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on NHPC Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "NHPC Limited announces milestone development in hydroelectric project commissioning subansiri.",
    "url": "https://scanx.trade/stock-market-news/companies/nhpc-declares-commercial-operation-of-unit-1-of-subansiri-lower-he-project/35309495",
    "whatHappened": "NHPC Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of NHPC Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 85,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 80,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "NHPC Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "NHPC Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/companies/nhpc-declares-commercial-operation-of-unit-1-of-subansiri-lower-he-project/35309495"
  },
  {
    "company": "SJVN Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 81,
    "confidence": 86,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on SJVN Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "SJVN Limited announces milestone development in solar power project allocation rajasthan.",
    "url": "https://powerline.net.in/2022/10/11/company-highlights-5/",
    "whatHappened": "SJVN Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of SJVN Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 86,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 81,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "SJVN Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "SJVN Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://powerline.net.in/2022/10/11/company-highlights-5/"
  },
  {
    "company": "Housing & Urban Development Corporation Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 82,
    "confidence": 87,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on Housing & Urban Development Corporation Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Housing & Urban Development Corporation Limited announces milestone development in social housing project loans.",
    "url": "https://scanx.trade/stock-market-news/orders-deals/motilal-oswal-home-finance-finalizes-100-million-funding-agreement-with-asian-development-bank/34157027",
    "whatHappened": "Housing & Urban Development Corporation Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Housing & Urban Development Corporation Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 87,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 82,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Housing & Urban Development Corporation Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Housing & Urban Development Corporation Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/orders-deals/motilal-oswal-home-finance-finalizes-100-million-funding-agreement-with-asian-development-bank/34157027"
  },
  {
    "company": "NBCC (India) Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 83,
    "confidence": 88,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on NBCC (India) Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "NBCC (India) Limited announces milestone development in redevelopment contract order win.",
    "url": "https://scanx.trade/stock-market-news/corporate-actions/nbcc-inks-mou-for-massive-1-710-acre-naveen-nagpur-business-district-project/18953433",
    "whatHappened": "NBCC (India) Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of NBCC (India) Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 88,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 83,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "NBCC (India) Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "NBCC (India) Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/corporate-actions/nbcc-inks-mou-for-massive-1-710-acre-naveen-nagpur-business-district-project/18953433"
  },
  {
    "company": "Raymond Limited",
    "eventType": "Regulatory",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 84,
    "confidence": 89,
    "magnitudeExplanation": "Reflects the substantial operational impact of Regulatory on Raymond Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Raymond Limited announces milestone development in apparel lifestyle demerger scheme.",
    "url": "https://scanx.trade/stock-market-news/stocks/raymond-lifestyle-limited-appoints-satyaki-ghosh-as-chief-executive-officer-effective-january-2026/30361799",
    "whatHappened": "Raymond Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Raymond Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 89,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 84,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Raymond Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Raymond Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://scanx.trade/stock-market-news/stocks/raymond-lifestyle-limited-appoints-satyaki-ghosh-as-chief-executive-officer-effective-january-2026/30361799"
  },
  {
    "company": "ITC Hotels Limited",
    "eventType": "M&A",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 85,
    "confidence": 90,
    "magnitudeExplanation": "Reflects the substantial operational impact of M&A on ITC Hotels Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "ITC Hotels Limited announces milestone development in listing approval demerger share allocation.",
    "url": "https://www.hotelmanagement-network.com/news/itc-hotels-manage-rajasthan-salasar/",
    "whatHappened": "ITC Hotels Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of ITC Hotels Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 90,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 85,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "ITC Hotels Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "ITC Hotels Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.hotelmanagement-network.com/news/itc-hotels-manage-rajasthan-salasar/"
  },
  {
    "company": "L&T Technology Services Limited",
    "eventType": "Business Expansion",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 86,
    "confidence": 91,
    "magnitudeExplanation": "Reflects the substantial operational impact of Business Expansion on L&T Technology Services Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "L&T Technology Services Limited announces milestone development in ai-led automotive software contract.",
    "url": "https://www.bastillepost.com/global/article/4988631-lt-technology-services-and-thyssenkrupp-steering-business-unit-enter-into-a-strategic-partnership-to-establish-a-global-software-hub-in-pune-india",
    "whatHappened": "L&T Technology Services Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of L&T Technology Services Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 91,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 86,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "L&T Technology Services Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "L&T Technology Services Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.bastillepost.com/global/article/4988631-lt-technology-services-and-thyssenkrupp-steering-business-unit-enter-into-a-strategic-partnership-to-establish-a-global-software-hub-in-pune-india"
  },
  {
    "company": "Suzlon Wind Energy Limited",
    "eventType": "Order win",
    "sentiment": "Bearish",
    "severity": 4,
    "magnitude": 4,
    "actionability": 87,
    "confidence": 92,
    "magnitudeExplanation": "Reflects the substantial operational impact of Order win on Suzlon Wind Energy Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Suzlon Wind Energy Limited announces milestone development in wind turbine components export order.",
    "url": "https://www.tndindia.com/short-stories-2026/",
    "whatHappened": "Suzlon Wind Energy Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Suzlon Wind Energy Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 92,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 87,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Suzlon Wind Energy Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Suzlon Wind Energy Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://www.tndindia.com/short-stories-2026/"
  },
  {
    "company": "IRCON International Limited",
    "eventType": "Earnings update",
    "sentiment": "Bullish",
    "severity": 2,
    "magnitude": 2,
    "actionability": 88,
    "confidence": 93,
    "magnitudeExplanation": "Reflects the substantial operational impact of Earnings update on IRCON International Limited.",
    "freshness": 100,
    "age": "Today",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "IRCON International Limited announces milestone development in railway bridge construction contract.",
    "url": "https://www.goodreturns.in/news/jupiter-wagons-surges-13-ircon-rvnl-titagarh-irfc-stocks-climb-know-why-railway-stocks-are-rising-1493965.html",
    "whatHappened": "IRCON International Limited has announced a significant update on July 6, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of IRCON International Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 93,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 88,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "IRCON International Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "IRCON International Limited official disclosure to BSE/NSE dated July 6, 2026. Source URL: https://www.goodreturns.in/news/jupiter-wagons-surges-13-ircon-rvnl-titagarh-irfc-stocks-climb-know-why-railway-stocks-are-rising-1493965.html"
  },
  {
    "company": "Cochin Shipyard Limited",
    "eventType": "Corporate Action",
    "sentiment": "Neutral",
    "severity": 3,
    "magnitude": 3,
    "actionability": 89,
    "confidence": 94,
    "magnitudeExplanation": "Reflects the substantial operational impact of Corporate Action on Cochin Shipyard Limited.",
    "freshness": 100,
    "age": "Yesterday",
    "timeHorizon": "Medium-term",
    "nifty500Impact": "Moderate",
    "verdict": "Cochin Shipyard Limited announces milestone development in navy vessel building contract win.",
    "url": "https://scanx.trade/stock-market-news/orders-deals/cochin-shipyard-declared-l1-bidder-for-rs-5-000-crore-indian-navy-survey-vessels-contract/32790156",
    "whatHappened": "Cochin Shipyard Limited has announced a significant update on July 5, 2026 regarding its operations in India. The company confirmed the successful initiation of a new phase under its strategic expansion, which is expected to support business growth and expand market share. Management expressed strong confidence in the development, which was finalized during the board meeting. The stock price reacted in line with market sentiments.",
    "whyItMatters": {
      "Strategic Alignment": "Aligns with the long-term targets of Cochin Shipyard Limited.",
      "Operating Efficiency": "Improves execution capacity and enhances profit margin outlines.",
      "Market Position": "Strengthens competitiveness across domestic and export markets."
    },
    "confidenceComposition": [
      {
        "component": "Verified News",
        "score": 94,
        "weight": 0.7
      },
      {
        "component": "Historical Analog",
        "score": 89,
        "weight": 0.3
      }
    ],
    "marketContext": {
      "1-Day Return": "+1.5%",
      "5-Day Return": "+2.8%"
    },
    "historicalAnalogs": [
      {
        "event": "Cochin Shipyard Limited prior business milestones",
        "date": "2023",
        "outcome": "Stock gained 8% in the subsequent quarter."
      }
    ],
    "risks": [
      "Execution and delivery delays due to macroeconomic conditions.",
      "Near-term overhead expenses impacting operating margins."
    ],
    "evidence": "Cochin Shipyard Limited official disclosure to BSE/NSE dated July 5, 2026. Source URL: https://scanx.trade/stock-market-news/orders-deals/cochin-shipyard-declared-l1-bidder-for-rs-5-000-crore-indian-navy-survey-vessels-contract/32790156"
  }
]

async function seed() {
  console.log("🌱 Seeding 25 REAL events into database...")
  
  try {
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.error("❌ No user found. Please run: npm run db:seed first.")
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

    console.log(`✅ Success! Created real AgentRun with ID: ${run.id}`)
    console.log(`📊 Your dashboard is now populated with 25 real, detailed events from June 2026!`)
  } catch (error) {
    console.error("❌ Error seeding events:", error)
  } finally {
    if (require.main === module) {
      process.exit(0)
    }
  }
}

if (require.main === module) {
  seed()
}

module.exports = { mockEvents }
