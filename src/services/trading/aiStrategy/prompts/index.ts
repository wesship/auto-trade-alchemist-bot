
import { strategyPrompts } from './baseStrategyPrompts';
import { pineScriptPrompts } from './pineScriptPrompts';
import { advancedPineScriptPrompts } from './advancedPineScriptPrompts';
import { promptTags } from './promptTags';

// Export types and utilities
export * from './promptTypes';
export * from './promptFilters';
export * from './promptHistory';
export * from './promptTags';

// Merge the advanced prompts into the pineScriptPrompts object
const mergedPineScriptPrompts = {
  ...pineScriptPrompts,
  ...advancedPineScriptPrompts
};

export {
  strategyPrompts,
  mergedPineScriptPrompts as pineScriptPrompts,
  promptTags
};

export default {
  strategyPrompts,
  pineScriptPrompts: mergedPineScriptPrompts,
  promptTags
};
