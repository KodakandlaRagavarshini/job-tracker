export const simulateChatResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('improve') || msg.includes('resume')) {
    return 'I recommend adding more quantifiable achievements. For example, instead of "Improved performance", use "Improved performance by 35% using React.memo". Also, ensure your keywords match the target job description!';
  }
  if (msg.includes('frontend') || msg.includes('front-end')) {
    return 'For Frontend roles, I highly recommend highlighting skills in React, Next.js, TypeScript, and state management libraries like Redux or Zustand. Adding a link to a live portfolio is also a huge plus!';
  }
  if (msg.includes('match') || msg.includes('jobs')) {
    return 'Based on typical software engineering profiles, you have a strong 85% match for the "Senior Full Stack Engineer" role. Would you like to view your personalized recommendations?';
  }
  if (msg.includes('hello') || msg.includes('hi')) {
    return 'Hello! I am your HireMate AI Copilot. I can help you improve your resume, suggest career paths, and match you with open roles. How can I assist you today?';
  }
  
  return 'Interesting! While I am currently a simulated AI for this demo platform, in a production environment I would use an advanced LLM API to analyze your history and provide a highly personalized suggestion for that request.';
};

export const simulateResumeScore = () => {
  return {
    score: Math.floor(Math.random() * 20) + 75, // 75 to 95
    skillsMatch: Math.floor(Math.random() * 20) + 70, // 70 to 90
    keywordMatch: Math.floor(Math.random() * 30) + 60,
    formatting: Math.floor(Math.random() * 10) + 85,
    recommendations: [
      "Add more measurable metrics (e.g., increased efficiency by X%).",
      "Include missing keywords detected in related roles: 'Tailwind CSS', 'GraphQL'.",
      "Shorten your executive summary to 3-4 impactful sentences."
    ]
  };
};

export const extractDummyKeywords = () => {
    return ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'TypeScript', 'Tailwind CSS', 'Redux'];
};
