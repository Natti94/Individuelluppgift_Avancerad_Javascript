import Logout from "../Auth/Logout";

function SideNav() {
  return (
    <nav className="side-nav">
      <ul>
        <li>
          <a href="/logout">
            <Logout />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
