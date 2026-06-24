export async function apiFetch(path, options = {}) {
  const base = "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, { ...options, headers });

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    // no json
  }

  if (!res.ok) {
    throw new Error((body && body.message) || `Request failed: ${res.status}`);
  }

  return body;
}
