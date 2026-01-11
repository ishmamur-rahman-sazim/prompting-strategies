import { callModel } from "../core/llm_client.js";

const runZeroShot = async (input) => {
  return await callModel(input);
}

export default runZeroShot;
