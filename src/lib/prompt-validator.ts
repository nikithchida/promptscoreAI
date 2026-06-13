/**
 * Prompt Validator Engine
 * Checks if a given input text is a valid AI prompt according to prompt engineering guidelines.
 */
export function isValidPrompt(promptText: string): { isValid: boolean; reason?: string } {
  const trimmed = promptText.trim();
  if (!trimmed) {
    return { isValid: false, reason: "Empty input" };
  }

  // Split into words, removing punctuation
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordsCleaned = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);

  // 1. Single-word check
  if (words.length <= 1) {
    return { isValid: false, reason: "Single-word input" };
  }

  const lowercase = trimmed.toLowerCase();

  // 2. Greetings-only check
  const greetings = [
    "hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening", 
    "yo", "sup", "howdy", "morning", "evening", "afternoon", "welcome"
  ];
  const isAllGreetings = wordsCleaned.every(w => greetings.includes(w) || w === "there" || w === "to" || w === "you");
  if (isAllGreetings) {
    return { isValid: false, reason: "Greeting only" };
  }

  // 3. Casual conversation / basic phrases check
  const casualPhrases = [
    "how are you", "what are you doing", "what's up", "whats up", "how's it going", "hows it going",
    "are you there", "are you real", "thank you", "thanks", "ok", "okay", "yes", "no", "cool", "nice",
    "test", "abc", "do something", "make it better", "help", "lorem ipsum", "what is your name",
    "who are you"
  ];
  const normalizedText = lowercase.replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
  if (casualPhrases.some(phrase => normalizedText === phrase || normalizedText.startsWith(phrase + " ") || normalizedText.endsWith(" " + phrase))) {
    return { isValid: false, reason: "Casual conversation" };
  }

  // 4. Meaningful words check (Fewer than 3 meaningful words)
  const stopWords = new Set([
    "a", "an", "the", "to", "is", "am", "are", "was", "were", "be", "been", "being", "in", "on", "at", 
    "of", "for", "with", "by", "about", "against", "between", "into", "through", "during", "before", 
    "after", "above", "below", "from", "up", "down", "in", "out", "off", "over", "under", "again", 
    "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", 
    "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", 
    "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "i", "me", 
    "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", 
    "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", 
    "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", 
    "those", "have", "has", "had", "having", "do", "does", "did", "doing", "please", "thanks", "thank", 
    "ok", "okay", "yes", "no", "cool", "nice", "hello", "hi", "hey", "test", "abc", "morning", "afternoon", "evening"
  ]);

  const meaningfulWords = wordsCleaned.filter(w => w.length > 0 && !stopWords.has(w));
  if (meaningfulWords.length < 3) {
    return { isValid: false, reason: "Fewer than 3 meaningful words" };
  }

  // 5. Instruction verbs & Intent Detection
  const actionVerbs = [
    "write", "create", "generate", "explain", "analyze", "summarize", "design", "compare", 
    "optimize", "build", "develop", "translate", "classify", "refactor", "solve", "calculate",
    "list", "describe", "find", "implement", "draft", "make", "format", "convert"
  ];
  const instructionKeywords = [
    "how to", "how do", "can you", "could you", "please", "give me", "tell me", "show me", 
    "what is", "why does", "how does", "help me with", "act as", "you are", "instruction", "objective"
  ];

  const hasActionVerb = actionVerbs.some(verb => wordsCleaned.includes(verb));
  const hasInstructionKeyword = instructionKeywords.some(keyword => lowercase.includes(keyword));

  if (!hasActionVerb && !hasInstructionKeyword) {
    return { isValid: false, reason: "No instruction or task detected" };
  }

  return { isValid: true };
}
