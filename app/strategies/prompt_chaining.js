import { callModel } from "../core/llm_client.js";

const runPromptChaining = async (template, onStepStart) => {
    const steps = template.prompt; 
    let currentContext = ""; 
    const chainHistory = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    for (let i = 0; i < steps.length; i++) {
        const stepPrompt = steps[i];
        
        if (onStepStart) onStepStart(`Step ${i + 1}`, i + 1, steps.length);

        const fullPrompt = i === 0 
            ? stepPrompt 
            : `${stepPrompt}\n\n---\nINPUT CONTEXT: ${currentContext}\n---`;

        const result = await callModel(fullPrompt, template.system);

        chainHistory.push({
            stepName: `Step ${i+1}`,
            input: fullPrompt,
            output: result.response,
            metrics: result.metrics
        });

        totalInputTokens += result.metrics.inputTokens;
        totalOutputTokens += result.metrics.outputTokens;

        currentContext = result.response;
    }

    return {
        response: currentContext, // <--- FIXED: Changed from 'finalResponse' to 'response'
        history: chainHistory,    // We will use this in run.js next
        metrics: {
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            tps: (chainHistory.reduce((acc, curr) => acc + curr.metrics.tps, 0) / chainHistory.length).toFixed(2)
        }
    };
}

export default runPromptChaining;