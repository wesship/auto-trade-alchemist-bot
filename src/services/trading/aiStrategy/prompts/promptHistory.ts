
import { StrategyPrompt, PromptVersion } from './promptTypes';

/**
 * Mock version history for strategy prompts
 * In a real application, this would be stored in a database
 */
const promptVersionHistory: Record<string, PromptVersion[]> = {};

/**
 * Get version history for a prompt
 */
export const getPromptVersionHistory = (promptId: string): PromptVersion[] => {
  return promptVersionHistory[promptId] || [];
};

/**
 * Add new version to prompt history
 */
export const addPromptVersion = (
  promptId: string, 
  version: string, 
  prompt: string, 
  changes: string
): void => {
  if (!promptVersionHistory[promptId]) {
    promptVersionHistory[promptId] = [];
  }
  
  promptVersionHistory[promptId].push({
    version,
    prompt,
    updatedAt: new Date().toISOString(),
    changes
  });
};

/**
 * Get a specific version of a prompt
 */
export const getPromptVersion = (promptId: string, version: string): PromptVersion | null => {
  const history = promptVersionHistory[promptId] || [];
  return history.find(v => v.version === version) || null;
};

/**
 * Compare two versions of a prompt
 */
export const comparePromptVersions = (
  promptId: string, 
  version1: string, 
  version2: string
): { additions: string[], removals: string[] } => {
  const v1 = getPromptVersion(promptId, version1);
  const v2 = getPromptVersion(promptId, version2);
  
  if (!v1 || !v2) {
    return { additions: [], removals: [] };
  }
  
  // A very simple diff implementation - in a real app use a proper diff algorithm
  const lines1 = v1.prompt.split('\n');
  const lines2 = v2.prompt.split('\n');
  
  const additions = lines2.filter(line => !lines1.includes(line));
  const removals = lines1.filter(line => !lines2.includes(line));
  
  return { additions, removals };
};
