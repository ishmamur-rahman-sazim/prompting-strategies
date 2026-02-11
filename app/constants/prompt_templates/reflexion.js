const REFLEXION_TEMPLATES = [
  {
    name: "Faithfulness Checker (Hallucination Fix)",
    description:
      "Drafts an answer -> Critiques if it used outside info -> Rewrites faithfully.",
    system:
      "You are a strict documentation assistant. You must never hallucinate.",
    prompt: [
      // Step 1: Draft
      `Context: "The 'Titan' database supports vector indexing but does NOT support full-text search. Users must use a separate service like Elasticsearch for keyword queries."

User Question: "How do I perform a keyword search in Titan?"

Draft an answer based on the context.`,

      // Step 2: Critique
      `Review the DRAFT provided below.
Does it explicitly state that Titan supports keyword search?
Does it hallucinate features not mentioned in the context?
Output a critique listing any factual errors.`,

      // Step 3: Revise
      `You are an editor.
Read the ORIGINAL DRAFT and the CRITIQUE.
Rewrite the draft to fix all errors mentioned in the critique. Ensure the final answer is 100% faithful to the context.`
    ]
  },
  {
    name: "Code Security Review (Insecure -> Secure)",
    description:
      "Writes code -> Critiques for vulnerabilities -> Patches the code.",
    system: "You are a Senior Security Engineer.",
    prompt: [
      // Step 1: Draft (Intentionally Naive)
      `Write a Javascript function to authenticate a user by checking a database query.
Use a simple string concatenation for the SQL query.`,

      // Step 2: Critique
      `Review the code above for security vulnerabilities (specifically SQL Injection).
Explain WHY the code is dangerous.`,

      // Step 3: Revise
      `Rewrite the code to fix the vulnerabilities identified in the critique.
Use parameterized queries or prepared statements.`
    ]
  },
  {
    name: "Algorithm Optimization (O(n²) -> O(n))",
    description:
      "Generates a naive solution -> Critiques time complexity -> Optimizes performance.",
    system:
      "You are a Senior Backend Engineer obsessed with high-performance computing.",
    prompt: [
      // Step 1: Draft (Force a naive/bad approach)
      `Write a Python function called 'find_two_sum(nums, target)' that returns the indices of two numbers that add up to the target.
            
            Constraint: Implement this using the Brute Force method (Nested Loops).
            Do not use any advanced data structures yet.`,

      // Step 2: Critique (Analyze Performance)
      `Analyze the Time Complexity (Big O notation) of the code above.
            
            Scenario: Imagine the 'nums' array has 10 million elements. 
            Critique why the current nested-loop implementation would cause a specialized server to hang or timeout.`,

      // Step 3: Revise (Optimize)
      `Rewrite the function to solve the problem with O(n) Linear Time complexity.
            
            Strategy: Use a Hash Map (Dictionary) to store complements while iterating once. 
            Ensure the logic handles the lookup efficiently.`
    ]
  },
  {
    name: "Tone Polish (Angry -> Professional)",
    description:
      "Writes a raw email -> Critiques tone -> Polishes for professional context.",
    system: "You are an executive communications coach.",
    prompt: [
      // Step 1: Draft (Emotional)
      `Write an email to the engineering team telling them the new feature is garbage and they need to work this weekend to fix it.`,

      // Step 2: Critique
      `Analyze the tone of the draft above.
Identify phrases that are unprofessional, demotivating, or toxic.`,

      // Step 3: Revise
      `Rewrite the email to convey the urgency and quality issues, but use a supportive, professional, and constructive tone.
Keep the core message (needs fixing) but remove the toxicity.`
    ]
  }
];

export default REFLEXION_TEMPLATES;
