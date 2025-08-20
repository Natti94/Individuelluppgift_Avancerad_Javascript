import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services";

function SideNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // LOGGAR UT ANVÄNDARE
  // OMDIRIGERA TILL INLOGGNING DIREKT
  // RENSAR ANVÄNDARDATA (csrfToken & jwtToken), SE SERVICES.JS (logoutUser)
  const handleLogout = async () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <div className={`side-nav ${open ? "open" : ""}`}>
        <Link to="/login">
          <button onClick={handleLogout}>Logout</button>
        </Link>
      </div>
    </>
  );
}

export default SideNav;
