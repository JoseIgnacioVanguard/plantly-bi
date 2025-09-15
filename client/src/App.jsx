import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DataSourcesManager from "./components/DataSourcesManager";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RlsDmManager from "./components/RlsDmManager";
import LandingPage from "./pages/LandingPage";
import AirflowPage from "./pages/AirflowPage";
import OpenMetadataPage from "./pages/OpenMetadataPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/data-sources" element={<DataSourcesManager />} />
            <Route path="/rlsDm" element={<RlsDmManager />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/airflow" element={<AirflowPage />} />
            <Route path="/openmetadata" element={<OpenMetadataPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
