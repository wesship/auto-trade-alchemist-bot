
/**
 * Get system status
 */
export const getSystemStatus = async (): Promise<any> => {
  return {
    healthy: true,
    lastCheckTime: new Date().toISOString(),
    services: {
      database: true,
      marketData: true,
      tradingEngine: true,
      authentication: true,
      notification: true
    },
    performance: {
      responseTime: 120 + Math.random() * 50,
      cpuUsage: 0.2 + Math.random() * 0.3,
      memoryUsage: 256 + Math.random() * 128,
      errorRate: 0.01 + Math.random() * 0.03
    }
  };
};
