
import { StrategyPrompt, PromptFilterOptions, PromptCategory, PromptComplexity } from './promptTypes';

/**
 * Filter prompts based on provided options
 */
export const filterPrompts = (prompts: StrategyPrompt[], filterOptions?: PromptFilterOptions): StrategyPrompt[] => {
  if (!filterOptions) return prompts;
  
  return prompts.filter(prompt => {
    // Filter by categories
    if (filterOptions.categories && filterOptions.categories.length > 0) {
      if (!filterOptions.categories.includes(prompt.category)) {
        return false;
      }
    }
    
    // Filter by complexities
    if (filterOptions.complexities && filterOptions.complexities.length > 0) {
      if (!filterOptions.complexities.includes(prompt.complexity)) {
        return false;
      }
    }
    
    // Filter by tags (must have at least one of the specified tags)
    if (filterOptions.tags && filterOptions.tags.length > 0) {
      const hasMatchingTag = filterOptions.tags.some(tag => prompt.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      const matchesName = prompt.name.toLowerCase().includes(query);
      const matchesDescription = prompt.description.toLowerCase().includes(query);
      
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Sorting criteria for prompts
 */
export enum PromptSortCriteria {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  COMPLEXITY_ASC = 'complexity_asc',
  COMPLEXITY_DESC = 'complexity_desc'
}

const complexityValue = (complexity: PromptComplexity): number => {
  switch (complexity) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
    default: return 2;
  }
};

/**
 * Sort prompts based on specified criteria
 */
export const sortPrompts = (prompts: StrategyPrompt[], criteria: PromptSortCriteria = PromptSortCriteria.NEWEST): StrategyPrompt[] => {
  const sortedPrompts = [...prompts];
  
  switch (criteria) {
    case PromptSortCriteria.NAME_ASC:
      return sortedPrompts.sort((a, b) => a.name.localeCompare(b.name));
    case PromptSortCriteria.NAME_DESC:
      return sortedPrompts.sort((a, b) => b.name.localeCompare(a.name));
    case PromptSortCriteria.NEWEST:
      return sortedPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case PromptSortCriteria.OLDEST:
      return sortedPrompts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case PromptSortCriteria.COMPLEXITY_ASC:
      return sortedPrompts.sort((a, b) => complexityValue(a.complexity) - complexityValue(b.complexity));
    case PromptSortCriteria.COMPLEXITY_DESC:
      return sortedPrompts.sort((a, b) => complexityValue(b.complexity) - complexityValue(a.complexity));
    default:
      return sortedPrompts;
  }
};

/**
 * Group prompts by category
 */
export const groupPromptsByCategory = (prompts: StrategyPrompt[]): Record<PromptCategory, StrategyPrompt[]> => {
  const result: Record<PromptCategory, StrategyPrompt[]> = {
    [PromptCategory.TECHNICAL]: [],
    [PromptCategory.FUNDAMENTAL]: [],
    [PromptCategory.SENTIMENT]: [],
    [PromptCategory.HYBRID]: [],
    [PromptCategory.EXPERIMENTAL]: []
  };
  
  prompts.forEach(prompt => {
    if (result[prompt.category]) {
      result[prompt.category].push(prompt);
    }
  });
  
  return result;
};

/**
 * Group prompts by complexity
 */
export const groupPromptsByComplexity = (prompts: StrategyPrompt[]): Record<PromptComplexity, StrategyPrompt[]> => {
  const result: Record<PromptComplexity, StrategyPrompt[]> = {
    'easy': [],
    'medium': [],
    'hard': []
  };
  
  prompts.forEach(prompt => {
    result[prompt.complexity].push(prompt);
  });
  
  return result;
};
