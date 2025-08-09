export async function getCsrfToken() {
  const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
    method: "PATCH",
    credentials: "include",
  });

  if (!csrfRes.ok)
    throw new Error(
      "Security check failed. Please try again or refresh the page."
    );

  const data = await csrfRes.json();
  return data.csrfToken;
}

export async function registerUser(username, password, email, csrfToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, email, csrfToken }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      errData.message ||
        "Registration failed. The username or email may already be in use, or the input is invalid. Please try again."
    );
  }

  return res.json();
}

export async function loginUser(username, password, jsonwebToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, js }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      errData.message ||
        "Login failed. Please check your username and password."
    );
  }

  return res.json();
}
