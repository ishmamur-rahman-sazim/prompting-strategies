import { config } from "./config.js";

export async function callModel(
  prompt,
  systemInstruction = "You are a helpful assistant."
) {
  const payload = {
    model: config.model,
    prompt: prompt,
    system: systemInstruction,
    stream: false,
    options: {
      temperature: 0.7
    }
  };

  const response = await fetch(config.baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Ollama Error:", JSON.stringify(data, null, 2));
    throw new Error(
      `HTTP ${response.status}: ${data.error || "Unknown Error"}`
    );
  }

  // Ollama returns the text in the .response field
  return {
    response: data.response,
    metrics: {
      inputTokens: data.prompt_eval_count,
      outputTokens: data.eval_count,
      tps: (data.eval_count / (data.eval_duration / 1e9)).toFixed(2)
      // totalTime: (data.total_duration / 1e9).toFixed(2),
      // loadTime: (data.load_duration / 1e9).toFixed(2)
    }
  };
}
