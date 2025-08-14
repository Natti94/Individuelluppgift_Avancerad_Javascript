// HJÄLPS-KOD
async function handleError(res, defaultMessage) {
  let errMessage = `${defaultMessage} (Status ${res.status})`;
  try {
    const errData = await res.json();
    if (errData?.message) {
      errMessage += ` Server says: ${errData.message}`;
    }
  } catch {
    errMessage = defaultMessage;
  }
  console.error(`${errMessage}`, res.statusText);
  throw new Error(errMessage);
}
async function handleSuccess(res, successMessage) {
  console.log(`${successMessage} (Status ${res.status} ${res.statusText})`);
  return await res.json();
}
// -----------------------------------------------------------------------

// GENERERA CSRF TOKEN, REGISTERING OCH INLOGGNING
// GENERERA CSRF TOKEN - PATCH
export async function generateCsrf() {
  const res = await fetch("https://chatify-api.up.railway.app/csrf", {
    method: "PATCH",
    credentials: "include",
  });
  if (res.ok) {
    const data = await handleSuccess(res, "CSRF token fetched successfully");
    return data.csrfToken;
  }
  await handleError(
    res,
    "Security check failed. Please try again or refresh the page."
  );
}

// REGISTRERA ANVÄNDARE - POST
export async function registerUser(username, password, email, csrfToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, email, csrfToken }),
  });
  if (res.ok) {
    const data = await handleSuccess(
      res,
      "Registration successful, redirecting to login..."
    );
    return data.registerUser;
  }
  await handleError(
    res,
    "Registration failed. The username or email may already be in use, or the input is invalid."
  );
}

// LOGGA IN ANVÄNDARE - POST
export async function loginUser(username, password, csrfToken) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, csrfToken }),
  });

  if (res.ok) {
    const data = await handleSuccess(
      res,
      "Login successful, redirecting to chat..."
    );
    if (data.token) {
      sessionStorage.setItem("token", data.token);
    } else {
      console.warn("No token received in login response.");
    }
    return data.loginUser;
  }

  await handleError(
    res,
    "Login failed. Please check your username and password."
  );
}

// -----------------------------------------------------------------------

// MEDDELANDEN
// POSTA MEDDALNDEN SOM INLOGGAD ANVÄNDARE - POST

export async function postMessages(text, conversationId) {
  const res = await fetch("https://chatify-api.up.railway.app/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  });

  if (res.ok) {
    const data = await handleSuccess(res, "Messages sent successfully");

    if (data.conversationId) {
      localStorage.setItem("conversationId", data.conversationId);
    } else {
      console.warn("No conversationId received in message response.");
    }
    return data.messages;
  }

  await handleError(res, "Failed to send messages. Please try again.");
}

// HÄMTA INLOGGAD ANVÄNDARES MEDDELANDEN - GET

export async function getMessages() {
  const res = await fetch("https://chatify-api.up.railway.app/messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (res.ok) {
    const data = await handleSuccess(res, "Messages fetched successfully");
    return data.messages;
  }

  await handleError(res, "Failed to fetch messages. Please try again.");
}

export async function getConversations() {
  const res = await fetch("https://chatify-api.up.railway.app/conversations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (res.ok) {
    const data = await handleSuccess(res, "Conversations fetched successfully");
    return data.conversations;
  }

  await handleError(res, "Failed to fetch conversations. Please try again.");
}
//----------------------------------------------------------------------
