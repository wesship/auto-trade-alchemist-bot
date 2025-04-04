
import { useEffect, useState } from 'react';
import { Asset } from '../../types/trading';
import { fetchMarketData } from '../../services/tradingService';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const MarketTicker = () => {
  const [marketData, setMarketData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const data = await fetchMarketData();
        setMarketData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading market data:', error);
        setLoading(false);
      }
    };

    loadMarketData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(asset => ({
          ...asset,
          price: asset.price + (Math.random() * 2 - 1) * (asset.price * 0.002),
          change: asset.change + (Math.random() * 2 - 1) * 0.5,
          changePercent: asset.changePercent + (Math.random() * 2 - 1) * 0.2
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-card p-2 rounded-md border border-border flex overflow-hidden">
        <div className="flex items-center space-x-8 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-5 w-16 bg-muted rounded"></div>
              <div className="h-5 w-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card p-2 rounded-md border border-border">
      <div className="flex overflow-x-auto hide-scrollbar">
        <div className="flex animate-marquee whitespace-nowrap">
          {marketData.concat(marketData).map((asset, index) => (
            <div key={`${asset.symbol}-${index}`} className="flex items-center mx-4">
              <span className="font-semibold terminal-text mr-2">{asset.symbol}</span>
              <span className="terminal-value mr-2">
                {asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              <span className={`flex items-center ${asset.changePercent >= 0 ? 'market-up' : 'market-down'}`}>
                {asset.changePercent >= 0 ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />}
                {asset.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
