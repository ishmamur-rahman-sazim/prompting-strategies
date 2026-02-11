import { callModel } from "../core/llm_client.js";

const runPrompt = async (template) => {
  return await callModel(template.prompt, template.system);
};

export default runPrompt;
