
const ZERO_SHOT_TEMPLATES = [
  {
    name: "Summarize Tech Article",
    description: "Summarizes a complex text into a single paragraph.",
    prompt: `Summarize the following text into 3 sentences:
'Global warming is widely recognized as one of the most pressing environmental challenges of the modern era, with extensive scientific research demonstrating a clear rise in average global temperatures over the past century. According to data synthesized by the Intergovernmental Panel on Climate Change (IPCC), this warming trend is strongly linked to increased concentrations of greenhouse gases, particularly carbon dioxide and methane, which are primarily released through human activities such as fossil fuel combustion, deforestation, and industrial processes. Empirical studies indicate that the consequences of global warming are already observable, including more frequent heatwaves, accelerated glacial melting, rising sea levels, and shifts in precipitation patterns. These changes pose significant risks to ecosystems, food security, and human health, especially in vulnerable regions. Research further suggests that without substantial mitigation efforts, global temperatures could exceed critical thresholds, leading to irreversible environmental damage. In response, scientists emphasize the importance of coordinated international action, technological innovation, and policy interventions aimed at reducing emissions and enhancing climate resilience. Overall, the research consensus underscores that global warming is not a distant or hypothetical concern, but a measurable and escalating phenomenon requiring immediate and sustained global attention.`,
  },
  {
    name: "Sentiment Analysis",
    description: "Determines the emotion behind a review.",
    prompt: `Classify the sentiment of this review as Positive, Negative, or Neutral:
'The interface was smooth, but the API latency was absolutely unacceptable for production use.'`,
  },
];

export default ZERO_SHOT_TEMPLATES;