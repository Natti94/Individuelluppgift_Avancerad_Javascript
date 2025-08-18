import { useState } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../Services";

function SideNav() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
    }
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
