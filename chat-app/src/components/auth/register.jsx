import { useState } from "react";
import { generateCsrf, registerUser } from "../../Services";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // GENERERA EN RANDOM AVATAR
  const [avatar] = useState(() => {
    const randomId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/80?img=${randomId}`;
  });
  const navigate = useNavigate();

  // REGISTRERAR ANVÄNDARE MED USERNAME, PASSWORD, EMAIL, AVATAR & CSRF
  // OMDIRIGERAR SEDAN TILL LOGIN MED TIMEOUT FÖR ATT VISA SUCCESS
  // ANNARS VISAR DET ERROR
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const csrfToken = await generateCsrf();
      await registerUser(username, password, email, avatar, csrfToken);
      setSuccess("Registration successful, redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      setError(
        "Registration failed. The username or email may already be in use, or the input is invalid."
      );
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div style={{ textAlign: "center", margin: "12px 0" }}>
          <img
            src={avatar}
            alt="Avatar preview"
            style={{
              display: "inline-block",
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #eee",
            }}
            onError={(e) => (e.target.src = "https://i.pravatar.cc/80")}
          />
        </div>
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
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
