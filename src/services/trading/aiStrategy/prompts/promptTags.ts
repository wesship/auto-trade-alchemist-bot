import { PromptTag } from './promptTypes';

/**
 * Available tags for strategy prompts
 */
export const promptTags: Record<string, PromptTag> = {
  // Technical Analysis Tags
  'trend-following': {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Strategies that follow market trends',
    color: '#4CAF50'
  },
  'mean-reversion': {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Strategies that capitalize on price returning to mean',
    color: '#2196F3'
  },
  'breakout': {
    id: 'breakout',
    name: 'Breakout',
    description: 'Strategies that trigger on price pattern breakouts',
    color: '#FF9800'
  },
  'momentum': {
    id: 'momentum',
    name: 'Momentum',
    description: 'Strategies based on price momentum indicators',
    color: '#F44336'
  },
  'volatility': {
    id: 'volatility',
    name: 'Volatility',
    description: 'Strategies that use volatility indicators',
    color: '#9C27B0'
  },
  'oscillator': {
    id: 'oscillator',
    name: 'Oscillator',
    description: 'Uses oscillating indicators like RSI, MACD',
    color: '#00BCD4'
  },
  
  // Fundamental Tags
  'earnings': {
    id: 'earnings',
    name: 'Earnings',
    description: 'Based on company earnings reports',
    color: '#607D8B'
  },
  'value': {
    id: 'value',
    name: 'Value',
    description: 'Focuses on undervalued assets',
    color: '#795548'
  },
  
  // Sentiment Tags
  'news': {
    id: 'news',
    name: 'News',
    description: 'Incorporates news sentiment',
    color: '#FFEB3B'
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media',
    description: 'Uses social media sentiment analysis',
    color: '#03A9F4'
  },
  
  // Other Tags
  'advanced': {
    id: 'advanced',
    name: 'Advanced',
    description: 'Complex strategies for experienced traders',
    color: '#E91E63'
  },
  'beginner': {
    id: 'beginner',
    name: 'Beginner',
    description: 'Simple strategies for beginners',
    color: '#8BC34A'
  },
  'backtested': {
    id: 'backtested',
    name: 'Backtested',
    description: 'Strategy has been backtested',
    color: '#673AB7'
  },
  'multi-timeframe': {
    id: 'multi-timeframe',
    name: 'Multi-Timeframe',
    description: 'Uses multiple timeframes',
    color: '#FF5722'
  },
  'multi-asset': {
    id: 'multi-asset',
    name: 'Multi-Asset',
    description: 'Works across multiple asset classes',
    color: '#3F51B5'
  }
};
