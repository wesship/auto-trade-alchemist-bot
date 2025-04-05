
// Generate mock price data
export const generatePriceData = (symbol: string, days: number) => {
  const data = [];
  const today = new Date();
  let basePrice;
  
  // Set realistic base prices for different assets
  switch(symbol) {
    case 'BTC': basePrice = 63000; break;
    case 'ETH': basePrice = 3400; break;
    case 'AAPL': basePrice = 180; break;
    case 'NVDA': basePrice = 900; break;
    default: basePrice = 100;
  }
  
  let price = basePrice;
  let volume = 0;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some trends and patterns in the data
    const trendFactor = Math.sin(i / (days / 6)) * 0.03; // Cyclical trend
    const randomFactor = (Math.random() - 0.5) * 0.04; // Random noise
    
    // Combine trend and random factors
    const changeFactor = trendFactor + randomFactor;
    
    // Calculate new price with change
    price = price * (1 + changeFactor);
    volume = Math.round(50000 + Math.random() * 150000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume
    });
  }
  
  return data;
};

export const formatYAxis = (value: number, symbol: string) => {
  if (symbol === 'BTC' && value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
};
