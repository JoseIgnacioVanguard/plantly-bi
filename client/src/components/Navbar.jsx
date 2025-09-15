// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signIn"); // redirect after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          Plantly BI
        </Link>
        <div className="nav-links">
          {!token ? (
            <>
              <Link to="/signIn" className="nav-link">
                Sign In
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="login-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
