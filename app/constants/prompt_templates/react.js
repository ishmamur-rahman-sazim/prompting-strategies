const REACT_TEMPLATES = [
  {
    name: "Stock Trader Agent (Reason → Action → Decision)",
    description:
      "Evaluates a trade condition → Checks simulated market data → Executes trade.",
    system:
      "You are an autonomous trading agent. Use the ReAct format: Thought, Action, Observation.",
    prompt: [
      // Step 1: Agent receives command, decides to check price
      `User Command: "If Apple (AAPL) is under $180, buy 10 shares. Otherwise, hold."
            
AVAILABLE TOOLS:
- get_stock_price(symbol)
- execute_buy(symbol, quantity)
- execute_hold()

Based on the command, output your first Thought and Action.
Output format:
Thought: [Your reasoning]
Action: [The tool call]`,

      // Step 2: Environment returns price, Agent decides to buy
      `You are the Agent.
            
PREVIOUS HISTORY:
{{INPUT_CONTEXT}}

---
OBSERVATION from Environment:
get_stock_price("AAPL") returned: "$175.50"
---

Based on this observation and your original goal, output the next Thought and Action.`,

      // Step 3: Environment confirms trade, Agent summarizes
      `You are the Agent.

PREVIOUS HISTORY:
{{INPUT_CONTEXT}}

---
OBSERVATION from Environment:
execute_buy("AAPL", 10) returned: "Success. Transaction ID: #998877"
---

Based on this, provide the Final Answer to the user.`
    ]
  },
  {
    name: "Smart Home Manager (Sensor → Logic → Action)",
    description:
      "User complains about temp → Agent checks sensor → Agent adjusts thermostat.",
    system:
      "You are a smart home controller (IoT). Available tools: [check_sensor(room), set_thermostat(room, temp)].",
    prompt: [
      // Step 1: Analyze complaint
      `User Query: "It's freezing in the baby's room!"

Determine the necessary information to retrieve before acting.
Output ONLY:
Thought: ...
Action: ...`,

      // Step 2: React to sensor data
      `The system has executed your action.

PREVIOUS AGENT STATE:
{{INPUT_CONTEXT}}

OBSERVATION:
check_sensor("nursery") returned: "Temperature: 62°F (16°C). Status: Window Open."

Output your next Thought and Action. Note: You cannot heat a room with a window open.`,

      // Step 3: Final notification
      `The system has executed your action.

PREVIOUS AGENT STATE:
{{INPUT_CONTEXT}}

OBSERVATION:
send_notification("parent_app") returned: "Sent."

Output the Final Answer to the user.`
    ]
  },
  {
    name: "Wikipedia Researcher (Search → Read → Synthesize)",
    description: "Complex question → Search API → Content Retrieval → Answer.",
    system: "You are a researcher. You must cite your source.",
    prompt: [
      // Step 1: Initial Search Strategy
      `Question: "Who is the CEO of the company that created the PlayStation 5?"

You have access to: [Wikipedia_Search, Wikipedia_Read].
Write your reasoning and the first tool call to find the COMPANY name first.
Format:
Thought: ...
Action: ...`,

      // Step 2: Process Search Results
      `PREVIOUS: {{INPUT_CONTEXT}}

OBSERVATION:
Wikipedia_Search returned: ["Sony Interactive Entertainment", "PlayStation Studios", "Sony Group Corporation"]

Now, decide which page to read to find the CEO.
Thought: ...
Action: ...`,

      // Step 3: Synthesize Answer
      `PREVIOUS: {{INPUT_CONTEXT}}

OBSERVATION:
Wikipedia_Read("Sony Interactive Entertainment") returned: "Sony Interactive Entertainment (SIE) is a multinational video game and digital entertainment company... The current President and CEO is Jim Ryan (until March 2024), succeeded by Hiroki Totoki."

Final Answer:`
    ]
  }
];

export default REACT_TEMPLATES;
