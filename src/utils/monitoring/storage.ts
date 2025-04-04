
/**
 * Storage utilities for model monitoring
 */

import { ModelMetric, ModelPerformanceAlert, ModelComparisonData } from './types';
import { METRICS_KEY_PREFIX, ALERTS_KEY, MODEL_COMPARISON_KEY } from './constants';

/**
 * Store metrics in localStorage
 */
export const storeModelMetrics = (modelId: string, metrics: ModelMetric[]): void => {
  try {
    const key = `${METRICS_KEY_PREFIX}${modelId}`;
    localStorage.setItem(key, JSON.stringify(metrics));
  } catch (error) {
    console.error('Failed to store model metrics:', error);
  }
};

/**
 * Retrieve metrics from localStorage
 */
export const getStoredModelMetrics = (modelId: string): ModelMetric[] => {
  try {
    const key = `${METRICS_KEY_PREFIX}${modelId}`;
    const storedMetrics = localStorage.getItem(key);
    return storedMetrics ? JSON.parse(storedMetrics) : [];
  } catch (error) {
    console.error('Failed to retrieve model metrics:', error);
    return [];
  }
};

/**
 * Store performance alerts in localStorage
 */
export const storePerformanceAlerts = (alerts: ModelPerformanceAlert[]): void => {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch (error) {
    console.error('Failed to store performance alerts:', error);
  }
};

/**
 * Retrieve performance alerts from localStorage
 */
export const getStoredPerformanceAlerts = (): ModelPerformanceAlert[] => {
  try {
    const storedAlerts = localStorage.getItem(ALERTS_KEY);
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  } catch (error) {
    console.error('Failed to retrieve performance alerts:', error);
    return [];
  }
};

/**
 * Store model comparison data in localStorage
 */
export const storeModelComparisons = (comparisons: ModelComparisonData[]): void => {
  try {
    localStorage.setItem(MODEL_COMPARISON_KEY, JSON.stringify(comparisons));
  } catch (error) {
    console.error('Failed to store model comparisons:', error);
  }
};

/**
 * Retrieve model comparison data from localStorage
 */
export const getStoredModelComparisons = (): ModelComparisonData[] => {
  try {
    const storedComparisons = localStorage.getItem(MODEL_COMPARISON_KEY);
    return storedComparisons ? JSON.parse(storedComparisons) : [];
  } catch (error) {
    console.error('Failed to retrieve model comparisons:', error);
    return [];
  }
};
