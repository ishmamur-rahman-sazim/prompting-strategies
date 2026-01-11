

const FEW_SHOT_TEMPLATES = [
  {
    name: "Sentiment + Sarcasm + Intent Detection",
    description:
      "Detects sentiment, sarcasm, and the underlying intent using examples.",
    system:
      "You analyze user feedback to identify sentiment, sarcasm, and intent.",
    prompt: `For each input, identify:
1) Sentiment: Positive, Negative, or Neutral
2) Sarcasm: Yes or No
3) Intent: Praise, Complaint, or Suggestion

Examples:
Input: "Oh great, the app crashed again. Just what I needed today."
Output:
Sentiment: Negative
Sarcasm: Yes
Intent: Complaint
---
Input: "The new update looks good, but the loading time could be improved."
Output:
Sentiment: Neutral
Sarcasm: No
Intent: Suggestion
---
Input: "Fantastic customer support—my issue was fixed in minutes."
Output:
Sentiment: Positive
Sarcasm: No
Intent: Praise
---
Now analyze this input:
""Love how fast the UI loads. Too bad every API call feels like it’s taking a coffee break."
Output:`,
  },
  {
    name: "SQL Generator",
    description: "Converts natural language to SQL based on schema.",
    system: "Convert user input into a valid SQL query based on app schema: Users(id, name, email, signup_date).",
    prompt: `Input: Show me all users
Output: SELECT * FROM Users;
---
Input: Count the users
Output: SELECT COUNT(*) FROM Users;
---
Input: Find the email of the user named 'Alice'
Output:`,
  },
];

export default FEW_SHOT_TEMPLATES;