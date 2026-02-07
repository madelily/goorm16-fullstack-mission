export async function login({ email, password }) {
  const form = new URLSearchParams();
  form.set("email", email);
  form.set("password", password);

  const res = await fetch(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: form,
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("LOGIN_FAILED");
  }

  if (!res.ok) throw new Error("LOGIN_FAILED");

  return true;
}

export async function logout() {
  const res = await fetch(`/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error("LOGOUT_FAILED");
  return true;
}
