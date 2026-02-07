const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function login({ email, password }) {
  const form = new URLSearchParams();
  form.set("email", email);
  form.set("password", password);

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("LOGIN_FAILED");
  }

  try {
    const finalUrl = new URL(res.url);
    if (finalUrl.pathname === "/login" && finalUrl.searchParams.has("error")) {
      throw new Error("LOGIN_FAILED");
    }
  } catch {
    // ignore URL parsing issues; keep best-effort behavior
  }

  return true;
}
