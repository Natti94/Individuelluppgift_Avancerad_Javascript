import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/register");
    });
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
