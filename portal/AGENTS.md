<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:date-preservation-rules -->
# Date and Fact Preservation Guideline

1. **Do Not Alter Historical Dates**: All corporate announcements, press releases, exchange filings, and news articles have static, verifiable publication dates (e.g. July 5, 2026). The text content in the `whatHappened`, `verdict`, and `evidence` fields must preserve these exact historical dates.
2. **Never Shift Dates for Recency**: Do not programmatically or manually replace date strings inside descriptions or text fields to match current runs or scheduling windows (e.g., do not change "July 5" to "July 14").
3. **Handle Recency via Metadata**: If you need to evaluate or display event recency, use separate metadata fields like the `age` property, `freshness` score, or the run's `startedAt`/`completedAt` timestamps. Let the user interface render age labels (e.g., "10 days ago") dynamically while keeping the primary evidence text factually correct.
4. **Audit and Cross-Reference**: Ensure the date mentioned in the `evidence` field aligns 100% with the source URL publication metadata to prevent compliance or data integrity audits from failing.
<!-- END:date-preservation-rules -->
