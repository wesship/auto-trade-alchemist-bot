
/**
 * Webhook API Service
 * 
 * This service provides RESTful API endpoints for external systems
 * to integrate with the trading platform via webhooks.
 */

import logger from '@/utils/logger';
import { processTradingViewWebhook, getWebhookSecretToken } from '@/utils/notifications/webhook';
import { handleTradeWebhook } from './webhookService';

// A simulated server-side function to process webhook requests
// In a real application, this would be an Express/Next.js/Fastify API endpoint
export const handleWebhookRequest = async (
  path: string,
  params: Record<string, string>,
  headers: Record<string, string>,
  body: any
): Promise<{
  statusCode: number;
  body: any;
}> => {
  try {
    // Validate request path
    if (path === '/api/webhook') {
      const token = params.token;
      const secretToken = getWebhookSecretToken();

      // Process TradingView webhook format
      if (body && body.symbol && (body.side === 'BUY' || body.side === 'SELL')) {
        // Convert to expected format
        const webhookPayload = {
          source: 'tradingview',
          eventType: 'trade.executed',
          title: `Trade: ${body.side} ${body.symbol}`,
          message: `Signal to ${body.side} ${body.qty || 1} ${body.symbol}`,
          data: {
            symbol: body.symbol,
            side: body.side,
            qty: body.qty || 1,
            strategy: body.strategy
          }
        };

        // Process the webhook
        const result = processTradingViewWebhook(
          webhookPayload,
          token,
          secretToken
        );

        if (result.success) {
          // Execute the trade if validation passed
          const tradeResult = await handleTradeWebhook(
            token,
            {
              modelId: body.strategy || 'webhook-trader',
              symbol: body.symbol,
              action: body.side,
              quantity: body.qty || 1
            }
          );

          return {
            statusCode: 200,
            body: {
              status: 'executed',
              broker_response: tradeResult
            }
          };
        } else {
          return {
            statusCode: 400,
            body: {
              status: 'error',
              message: result.message
            }
          };
        }
      }

      // Handle other webhook formats
      return {
        statusCode: 400,
        body: {
          status: 'error',
          message: 'Unsupported webhook format'
        }
      };
    }

    // Handle unsupported paths
    return {
      statusCode: 404,
      body: {
        status: 'error',
        message: 'Not found'
      }
    };
  } catch (error) {
    logger.error('Error handling webhook request:', error);
    return {
      statusCode: 500,
      body: {
        status: 'error',
        message: 'Internal server error'
      }
    };
  }
};

/**
 * Generate webhook integration documentation
 */
export const getWebhookDocumentation = (): string => {
  const baseUrl = window.location.origin;
  const webhookUrl = `${baseUrl}/api/webhook?token=YOUR_SECRET_TOKEN`;
  const secretToken = getWebhookSecretToken();
  
  return `
# Trading Webhook Integration Guide

## Endpoint
\`\`\`
POST ${webhookUrl}
\`\`\`

## Authentication
Include your secret token as a query parameter:
\`\`\`
?token=${secretToken}
\`\`\`

## Request Format
\`\`\`json
{
  "symbol": "AAPL",
  "side": "BUY",
  "qty": 1,
  "strategy": "ema-crossover"
}
\`\`\`

## Required Fields
- symbol: Stock/crypto symbol (e.g., "AAPL", "BTC/USD")
- side: "BUY" or "SELL"
- qty: Number of shares/contracts/coins to trade

## Optional Fields
- strategy: Name of the strategy generating this signal

## Response Format
\`\`\`json
{
  "status": "executed",
  "broker_response": {
    // Details of the executed trade
  }
}
\`\`\`

## Error Response
\`\`\`json
{
  "status": "error",
  "message": "Error details"
}
\`\`\`
`;
};
