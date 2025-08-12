import { useState } from "react";
import { loginUser, getCsrfToken } from "../../services";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const csrfToken = await getCsrfToken();
      await loginUser(username, password, csrfToken);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Login successful!</p>}
    </div>
  );
}

export default Login;
