
// Re-export everything from the aiStrategy folder
export * from './aiStrategy';

// Export a default object for backward compatibility
import { availableAIModels } from './aiStrategy/models';
import { strategyPrompts } from './aiStrategy/prompts';
import { generateStrategy, compareAIModels } from './aiStrategy/generation';

export default {
  availableAIModels,
  strategyPrompts,
  generateStrategy,
  compareAIModels
};
