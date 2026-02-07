const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function signup({ email, password, name }) {
  const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = payload?.message || "회원가입에 실패했습니다.";
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

