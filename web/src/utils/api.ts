const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  body?: Record<string, unknown> | FormData;
  method?: HttpMethod;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, method = 'GET', ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...fetchOptions,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  };

  if (body) {
    if (body instanceof FormData) {
      delete config.headers?.['Content-Type'];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default apiRequest;