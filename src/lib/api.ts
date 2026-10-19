/**
 * Helper to make API requests with automatic Authorization Bearer token from localStorage
 * as well as credentials (cookies).
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("applybloom_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}
