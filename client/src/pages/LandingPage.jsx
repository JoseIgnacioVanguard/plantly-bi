import { Link } from "react-router-dom";
import {
  FaDatabase, // Data Sources
  FaUserShield, // RLS
  FaSitemap, // OpenMetadata
  FaProjectDiagram, // Airflow
  FaLightbulb, // Solutions
  FaKey, // RBAC
  FaBookOpen, // Biz Glossary
  FaFolderOpen, // Data Catalogs
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <h1>Welcome to Plantly BI</h1>
        <p>Your platform for data insights and management</p>
      </header>

      {/* Navigation Buttons 1 */}
      <div className="landing-buttons">
        <Link to="/data-sources" className="landing-card">
          <FaDatabase className="card-icon" />
          <h2>Data Sources</h2>
          <p>Manage and connect your data sources</p>
        </Link>

        <Link to="/rlsDM" className="landing-card">
          <FaUserShield className="card-icon" />
          <h2>RLS</h2>
          <p>Role-Level Security for DataMart</p>
        </Link>

        <Link to="/openmetadata" className="landing-card">
          <FaSitemap className="card-icon" />
          <h2>OpenMetadata</h2>
          <p>Open-Source Tool for Data Governance</p>
        </Link>

        <Link to="/airflow" className="landing-card">
          <FaProjectDiagram className="card-icon" />
          <h2>Airflow</h2>
          <p>Open-Source Tool for ETL Orchestration</p>
        </Link>
      </div>

      {/* Navigation Buttons 2 */}
      <div className="landing-buttons">
        <Link to="/solutions" className="landing-card">
          <FaLightbulb className="card-icon" />
          <h2>Solutions Inv.</h2>
          <p>Manage and track your solutions</p>
        </Link>

        <Link to="/rbac" className="landing-card">
          <FaKey className="card-icon" />
          <h2>RBAC</h2>
          <p>Role Based Access Control</p>
        </Link>

        <Link
          to="/biz-glossary"
          className="landing-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaBookOpen className="card-icon" />
          <h2>Biz. Glossary</h2>
          <p>Business terms and definitions</p>
        </Link>

        <Link
          to="/data-catalogs"
          className="landing-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFolderOpen className="card-icon" />
          <h2>Data Catalogs</h2>
          <p>Manage and explore your data assets</p>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
