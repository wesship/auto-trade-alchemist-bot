
export const formatDate = (dateString: string, timeframe: string) => {
  const date = new Date(dateString);
  if (timeframe === '1d') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const generateForecastData = (marketData: any[], selectedAsset: string, timeframe: string) => {
  const asset = marketData?.find(a => a.symbol === selectedAsset);
  if (!asset) return [];

  const currentPrice = asset.price;
  const volatility = asset.symbol.includes('BTC') ? 0.04 : asset.symbol.includes('ETH') ? 0.035 : 0.02;
  
  // Generate forecast points
  const days = timeframe === '1d' ? 24 : timeframe === '1w' ? 7 : 30;
  const points = timeframe === '1d' ? 24 : timeframe === '1w' ? 7 : 30;
  const interval = days / points;
  
  const trendBias = Math.random() > 0.5 ? 1 : -1;
  const forecastPoints = Array.from({ length: points + 1 }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() + (i * interval * 24));
    
    // Calculate price with random walk + trend
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    const trendFactor = (i / points) * trendBias * volatility * 2;
    const priceFactor = 1 + randomFactor + trendFactor;
    const forecastPrice = currentPrice * priceFactor;
    
    // Calculate confidence based on time distance
    const confidence = Math.max(30, Math.round(95 - (i / points) * 65));
    
    return {
      time: time.toISOString(),
      price: parseFloat(forecastPrice.toFixed(2)),
      confidence,
      lower: parseFloat((forecastPrice * (1 - (1 - confidence/100) * 0.5)).toFixed(2)),
      upper: parseFloat((forecastPrice * (1 + (1 - confidence/100) * 0.5)).toFixed(2)),
    };
  });
  
  return forecastPoints;
};

export const getForecastSummary = (forecastData: any[]) => {
  if (forecastData.length < 2) return { direction: 'neutral', confidence: 0, change: 0 };
  
  const startPrice = forecastData[0].price;
  const endPrice = forecastData[forecastData.length - 1].price;
  const change = ((endPrice - startPrice) / startPrice) * 100;
  const direction = change > 1 ? 'bullish' : change < -1 ? 'bearish' : 'neutral';
  
  // Average confidence weighted by time (more recent predictions have higher weight)
  const weightedConfidence = forecastData.reduce((acc, point, index) => {
    const weight = 1 + index / forecastData.length;
    return acc + (point.confidence * weight);
  }, 0);
  
  const totalWeight = forecastData.reduce((acc, _, index) => {
    return acc + (1 + index / forecastData.length);
  }, 0);
  
  return { 
    direction, 
    confidence: Math.round(weightedConfidence / totalWeight), 
    change: parseFloat(change.toFixed(2))
  };
};
