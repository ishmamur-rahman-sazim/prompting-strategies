import { callModel } from "../core/llm_client.js";

async function runReflexion(template, onStepStart) {
  const steps = template.prompt;
  const history = [];

  let draft = "";
  let critique = "";
  let finalRevision = "";

  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  if (onStepStart) {
    onStepStart("Generating Draft", 1, 3);
  }

  const res1 = await callModel(steps[0], template.system);
  draft = res1.response;

  history.push({ stepName: "1. Draft", input: steps[0], output: draft });
  totalInputTokens += res1.metrics.inputTokens;
  totalOutputTokens += res1.metrics.outputTokens;

  if (onStepStart) {
    onStepStart("Critiquing", 2, 3);
  }
  const critiquePrompt = `${steps[1]}\n\n--- DRAFT TO REVIEW ---\n${draft}`;

  const res2 = await callModel(critiquePrompt, template.system);
  critique = res2.response;

  history.push({
    stepName: "2. Critique",
    input: critiquePrompt,
    output: critique
  });
  totalInputTokens += res2.metrics.inputTokens;
  totalOutputTokens += res2.metrics.outputTokens;

  if (onStepStart) {
    onStepStart("Revising", 3, 3);
  }
  const revisionPrompt = `${steps[2]}\n\n--- ORIGINAL DRAFT ---\n${draft}\n\n--- CRITIQUE ---\n${critique}`;

  const res3 = await callModel(revisionPrompt, template.system);
  finalRevision = res3.response;

  history.push({
    stepName: "3. Revision",
    input: revisionPrompt,
    output: finalRevision
  });
  totalInputTokens += res3.metrics.inputTokens;
  totalOutputTokens += res3.metrics.outputTokens;

  return {
    response: finalRevision,
    history: history,
    metrics: {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      tps: (
        (res1.metrics.tps + res2.metrics.tps + res3.metrics.tps) /
        3
      ).toFixed(2)
    }
  };
}

export default runReflexion;
