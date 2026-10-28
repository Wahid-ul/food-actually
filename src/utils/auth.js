// ── JWT Auth Utilities ────────────────────────────────────────────────────────
// All auth now goes through the FastAPI backend. No Firebase dependency.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Token storage ─────────────────────────────────────────────────────────────

export const saveSession = (token, user) => {
  localStorage.setItem("access_token", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("userName", user.name);
  localStorage.setItem("points", String(user.points ?? 0));
  localStorage.setItem("saladsPurchased", String(user.salads_purchased ?? 0));
};

export const clearSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userName");
};

export const getToken = () => localStorage.getItem("access_token");

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── API helpers ───────────────────────────────────────────────────────────────

const post = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong.");
  }

  return data;
};

// ── Auth actions ──────────────────────────────────────────────────────────────

export const loginWithEmail = async (email, password) => {
  const data = await post("/auth/login", { email, password });
  saveSession(data.access_token, data.user);
  return data.user;
};

export const registerWithEmail = async ({ name, email, password }) => {
  if (!name?.trim()) throw new Error("Please enter your name.");
  if (!email) throw new Error("Please enter your email.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const data = await post("/auth/register", { name: name.trim(), email, password });
  saveSession(data.access_token, data.user);
  return data.user;
};

export const logout = () => {
  clearSession();
};

// ── Authenticated fetch ───────────────────────────────────────────────────────
// Use this for any protected API calls from components.

export const authFetch = async (path, options = {}) => {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Request failed.");
  }

  return data;
};
