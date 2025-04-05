
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData, getTradeStrategy } from '@/services/tradingService';
import { formatDate, generateForecastData, getForecastSummary } from '@/components/Forecast/utils/forecastUtils';
import ForecastHeader from '@/components/Forecast/ForecastHeader';
import ForecastChart from '@/components/Forecast/ForecastChart';
import StrategyOptimizer from '@/components/Forecast/StrategyOptimizer';
import RecommendedStrategies from '@/components/Forecast/RecommendedStrategies';

const Forecast = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1w');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [strategyType, setStrategyType] = useState('balanced');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);

  // Query for market data
  const { data: marketData, isLoading: isLoadingMarket } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
  });

  // Get trading strategies
  const { data: tradingStrategies, isLoading: isLoadingStrategies, refetch: refetchStrategies } = useQuery({
    queryKey: ['tradingStrategies', selectedAsset, timeframe, strategyType],
    queryFn: () => getTradeStrategy(selectedAsset, timeframe, strategyType),
  });

  // Generate forecast data when asset or timeframe changes
  useEffect(() => {
    if (marketData) {
      const data = generateForecastData(marketData, selectedAsset, timeframe);
      setForecastData(data);
    }
  }, [selectedAsset, timeframe, marketData]);

  // Update strategies when trading strategies are loaded
  useEffect(() => {
    if (tradingStrategies) {
      setStrategies(tradingStrategies);
    }
  }, [tradingStrategies]);
  
  // Format date for display
  const handleFormatDate = (dateString: string) => {
    return formatDate(dateString, timeframe);
  };

  // Calculate overall forecast direction and confidence
  const summary = getForecastSummary(forecastData);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <ForecastHeader refetchStrategies={refetchStrategies} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ForecastChart 
          forecastData={forecastData}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          summary={summary}
          isLoadingMarket={isLoadingMarket}
          formatDate={handleFormatDate}
        />
        
        <StrategyOptimizer
          confidenceThreshold={confidenceThreshold}
          setConfidenceThreshold={setConfidenceThreshold}
          strategyType={strategyType}
          setStrategyType={setStrategyType}
          refetchStrategies={refetchStrategies}
        />
      </div>
      
      <RecommendedStrategies
        strategies={strategies}
        isLoadingStrategies={isLoadingStrategies}
        refetchStrategies={refetchStrategies}
      />
    </div>
  );
};

export default Forecast;
