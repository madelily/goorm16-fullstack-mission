export async function signup({ email, password, name }) {
  const res = await fetch(`/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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
