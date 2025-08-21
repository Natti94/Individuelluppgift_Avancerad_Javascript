import { useState } from "react";
import { loginUser } from "../../Services"
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // LOGGAR IN ANVÄNDARE MED USERNAME & PASSWORD
  // OMDIRIGERA SEDAN TILL CHAT MED TIMEOUT FÖR ATT VISA SUCCESS
  // ANNARS VISAR DET ERROR
  async function handleLogin(e) {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setSuccess("Login successful, redirecting to chat...");
      setTimeout(() => {
        navigate("/chat");
      }, 2000);
    } catch (err) {
      setError("Login failed. Please check your username and password.", err);
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
