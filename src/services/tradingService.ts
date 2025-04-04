
// This file now simply re-exports everything from the trading folder
// to maintain backward compatibility
export * from './trading';

// Initialize feature flags
import featureFlags from '@/utils/featureFlags';

// Initialize feature flags on module load
featureFlags.enable('CIRCUIT_BREAKER');
featureFlags.enable('ADVANCED_LOGGING');
featureFlags.enable('TRADE_NOTIFICATIONS');
