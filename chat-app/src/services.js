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

export async function generateCsrf() {
  const res = await fetch("https://chatify-api.up.railway.app/csrf", {
    method: "PATCH",
    credentials: "include",
  });
  if (res.ok) {
    const data = await handleSuccess(res, "CSRF token fetched successfully");
    if (data.csrfToken) {
      localStorage.setItem("CSRFtoken", data.csrfToken);
      return data.csrfToken;
    } else {
      console.log("No CSRF token received in response.");
    }
    return data.csrfToken;
  }

  await handleError(
    res,
    "Security check failed. Please try again or refresh the page."
  );
}

export async function registerUser(username, password, email) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
      email,
      csrfToken: localStorage.getItem("CSRFtoken"),
    }),
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

export async function loginUser(username, password) {
  const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
      csrfToken: localStorage.getItem("CSRFtoken"),
    }),
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

export function logoutUser() {
  try {
    sessionStorage.removeItem("token");
    console.log("Logout successful. Token removed from sessionStorage.");
    return { success: true, message: "Logout successful", code: 0 };
  } catch (err) {
    console.log("Logout failed. Could not remove token from session storage.");
    return {
      success: false,
      message: "Logout failed. Please try again.",
      code: err?.code || 1,
    };
  }
}

export async function postMessages(
  text,
  conversationId = "314216cb-9ed3-4a57-93a1-e4b8b684ff15"
) {
  const res = await fetch("https://chatify-api.up.railway.app/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      text,
      conversationId,
    }),
  });

  if (res.ok) {
    const data = await handleSuccess(res, "Messages sent successfully");
    return data.postMessages;
  }

  await handleError(res, "Failed to send messages. Please try again.");
}

export async function getUserMessages(
  conversationId = "314216cb-9ed3-4a57-93a1-e4b8b684ff15"
) {
  const res = await fetch(
    `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (res.ok) {
    const data = await handleSuccess(res, "Messages fetched successfully");

    return data.messages || data || [];
  }

  await handleError(res, "Failed to fetch messages. Please try again.");
}

export async function getAllMessages() {
  const res = await fetch(
    `https://chatify-api.up.railway.app/messages
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (res.ok) {
    const data = await handleSuccess(res, "Messages fetched successfully");
    return data.messages;
  }

  await handleError(res, "Failed to fetch message. Please try again.");
}

export async function getAllConversations() {
  const res = await fetch("https://chatify-api.up.railway.app/messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (res.ok) {
    const data = await handleSuccess(res, "Conversations fetched successfully");
    return data.conversations;
  } else {
    console.warn("No conversations received in response.");
  }

  await handleError(res, "Failed to fetch conversations. Please try again.");
}
