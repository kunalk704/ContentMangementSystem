import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isNotEmpty } from "../utils/validation";
import { useState } from "react";

export default function Signup() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    navigate("/view");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !isNotEmpty(username) ||
      !isNotEmpty(password) ||
      !isNotEmpty(confirmPassword)
    ) {
      setError("Please fill the information");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const result = signUp(username, password);
    if (result.success) {
      navigate("/view");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="panel signup-panel">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="signup-username">Username:</label>
          <input
            id="signup-username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password:</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password:</label>
          <input
            id="signup-confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn">
          Sign Up
        </button>
        <p>
          <Link to="/login">Already have an account? Login</Link>
        </p>
      </form>
    </div>
  );
}
