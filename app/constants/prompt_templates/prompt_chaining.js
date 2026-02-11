const PROMPT_CHAINING_TEMPLATES = [
  {
    name: "Chat With Documentation Chain (Retrieve → Answer Faithfully)",
    description:
      "Extracts top 3 relevant paragraphs → answers using only them → says 'I don't know' if missing.",
    system:
      "You are a support assistant that must ground answers in provided documentation only.",
    prompt: [
      // Step 1 — Retrieval (works with your KB search)
      `You are a documentation retriever.
Given the user query below, return the TOP 3 most relevant paragraphs from the Knowledge Base.
Return ONLY a JSON array of 3 strings (each string is one paragraph). No extra text.

User query: "How do I fix Error 505?"

Knowledge Base (paragraphs):
[Paragraph A] "Error 404 indicates the requested resource could not be found. Check the URL and routing configuration."
[Paragraph B] "Error 505 indicates the server did not support the HTTP protocol version used in the request. Fixes include updating client libraries, checking proxy/gateway configuration, and ensuring the server supports the requested protocol."
[Paragraph C] "Gateway timeouts often present as 504 errors. Mitigations include increasing upstream timeouts and reducing payload sizes."
[Paragraph D] "If you see 401 errors, verify authentication tokens and session expiration policies."
[Paragraph E] "When using a gateway, mismatched protocol versions between gateway and upstream can trigger 505-like failures."`,

      // Step 2 — Answer ONLY from retrieved paragraphs (faithfulness)
      `Using ONLY the paragraphs in Output 1, answer the user's question.
If the paragraphs do not contain enough information, reply exactly: "I don't know".
Keep the answer under 5 sentences.

Output 1:`
    ]
  },
  {
    name: "Billing Routing (Translate → Service)",
    description:
      "Translate query (if needed) → choose the correct service for the request.",
    system: "You are a routing assistant. Follow the output rules exactly.",
    prompt: [
      // Step 1 — Translate to English (Zero-shot)
      `Translate the following user query to English. Output ONLY the English translation.
User query (Bangla):
"আমার গত তিন মাসের বিলগুলো ডাউনলোড করতে চাই, বিশেষ করে যেগুলো এখনো পেইড হয়নি।"`,

      // Step 2 — Choose service (Few-shot)
      `Choose exactly ONE service from the list below that can fulfill the request.
Return ONLY the service name (no extra text).
AVAILABLE_SERVICES = [BillingService, AnalyticsService, SupportService]

Routing rules:
- Downloading invoices/bills/statements -> BillingService
- Trends/graphs/insights/summary over time -> AnalyticsService
- Error help/how-to/support issues -> SupportService

Examples:
User (English): "Download my invoices for last month"
Output: BillingService
---
User (English): "Show my spending trend over the last 6 months"
Output: AnalyticsService
---
User (English): "How do I fix Error 505?"
Output: SupportService
---
Now route this user request (English):
`
    ]
  },
  {
    name: "Open-Ended Spending QA (Final Output JSON)",
    description:
      "Parse data → compute summaries → answer any question → wrap final result as JSON.",
    system:
      "You are a practical finance assistant. Use only provided data. Follow output rules exactly.",
    prompt: [
      // Step 1
      `You will receive personal finance data (income + expenses by category).
Convert it into structured JSON.
Output ONLY valid JSON in this schema:

{
"months": [
    {
    "month": "YYYY-MM",
    "income": number,
    "expenses": {
        "rent": number,
        "food": number,
        "transport": number,
        "shopping": number,
        "entertainment": number,
        "utilities": number,
        "other": number
    }
    }
]
}

DATA:
"""
2026-01
Income: 4200
Rent: 1500
Food: 620
Transport: 210
Shopping: 780
Entertainment: 260
Utilities: 180
Other: 150

2026-02
Income: 4200
Rent: 1500
Food: 590
Transport: 200
Shopping: 640
Entertainment: 220
Utilities: 175
Other: 130
"""
`,

      // Step 2
      `Using ONLY the INPUT CONTEXT (Output of Step 1), compute summaries and output ONLY valid JSON:

{
"monthly_summary": [
    {
    "month": "YYYY-MM",
    "total_income": number,
    "total_expenses": number,
    "net_savings_possible": number,
    "top_3_expense_categories": [
        { "category": string, "amount": number }
    ]
    }
],
"category_totals_all_months": [
    { "category": string, "amount": number }
],
"category_trend_latest_vs_previous": [
    { "category": string, "trend": "UP" | "DOWN" | "FLAT", "delta": number }
],
"latest_month": "YYYY-MM"
}

Rules:
- total_expenses = sum of all expense categories for that month
- net_savings_possible = total_income - total_expenses
- category_totals_all_months sums each category across all months
- category_trend_latest_vs_previous compares latest month to previous month; delta = latest - previous`,

      // Step 3
      `Answer the USER_QUESTION using ONLY the INPUT CONTEXT (Output of Step 2).
If the question cannot be answered from the data, say: "I don't know based on the provided data."
Keep the answer short (max 5 sentences). Output TEXT ONLY.
USER_QUESTION:
"<<PUT QUESTION HERE>>"`,

      // Step 4
      `You are now producing the FINAL OUTPUT of the chain.
Using ONLY the INPUT CONTEXT (Output of Step 3), output ONLY valid JSON in this schema:

{
"question": string,
"answer": string,
"decision_guidance": {
    "needed": boolean,
    "decision": string,
    "why": [string, string],
    "actions": [
    { "action": string, "category": string, "expected_monthly_impact": number }
    ]
}
}

Rules:
- Set question = the exact USER_QUESTION text (copy it as-is).
- Set answer = the exact answer text from the input context.
- decision_guidance.needed = true ONLY if the user question asks for advice, a plan, optimization, budgeting, or achieving a savings goal.
- If needed=false, set decision=""; why=[]; actions=[].
- If needed=true, actions must be realistic and based on typical variable categories (shopping, entertainment, other, food). Keep impacts plausible (e.g., do not exceed the current category spend for latest month).`
    ]
  }
];

export default PROMPT_CHAINING_TEMPLATES;
