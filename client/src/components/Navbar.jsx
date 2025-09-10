import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          Plantly BI
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/data-sources" className="nav-link">
            Data Sources
          </Link> 
          <Link to="/invoice" className="nav-link">
            InvoicingDetail
          </Link>
          {/* <handleLogin /> */}
          <button className="login-btn" >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
