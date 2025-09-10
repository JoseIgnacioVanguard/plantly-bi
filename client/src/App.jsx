import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import InvoicingDetail from "./components/InvoicingDetail";
import DataSourcesManager from "./components/DataSourcesManager";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-sources" element={<DataSourcesManager />} />
            <Route path="/invoice" element={<InvoicingDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
