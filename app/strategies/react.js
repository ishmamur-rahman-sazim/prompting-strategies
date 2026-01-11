import { callModel } from '../core/llm_client.js';

// A "Mock" Tool for our experiment
const tools = {
    get_weather: (city) => `The weather in ${city} is 22°C and sunny.`
};

const runReAct = async (userInput) => {
    const systemPrompt = `
    You operate by thinking, then acting.
    Format:
    Thought: <your reasoning>
    Action: tool_name[argument]
    Observation: <result of action>
    Final Answer: <your final response>

    Available tools: get_weather[city]
    `;

    // Step 1: Initial Thought and Action
    let response = await callModel(`Question: ${userInput}`, systemPrompt);
    console.log("--- LLM Thought/Action ---\n", response);

    // Step 2: Manual Parsing (Raw JS)
    const actionMatch = response.match(/Action:\s*(\w+)\[(.*?)\]/);
    
    if (actionMatch) {
        const [_, toolName, arg] = actionMatch;
        
        if (tools[toolName]) {
            console.log(`--- Executing Tool: ${toolName}(${arg}) ---`);
            const observation = tools[toolName](arg);
            
            // Step 3: Feed observation back to LLM for Final Answer
            const finalPrompt = `${response}\nObservation: ${observation}\nThought: Now I have the info.\nFinal Answer:`;
            return await callModel(finalPrompt, systemPrompt);
        }
    }
    
    return response;
}

export default runReAct;