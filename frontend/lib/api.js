const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, options = {}) {
  let response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  // Access token expired
  if (response.status === 401 && options.headers?.Authorization) {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      localStorage.removeItem("access");
      window.location.href = "/login";
      throw new Error("Please login again.");
    }

    let refreshResponse;
    try {
      refreshResponse = await fetch(
        `${API_BASE_URL}/auth/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );
    } catch {
      throw new Error("Unable to refresh your session. Check your connection and try again.");
    }

    const refreshData = await refreshResponse.json().catch(() => null);
    if (!refreshResponse.ok || !refreshData?.access) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    localStorage.setItem("access", refreshData.access);
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${refreshData.access}`,
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.detail ||
      "Something went wrong"
    );
  }

  return data;
}