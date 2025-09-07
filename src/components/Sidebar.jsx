import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>CMS Portal </h2>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <NavLink to="/view">View Content</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
            </>
          )}
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
