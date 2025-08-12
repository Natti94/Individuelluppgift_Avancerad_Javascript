// GENERERA CSRF TOKEN

export async function getCsrfToken() {
  const res = await fetch("https://chatify-api.up.railway.app/csrf", {
    method: "PATCH",
    credentials: "include",
  });

  if (res.ok) {
    const data = await res.json();
    console.log("CSRF token fetched successfully", data.csrfToken);
    return data.csrfToken;
  }

  if (!res.ok)
    throw new Error(
      "Security check failed. Please try again or refresh the page."
    );

  const data = await res.json();
  return data.csrfToken;
}

// GET MESSAGES

export async function getMessages() {
  const res = await fetch("https://chatify-api.up.railway.app/chat/messages", {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data.messages;
  }

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      errData.message || "Failed to fetch messages. Please try again."
    );
  }
}

// REGISTRERA ANVÄNDARE MED ATT ANVÄNDA CSRF TOKEN

export async function registerUser(username, password, email, csrfToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, email, csrfToken }),
  });
  if (res.ok) {
    console.log("Registration successful");
  }

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      errData.message ||
        "Registration failed. The username or email may already be in use, or the input is invalid. Please try again."
    );
  }

  return res.json();
}

// LOGGA IN ANVÄNDARE MED CSRF TOKEN OCH JWT-SESSION TOKEN

export async function loginUser(username, password, csrfToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, csrfToken }),
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
