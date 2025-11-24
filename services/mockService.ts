
import { MarketData, OHLC, MarketStatus } from '../types';

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', { hour12: false }); // Returns HH:MM:SS
};

export const getCurrentDateTime = () => {
  const now = new Date();
  // Format: YYYY-MM-DD HH:MM:SS
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

// Generate Mock OHLC Data Backwards (to match current price)
export const generateOHLC = (days: number, currentPrice: number): OHLC[] => {
  const data: OHLC[] = [];
  let price = currentPrice;
  const now = new Date();
  
  // Generate backwards from today so the last candle matches current price roughly
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const volatility = price * 0.02; // 2% daily volatility
    
    // We assume 'price' is the CLOSE of day 'i'
    // We generate the OPEN based on a random change from that close
    // This effectively builds the chain backwards
    const changePercent = (Math.random() - 0.5) * 0.02; // +/- 1%
    const open = price / (1 + changePercent);
    
    const high = Math.max(open, price) + Math.random() * volatility * 0.5;
    const low = Math.min(open, price) - Math.random() * volatility * 0.5;

    data.unshift({ // Add to beginning (oldest first)
      time: dateStr,
      open,
      high,
      low,
      close: price,
      volume: Math.floor(Math.random() * 10000000 + 5000000)
    });

    // The Close of the previous day (next iteration) should be roughly the Open of this day
    price = open;
  }
  return data;
};

// Simulate a tick update
export const tickPrice = (asset: MarketData): MarketData => {
  const isClosed = asset.status === 'closed';
  
  if (isClosed) {
    return {
      ...asset,
      lastUpdated: getCurrentTime()
    };
  }

  // Open market logic
  const volatility = 0.0005; // 0.05% change max per tick
  const changeAmount = asset.price * volatility * (Math.random() - 0.5) * 2;
  const newPrice = asset.price + changeAmount;
  
  // Update History (Sparkline - maintain 50 points)
  const newHistory = [...asset.history];
  newHistory.shift(); 
  newHistory.push(newPrice);

  // Update Latest Candle (Live Candle)
  // This ensures the Candle Chart updates in real-time
  const newOHLC = [...asset.ohlc];
  if (newOHLC.length > 0) {
      const lastCandle = { ...newOHLC[newOHLC.length - 1] };
      // Update Close
      lastCandle.close = newPrice;
      // Update High/Low if price breaks bounds
      if (newPrice > lastCandle.high) lastCandle.high = newPrice;
      if (newPrice < lastCandle.low) lastCandle.low = newPrice;
      
      newOHLC[newOHLC.length - 1] = lastCandle;
  }

  // Calculate Change vs Previous Close (Yesterday's close)
  // If we only have 1 candle, use its open.
  const prevClose = newOHLC.length > 1 ? newOHLC[newOHLC.length - 2].close : (newOHLC[0]?.open || asset.price);
  const change = newPrice - prevClose;
  const changePercent = (change / prevClose) * 100;

  return {
    ...asset,
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    direction: change >= 0 ? 'up' : 'down',
    lastUpdated: getCurrentTime(),
    history: newHistory,
    ohlc: newOHLC
  };
};

// Initialize with History and Candlesticks
export const initAssetData = (assets: MarketData[]) => {
  return assets.map(a => {
    // Generate 365 days of OHLC data ending at current price
    const ohlc = generateOHLC(365, a.price);
    
    // Generate 50 points of Intraday History ending at current price
    const history = [];
    let p = a.price;
    for (let i = 0; i < 50; i++) {
        history.unshift(p);
        p = p * (1 + (Math.random() - 0.5) * 0.005);
    }
    
    return {
      ...a,
      ohlc,
      history,
      lastUpdated: getCurrentTime()
    };
  });
};
