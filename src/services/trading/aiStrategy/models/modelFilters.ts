
/**
 * Utilities for filtering and sorting AI models
 */
import { AIModel, ModelFilterOptions, ModelCategory, ModelCapability } from './modelTypes';

/**
 * Filter models based on provided filter options
 */
export const filterModels = (models: AIModel[], filterOptions?: ModelFilterOptions): AIModel[] => {
  if (!filterOptions) return models;
  
  return models.filter(model => {
    // Filter by availability
    if (filterOptions.onlyAvailable && !model.isAvailable) {
      return false;
    }
    
    // Filter by new status
    if (filterOptions.includeNew === false && model.isNew) {
      return false;
    }
    
    // Filter by categories
    if (filterOptions.categories && filterOptions.categories.length > 0) {
      if (!filterOptions.categories.includes(model.category)) {
        return false;
      }
    }
    
    // Filter by capabilities (model must have ALL specified capabilities)
    if (filterOptions.capabilities && filterOptions.capabilities.length > 0) {
      const hasAllCapabilities = filterOptions.capabilities.every(capability => 
        model.capabilities.includes(capability)
      );
      if (!hasAllCapabilities) {
        return false;
      }
    }
    
    // Filter by minimum performance rating
    if (filterOptions.minPerformanceRating !== undefined && 
        (model.performanceRating === undefined || model.performanceRating < filterOptions.minPerformanceRating)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sort models by specified criteria
 */
export enum ModelSortCriteria {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PERFORMANCE_ASC = 'performance_asc',
  PERFORMANCE_DESC = 'performance_desc',
  NEWEST = 'newest',
}

export const sortModels = (models: AIModel[], criteria: ModelSortCriteria = ModelSortCriteria.PERFORMANCE_DESC): AIModel[] => {
  const sortedModels = [...models];
  
  switch (criteria) {
    case ModelSortCriteria.NAME_ASC:
      return sortedModels.sort((a, b) => a.name.localeCompare(b.name));
    case ModelSortCriteria.NAME_DESC:
      return sortedModels.sort((a, b) => b.name.localeCompare(a.name));
    case ModelSortCriteria.PERFORMANCE_ASC:
      return sortedModels.sort((a, b) => (a.performanceRating || 0) - (b.performanceRating || 0));
    case ModelSortCriteria.PERFORMANCE_DESC:
      return sortedModels.sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0));
    case ModelSortCriteria.NEWEST:
      return sortedModels.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    default:
      return sortedModels;
  }
};

/**
 * Get models grouped by category
 */
export const groupModelsByCategory = (models: AIModel[]): Record<ModelCategory, AIModel[]> => {
  const result: Record<ModelCategory, AIModel[]> = {
    [ModelCategory.GENERAL_PURPOSE]: [],
    [ModelCategory.TECHNICAL_ANALYSIS]: [],
    [ModelCategory.FUNDAMENTAL_ANALYSIS]: [],
    [ModelCategory.SENTIMENT_ANALYSIS]: [],
    [ModelCategory.EXPERIMENTAL]: [],
  };
  
  models.forEach(model => {
    if (result[model.category]) {
      result[model.category].push(model);
    }
  });
  
  return result;
};
