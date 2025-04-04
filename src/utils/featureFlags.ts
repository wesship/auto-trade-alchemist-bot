
/**
 * Feature Flag System
 * 
 * This utility provides feature flag functionality to gradually
 * roll out new features and quickly disable problematic ones.
 */

// Default feature flags
const DEFAULT_FLAGS: Record<string, boolean> = {
  // Core features - enabled by default
  BASIC_TRADING: true,
  MARKET_DATA: true,
  MODEL_MANAGEMENT: true,
  
  // Enhanced features - can be toggled
  CIRCUIT_BREAKER: true,
  ADVANCED_LOGGING: true,
  MODEL_RETRAINING: false,
  TRADE_NOTIFICATIONS: true,
  PERFORMANCE_ANALYTICS: true,
  
  // Experimental features - disabled by default
  PORTFOLIO_OPTIMIZATION: false,
  SENTIMENT_ANALYSIS: false,
  ALTERNATIVE_DATA: false,
  RISK_ANALYSIS: false
};

// In-memory feature flag state
let featureFlags: Record<string, boolean> = { ...DEFAULT_FLAGS };

// Feature flag change listeners
type FeatureFlagListener = (flag: string, enabled: boolean) => void;
const listeners: FeatureFlagListener[] = [];

/**
 * Initialize feature flags from localStorage
 */
export const initFeatureFlags = (): void => {
  try {
    const storedFlags = localStorage.getItem('featureFlags');
    if (storedFlags) {
      const parsedFlags = JSON.parse(storedFlags);
      featureFlags = { ...DEFAULT_FLAGS, ...parsedFlags };
    }
    console.log('Feature flags initialized:', featureFlags);
  } catch (error) {
    console.error('Failed to initialize feature flags:', error);
    featureFlags = { ...DEFAULT_FLAGS };
  }
};

// Initialize on module load
initFeatureFlags();

/**
 * Save current feature flags to localStorage
 */
const persistFeatureFlags = (): void => {
  try {
    localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
  } catch (error) {
    console.error('Failed to persist feature flags:', error);
  }
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: string): boolean => {
  return !!featureFlags[feature];
};

/**
 * Enable a feature
 */
export const enableFeature = (feature: string): void => {
  const oldValue = featureFlags[feature];
  featureFlags[feature] = true;
  persistFeatureFlags();
  
  if (oldValue !== true) {
    notifyListeners(feature, true);
  }
};

/**
 * Disable a feature
 */
export const disableFeature = (feature: string): void => {
  const oldValue = featureFlags[feature];
  featureFlags[feature] = false;
  persistFeatureFlags();
  
  if (oldValue !== false) {
    notifyListeners(feature, false);
  }
};

/**
 * Toggle a feature's state
 */
export const toggleFeature = (feature: string): boolean => {
  const newValue = !featureFlags[feature];
  featureFlags[feature] = newValue;
  persistFeatureFlags();
  notifyListeners(feature, newValue);
  return newValue;
};

/**
 * Reset all feature flags to defaults
 */
export const resetFeatureFlags = (): void => {
  const oldFlags = { ...featureFlags };
  featureFlags = { ...DEFAULT_FLAGS };
  persistFeatureFlags();
  
  // Notify for all changed flags
  Object.keys(DEFAULT_FLAGS).forEach(flag => {
    if (oldFlags[flag] !== featureFlags[flag]) {
      notifyListeners(flag, featureFlags[flag]);
    }
  });
};

/**
 * Add a listener for feature flag changes
 */
export const addFeatureFlagListener = (listener: FeatureFlagListener): () => void => {
  listeners.push(listener);
  
  // Return a function to remove the listener
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners of a feature flag change
 */
const notifyListeners = (flag: string, enabled: boolean): void => {
  listeners.forEach(listener => {
    try {
      listener(flag, enabled);
    } catch (error) {
      console.error('Error in feature flag listener:', error);
    }
  });
};

/**
 * Get all feature flags
 */
export const getAllFeatureFlags = (): Record<string, boolean> => {
  return { ...featureFlags };
};

/**
 * Set multiple feature flags at once
 */
export const setFeatureFlags = (flags: Record<string, boolean>): void => {
  const oldFlags = { ...featureFlags };
  featureFlags = { ...featureFlags, ...flags };
  persistFeatureFlags();
  
  // Notify for all changed flags
  Object.keys(flags).forEach(flag => {
    if (oldFlags[flag] !== flags[flag]) {
      notifyListeners(flag, flags[flag]);
    }
  });
};

export default {
  isEnabled: isFeatureEnabled,
  enable: enableFeature,
  disable: disableFeature,
  toggle: toggleFeature,
  reset: resetFeatureFlags,
  getAll: getAllFeatureFlags,
  setFlags: setFeatureFlags,
  addListener: addFeatureFlagListener
};
