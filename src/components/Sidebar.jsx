import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const navItems = user
    ? [
        { path: "/add", label: "Add Content" },
        { path: "/view", label: "View Content" },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/signup", label: "Sign Up" },
      ];

  return (
    <aside className="sidebar">
      <h2>CMS Portal</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
