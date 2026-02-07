/**
 * Fetch utilities with timeout and retry logic
 * Prevents deployment issues on Vercel and other serverless platforms
 */

/**
 * Fetch with timeout
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (default: 8000ms - under Vercel's 10s limit)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 8000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Fetch with retry logic
 * @param url - Request URL
 * @param options - Fetch options
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @param timeout - Timeout per attempt in milliseconds (default: 8000ms)
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  timeout: number = 8000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}: Fetching ${url}`);
      const response = await fetchWithTimeout(url, options, timeout);
      
      console.log(`📡 Response status: ${response.status}`);
      
      // Retry on 5xx server errors (but not on 4xx client errors)
      if (response.status >= 500 && response.status < 600 && attempt < maxRetries) {
        const delay = 1000 * attempt; // Exponential backoff: 1s, 2s, 3s
        console.warn(`⏱️  Server error ${response.status} (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      return response;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Fetch error (attempt ${attempt}/${maxRetries}):`, error.message);
      
      // Retry on network errors or timeouts
      if (attempt < maxRetries) {
        const delay = 1000 * attempt; // Exponential backoff: 1s, 2s, 3s
        const errorType = error.message?.includes('timeout') ? 'timeout' : 'network';
        console.warn(`⏱️  ${errorType} error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  console.error('❌ All retries failed. Last error:', lastError);
  throw lastError || new Error('Request failed after all retries');
}

/**
 * Fetch backend API with automatic retry and timeout
 * Use this for all backend API calls from Next.js API routes
 */
export async function fetchBackendAPI(
  endpoint: string,
  options: RequestInit = {},
  backendUrl?: string
): Promise<Response> {
  const baseUrl = backendUrl || process.env.BACKEND_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Merge headers properly
  const headers: Record<string, string> = {};
  
  // Convert existing headers to a plain object if needed
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  // Only set Content-Type if not already set and if there's a body
  if (!headers['Content-Type'] && !headers['content-type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetchWithRetry(url, {
    ...options,
    headers,
    credentials: options.credentials || 'include', // Include cookies by default
  }, 3, 8000); // 3 retries, 8s timeout
}
