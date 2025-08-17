import { useState } from "react";
import { Link } from "react-router-dom";

function SideNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`side-nav ${open ? "open" : ""}`}>
        <Link to="/login">
          <button>Logout</button>
        </Link>
      </div>
    </>
  );
}

export default SideNav;
