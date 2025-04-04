
import logger from '@/utils/logger';
import { withRetry } from './utils';
import modelMonitoring from '@/utils/modelMonitoring';

export interface AIStrategyGenerationResult {
  modelId: string;
  strategyCode: string;
  promptComplexity: 'easy' | 'medium' | 'hard';
  strategyType: string;
  codeQualityScore: number;
  syntaxErrorCount: number;
  adherenceToInstructionsScore: number;
  generationTime: number;
  timestamp: string;
}

/**
 * Available AI models for strategy generation
 */
export const availableAIModels = [
  { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning and instruction following', isAvailable: true },
  { id: 'chatgpt-o1', name: 'ChatGPT-o1', description: 'Versatile performance across complexity levels', isAvailable: true },
  { id: 'claude-3.5', name: 'Claude 3.5', description: 'Good for technical analysis strategies', isAvailable: true },
  { id: 'horizon-ai', name: 'HorizonAI', description: 'Specialized for trading algorithms', isAvailable: true },
  { id: 'gemini-1.5', name: 'Gemini 1.5 Pro', description: 'Experimental model with high variance', isAvailable: false },
  { id: 'grok3', name: 'Grok3 + Think', description: 'Advanced reasoning model with coding focus', isAvailable: true },
];

/**
 * Predefined strategy prompts by complexity
 */
export const strategyPrompts = {
  easy: [
    {
      id: 'easy-gaussian-crossover',
      name: 'Gaussian Channel Crossover',
      description: 'Simple strategy going long when price crosses above upper Gaussian channel',
      prompt: 'Create a Pine Script trading strategy that uses Gaussian Channels. Go long when close price crosses above upper channel. Exit when price crosses below lower channel. Only long trades, no shorts.'
    },
    {
      id: 'easy-stoch-rsi',
      name: 'Stochastic RSI Strategy',
      description: 'Enter long when Stochastic RSI K-line crosses above D-line',
      prompt: 'Create a Pine Script strategy that uses Stochastic RSI. Go long when K line crosses above D line. Exit when K crosses below D. Length=14, smoothK=3, smoothD=3.'
    }
  ],
  medium: [
    {
      id: 'medium-gaussian-stoch-rsi',
      name: 'Gaussian Channel + Stoch RSI',
      description: 'Combined strategy using both Gaussian Channel and Stochastic RSI',
      prompt: 'Create a Pine Script strategy that uses both Gaussian Channels and Stochastic RSI. Go long when price is above the upper Gaussian channel AND Stochastic RSI K-line is greater than 60. Exit when price is below lower channel OR Stochastic RSI K-line is below 40.'
    },
    {
      id: 'medium-triple-ema-cross',
      name: 'Triple EMA Crossover',
      description: 'Strategy using three EMAs of different lengths',
      prompt: 'Create a Pine Script strategy that uses three EMAs (8, 21, 55). Go long when 8 EMA crosses above 21 EMA AND both are above 55 EMA. Exit when 8 EMA crosses below 21 EMA. Use 100% equity, 0.1% commission.'
    }
  ],
  hard: [
    {
      id: 'hard-custom-gaussian',
      name: 'Custom Gaussian Function',
      description: 'Strategy that implements a custom Gaussian-based indicator',
      prompt: 'Create a Pine Script strategy that implements a custom Gaussian-based moving average function. The function should apply Gaussian weights to price data using standard deviation of 3 and a lookback period of 20. Go long when this custom Gaussian MA turns upward (current value > previous value) AND price is above the Gaussian MA. Exit when the Gaussian MA turns downward.'
    },
    {
      id: 'hard-multi-timeframe',
      name: 'Multi-Timeframe Strategy',
      description: 'Strategy analyzing multiple timeframes using Stochastic RSI and volume profile',
      prompt: "Create a Pine Script strategy that uses Stochastic RSI on two timeframes (current and higher) plus volume profile. Go long when Stochastic RSI on both timeframes show K line above D line AND price is near a high volume node from the volume profile. Exit when either timeframe's Stochastic RSI K line crosses below its D line."
    }
  ]
};

/**
 * Mock function to generate a Pine Script trading strategy using a specified AI model
 */
export const generateStrategy = async (
  modelId: string,
  promptId: string
): Promise<AIStrategyGenerationResult> => {
  try {
    logger.info(`Generating strategy with model ${modelId} using prompt ${promptId}`);
    
    // Find the prompt details
    let promptDetails;
    let complexity: 'easy' | 'medium' | 'hard' = 'medium';
    
    for (const [level, prompts] of Object.entries(strategyPrompts)) {
      const prompt = prompts.find(p => p.id === promptId);
      if (prompt) {
        promptDetails = prompt;
        complexity = level as 'easy' | 'medium' | 'hard';
        break;
      }
    }
    
    if (!promptDetails) {
      throw new Error(`Prompt with ID ${promptId} not found`);
    }
    
    // Start timer for performance measurement
    const startTime = Date.now();
    
    // For this simulation, we'll use mock generated strategies and scores
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        // Simulate varying performance between models
        const modelPerformanceFactors = {
          'deepseek-r1': { quality: 0.9, errors: 0.2, adherence: 0.95 },
          'chatgpt-o1': { quality: 0.85, errors: 0.3, adherence: 0.9 },
          'claude-3.5': { quality: 0.8, errors: 0.5, adherence: 0.85 },
          'horizon-ai': { quality: 0.75, errors: 0.6, adherence: 0.8 },
          'gemini-1.5': { quality: 0.6, errors: 1.2, adherence: 0.7 },
          'grok3': { quality: 0.8, errors: 0.4, adherence: 0.85 },
        };
        
        // Adjust scores based on complexity
        const complexityFactor = {
          'easy': 1,
          'medium': 0.85,
          'hard': 0.7
        };
        
        const performanceFactor = modelPerformanceFactors[modelId] || 
          { quality: 0.7, errors: 0.8, adherence: 0.75 };
        
        // Generate mock scores with some randomness
        const randomFactor = () => 0.9 + Math.random() * 0.2;
        
        const baseQualityScore = performanceFactor.quality * complexityFactor[complexity] * 10;
        const codeQualityScore = Math.min(10, Math.max(1, baseQualityScore * randomFactor()));
        
        const baseErrorCount = Math.round(performanceFactor.errors / complexityFactor[complexity]);
        const syntaxErrorCount = Math.max(0, baseErrorCount + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.7 ? 1 : 0));
        
        const baseAdherenceScore = performanceFactor.adherence * complexityFactor[complexity] * 10;
        const adherenceToInstructionsScore = Math.min(10, Math.max(1, baseAdherenceScore * randomFactor()));
        
        // Generate a mock Pine Script strategy (simplified)
        const strategyCode = `// Generated ${promptDetails.name} strategy using ${modelId}
// Complexity: ${complexity}
// ${promptDetails.description}

//@version=5
strategy("${promptDetails.name}", overlay=true, commission_value=0.1, initial_capital=100000, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// Parameters
length = 20
gauss_mult = 2.0
stoch_length = 14
smoothK = 3
smoothD = 3

// Calculate Gaussian Channels
middle = ta.sma(close, length)
stddev = ta.stdev(close, length)
upper = middle + gauss_mult * stddev
lower = middle - gauss_mult * stddev

// Calculate Stochastic RSI
rsi1 = ta.rsi(close, stoch_length)
k = ta.sma(ta.stoch(rsi1, rsi1, rsi1, stoch_length), smoothK)
d = ta.sma(k, smoothD)

// Define strategy conditions
longCondition = ${complexity === 'easy' ? 'close > upper' : 
  complexity === 'medium' ? 'close > upper and k > 60' : 
  'close > upper and k > d and k > 60'}
  
exitLongCondition = ${complexity === 'easy' ? 'close < lower' : 
  complexity === 'medium' ? 'close < lower or k < 40' : 
  'close < lower or k < d or k < 40'}

// Execute strategy
if (longCondition)
    strategy.entry("Long", strategy.long)

if (exitLongCondition)
    strategy.close("Long")

// Plot indicators
plot(upper, "Upper Channel", color=color.rgb(0, 255, 0, 50))
plot(middle, "Middle Channel", color=color.rgb(255, 255, 255, 50))
plot(lower, "Lower Channel", color=color.rgb(255, 0, 0, 50))
${complexity !== 'easy' ? 'plot(k, "K", color=color.blue)\nplot(d, "D", color=color.red)' : ''}`;
        
        // Calculate generation time
        const generationTime = Date.now() - startTime;
        
        const result: AIStrategyGenerationResult = {
          modelId,
          strategyCode,
          promptComplexity: complexity,
          strategyType: promptDetails.name,
          codeQualityScore,
          syntaxErrorCount,
          adherenceToInstructionsScore,
          generationTime,
          timestamp: new Date().toISOString()
        };
        
        // Record the comparison data in model monitoring
        modelMonitoring.recordModelComparison([{
          modelId,
          promptComplexity: complexity,
          strategyType: promptDetails.name,
          codeQualityScore,
          syntaxErrorCount,
          adherenceToInstructionsScore,
          backtestPerformance: {
            sharpeRatio: 1.2 + Math.random() * 0.8,
            maxDrawdown: 5 + Math.random() * 15,
            winRate: 0.4 + Math.random() * 0.3,
            profitFactor: 1.1 + Math.random() * 0.9
          }
        }]);
        
        logger.info(`Generated strategy with model ${modelId}, quality score: ${codeQualityScore.toFixed(2)}`);
        resolve(result);
      }, 1500);
    }));
  } catch (error) {
    logger.error(`Error generating AI trading strategy:`, error);
    throw error;
  }
};

/**
 * Compare strategies from multiple AI models
 */
export const compareAIModels = async (
  promptId: string,
  modelIds: string[] = availableAIModels.filter(m => m.isAvailable).map(m => m.id)
): Promise<AIStrategyGenerationResult[]> => {
  try {
    logger.info(`Comparing ${modelIds.length} AI models for prompt ${promptId}`);
    
    // Generate strategies in parallel
    const results = await Promise.all(
      modelIds.map(modelId => generateStrategy(modelId, promptId))
    );
    
    return results;
  } catch (error) {
    logger.error(`Error comparing AI models:`, error);
    throw error;
  }
};

export default {
  availableAIModels,
  strategyPrompts,
  generateStrategy,
  compareAIModels
};
