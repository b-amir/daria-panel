class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status?: number;
    code?: string;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message:
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      });
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      message:
        error instanceof Error ? error.message : "Network error occurred",
    });
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET" });
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  return apiRequest<T>(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}
