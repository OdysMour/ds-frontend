import { z } from 'zod';

// Rate limit response schema
const rateLimitErrorSchema = z.object({
  error: z.string(),
  retryAfterMs: z.number().optional()
});

type RateLimitError = z.infer<typeof rateLimitErrorSchema>;

class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private capacity: number;
  private refillRate: number;

  constructor(capacity: number, refillRate: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
    this.capacity = capacity;
    this.refillRate = refillRate;
  }

  refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refillAmount = (timePassed / 1000) * this.refillRate;
    const oldTokens = this.tokens;
    
    this.tokens = Math.min(this.capacity, this.tokens + refillAmount);
    this.lastRefill = now;

    console.log('[RateLimiter] Token bucket refilled:', {
      oldTokens: oldTokens.toFixed(2),
      newTokens: this.tokens.toFixed(2),
      refillAmount: refillAmount.toFixed(2),
      timePassed: `${timePassed}ms`
    });
  }

  tryConsume(tokens: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      console.log('[RateLimiter] Tokens consumed:', {
        requested: tokens,
        remaining: this.tokens.toFixed(2)
      });
      return true;
    }
    console.log('[RateLimiter] Token consumption denied:', {
      requested: tokens,
      available: this.tokens.toFixed(2)
    });
    return false;
  }
}

/**
 * Configuration for rate limited fetch
 */
export type RateLimitConfig = {
  requestsPerSecond?: number;
  retryAfter?: number;
  maxRetries?: number;
  fetchFn?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const defaultConfig: Required<Omit<RateLimitConfig, 'fetchFn'>> = {
  requestsPerSecond: 10,
  retryAfter: 1000,
  maxRetries: 3
};

/**
 * Creates a rate-limited fetch function
 */
export function createRateLimitedFetch(config: RateLimitConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const bucket = new TokenBucket(
    finalConfig.requestsPerSecond,
    finalConfig.requestsPerSecond
  );

  // Use provided fetch function or fall back to global fetch
  const fetchImplementation = finalConfig.fetchFn || fetch;

  const rateLimitedFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    let retries = 0;
    const url = input instanceof URL ? input.toString() : input.toString();

    console.log('[RateLimiter] Request initiated:', {
      url,
      method: init?.method || 'GET',
      retryConfig: {
        maxRetries: finalConfig.maxRetries,
        retryAfter: finalConfig.retryAfter
      }
    });

    while (retries <= finalConfig.maxRetries) {
      if (!bucket.tryConsume()) {
        if (retries === finalConfig.maxRetries) {
          console.error('[RateLimiter] Rate limit exceeded and max retries reached:', {
            url,
            retries
          });
          throw new Error('Rate limit exceeded and max retries reached');
        }
        console.log('[RateLimiter] Waiting for token bucket refill:', {
          retryNumber: retries + 1,
          waitTime: finalConfig.retryAfter
        });
        await new Promise(resolve => setTimeout(resolve, finalConfig.retryAfter));
        retries++;
        continue;
      }

      console.log('[RateLimiter] Executing request:', {
        url,
        retryNumber: retries
      });
      
      const response = await fetchImplementation(input, init);
      
      console.log('[RateLimiter] Response received:', {
        url,
        status: response.status,
        retryNumber: retries
      });
      
      if (response.status === 429) {
        if (retries === finalConfig.maxRetries) {
          console.error('[RateLimiter] Max retries reached for rate limited request:', {
            url,
            retries
          });
          throw new Error('Max retries reached for rate limited request');
        }

        try {
          const data = rateLimitErrorSchema.parse(await response.json());
          // Use server-provided retry time or fall back to configured value
          const retryTime = data.retryAfterMs ?? finalConfig.retryAfter;
          console.log('[RateLimiter] Rate limit hit, waiting to retry:', {
            url,
            retryNumber: retries + 1,
            retryAfter: retryTime,
            serverProvided: !!data.retryAfterMs
          });
          await new Promise(resolve => setTimeout(resolve, retryTime));
          retries++;
          continue;
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.warn('[RateLimiter] Invalid rate limit response format:', {
              url,
              error: error.errors
            });
          }
          // Fallback to default retry behavior
          console.log('[RateLimiter] Using fallback retry behavior:', {
            url,
            retryNumber: retries + 1,
            retryAfter: finalConfig.retryAfter
          });
          await new Promise(resolve => setTimeout(resolve, finalConfig.retryAfter));
          retries++;
          continue;
        }
      }

      return response;
    }

    console.error('[RateLimiter] Request failed after maximum retries:', {
      url,
      maxRetries: finalConfig.maxRetries
    });
    throw new Error('Request failed after maximum retries');
  };

  return rateLimitedFetch;
}