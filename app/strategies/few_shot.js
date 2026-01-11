import { callModel } from "../core/llm_client.js";

const runFewShot = async (template) => {
    return await callModel(template.prompt, template.system);
}

export default runFewShot;