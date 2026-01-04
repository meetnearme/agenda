import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function: Newsletter Subscription
 *
 * Handles newsletter signups via Beehiiv API.
 * Supports both CMS-stored credentials and environment variables.
 *
 * Environment variables (optional, more secure):
 * - BEEHIIV_API_KEY: API key from Beehiiv settings
 * - BEEHIIV_PUBLICATION_ID: Publication ID from Beehiiv settings
 */

interface SubscribeRequest {
  email: string;
  publicationId?: string;
  apiKey?: string;
}

interface BeehiivSubscriptionResponse {
  data?: {
    id: string;
    email: string;
    status: string;
  };
}

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body: SubscribeRequest = JSON.parse(event.body || '{}');
    const { email } = body;

    // Use environment variables if available, otherwise use request body
    const apiKey = process.env.BEEHIIV_API_KEY || body.apiKey;
    const publicationId =
      process.env.BEEHIIV_PUBLICATION_ID || body.publicationId;

    // Validate required fields
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    if (!apiKey || !publicationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            'Beehiiv credentials not configured. Set up API key and Publication ID in CMS settings or environment variables.',
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Call Beehiiv API to create subscription
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    );

    if (!beehiivResponse.ok) {
      const errorText = await beehiivResponse.text();
      console.error('Beehiiv API error:', errorText);

      // Handle specific error cases
      if (beehiivResponse.status === 401) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid API credentials' }),
        };
      }

      if (beehiivResponse.status === 422) {
        return {
          statusCode: 422,
          headers,
          body: JSON.stringify({
            error: 'Invalid subscription data',
            details: errorText,
          }),
        };
      }

      return {
        statusCode: beehiivResponse.status,
        headers,
        body: JSON.stringify({ error: 'Failed to create subscription' }),
      };
    }

    const result: BeehiivSubscriptionResponse = await beehiivResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed!',
        data: result.data,
      }),
    };
  } catch (error) {
    console.error('Subscription error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
      }),
    };
  }
};

