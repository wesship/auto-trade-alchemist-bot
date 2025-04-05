
import { strategyPrompts } from './baseStrategyPrompts';
import { pineScriptPrompts } from './pineScriptPrompts';
import { advancedPineScriptPrompts } from './advancedPineScriptPrompts';

// Merge the advanced prompts into the pineScriptPrompts object
const mergedPineScriptPrompts = {
  ...pineScriptPrompts,
  ...advancedPineScriptPrompts
};

export {
  strategyPrompts,
  mergedPineScriptPrompts as pineScriptPrompts
};

export default {
  strategyPrompts,
  pineScriptPrompts: mergedPineScriptPrompts
};
