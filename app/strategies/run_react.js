import { callModel } from "../core/llm_client.js";

const tools = {
  get_weather: (city) => `The weather in ${city} is 22°C and sunny.`
};

const runReAct = async (template, onStepStart) => {
  const history = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  const systemPrompt =
    template.system ||
    `
    You operate by thinking, then acting.
    Format:
    Thought: <your reasoning>
    Action: tool_name[argument]
    Observation: <result of action>
    Final Answer: <your final response>
    Available tools: ${Object.keys(tools).join(", ")}
  `;

  const initialPrompt = template.prompt;
  if (onStepStart) {
    onStepStart("Initial Reasoning", 1, 2);
  }

  const res1 = await callModel(initialPrompt, systemPrompt);
  const initialResponse = res1.response;

  history.push({
    stepName: "1. Initial Reasoning",
    input: initialPrompt,
    output: initialResponse,
    metrics: res1.metrics
  });

  totalInputTokens += res1.metrics.inputTokens;
  totalOutputTokens += res1.metrics.outputTokens;
  const actionMatch = initialResponse.match(/Action:\s*(\w+)\[(.*?)\]/);
  let finalResponse = initialResponse;
  let step2Name = "2. No Action Taken";

  if (actionMatch) {
    const [, toolName, arg] = actionMatch;
    if (tools[toolName]) {
      if (onStepStart) onStepStart(`Tool Execution: ${toolName}`, 2, 2);
      step2Name = `2. Tool: ${toolName}`;
      const observation = tools[toolName](arg);
      const finalPrompt = `${initialResponse}\nObservation: ${observation}\nThought: Now I have the info.\nFinal Answer:`;
      const res2 = await callModel(finalPrompt, systemPrompt);
      finalResponse = res2.response;
      history.push({
        stepName: step2Name,
        input: finalPrompt,
        output: finalResponse,
        metrics: res2.metrics
      });
      totalInputTokens += res2.metrics.inputTokens;
      totalOutputTokens += res2.metrics.outputTokens;
    }
  }

  return {
    response: finalResponse,
    history: history,
    metrics: {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      tps: (
        history.reduce((acc, curr) => acc + curr.metrics.tps, 0) /
        history.length
      ).toFixed(2)
    }
  };
};
export default runReAct;
