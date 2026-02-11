export const COT_TEMPLATES = [
  {
    name: "Tiered Pricing Calculator (Math Reasoning)",
    description:
      "Forces the model to show step-by-step math for complex tiered billing logic to prevent calculation errors.",
    system:
      "You are a billing engine. You must calculate costs step-by-step. Do not just guess the final number.",
    prompt: `Calculate the total cost for a customer usage of **12,500 API requests**.

The pricing structure is tiered (progressive):
1. First 1,000 requests: Free
2. Next 4,000 requests (1,001 to 5,000): $0.05 per request
3. Next 5,000 requests (5,001 to 10,000): $0.04 per request
4. Any requests above 10,000: $0.02 per request

INSTRUCTIONS:
You must output your response in this exact format:
- Step 1: Break down the 12,500 total into each tier bucket.
- Step 2: Calculate the cost for each bucket independently.
- Step 3: Sum the costs.
- Final Answer: The total dollar amount.

Let's think step by step.
`
  },
  {
    name: "Legal Compliance Auditor (Logic Reasoning)",
    description:
      "Analyzes a complex user scenario against multiple conflicting policy rules.",
    system:
      "You are a strict compliance officer. You evaluate scenarios against specific policy clauses.",
    prompt: `Determine if the following employee expense request should be APPROVED or REJECTED.

SCENARIO:
Employee John spent $150 on a team dinner on a Tuesday night. He included alcohol ($40) in the bill. He is a 'Level 3' engineer.

POLICY RULES:
1. Team dinners are allowed up to $200.
2. Alcohol is ONLY allowed if the employee is 'Level 4' or above, OR if it is a Friday.
3. If a rule is violated, the ENTIRE expense is rejected, not just the violating part.

RESPONSE FORMAT:
Reasoning:
1. Analyze Rule 1 against the scenario.
2. Analyze Rule 2 against the scenario.
3. Analyze Rule 3 based on previous findings.
Conclusion: APPROVED or REJECTED.

Let's analyze the policy violations step by step:
`
  },
  {
    name: "Root Cause Debugger (Deductive Reasoning)",
    description:
      "Uses elimination logic to identify a system failure from logs.",
    system:
      "You are a Senior DevOps Engineer. Use deductive reasoning to find the root cause.",
    prompt: `Analyze the system logs below and identify the root cause of the crash.

LOGS:
[10:00:01] INFO: App started. Memory Usage: 200MB.
[10:00:05] INFO: User upload started (file_size: 5GB).
[10:00:10] WARN: Memory Usage spiked to 1.8GB.
[10:00:11] ERROR: Connection to DB timed out.
[10:00:12] FATAL: Process exited with code 137 (OOM Killed).

CONTEXT:
- The server has a hard limit of 2GB RAM.
- The DB timeout usually happens if the CPU is frozen or network is down.
- Error 137 in Linux/Docker usually means "Out Of Memory".

INSTRUCTIONS:
Do not jump to conclusions. Think through the timeline:
1. Identify the trigger event.
2. Analyze the resource consumption.
3. Correlate the DB error with the resource issue (is it a cause or a symptom?).
4. State the definitive root cause.

Reasoning Trace:
`
  }
];

export default COT_TEMPLATES;
