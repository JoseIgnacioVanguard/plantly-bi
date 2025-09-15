import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";

// required for accessibility
Modal.setAppElement("#root");

const DataSourcesManager = () => {
  const [dataSources, setDataSources] = useState([]);
  const [newDataSource, setNewDataSource] = useState({
    source_system: "",
    source_location: "",
    host_api_url: "",
    source_type: "",
    system_type: "",
    source_name: "",
    source_status: "",
    valid_from: "",
    valid_to: "",
    source_description: "",
  });
  const [editingDataSource, setEditingDataSource] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ new
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 🔹 modal handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setEditingDataSource(null);

  // 🔹 Axios interceptor to add token to headers
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin"; // redirect if not signed in
    } else {
      fetchDataSources();
    }
  }, []);

  const token = localStorage.getItem("token");
  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const fetchDataSources = async () => {
    try {
      const response = await axios.get(
        "http://10.13.10.12:5001/api/dataSources"
      );
      setDataSources(response.data);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      setError("Failed to load data sources");
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingDataSource((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewDataSource((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://10.13.10.12:5001/api/dataSources",
        newDataSource
      );
      setNewDataSource({
        source_system: "",
        source_location: "",
        host_api_url: "",
        source_type: "",
        system_type: "",
        source_name: "",
        source_status: "",
        valid_from: "",
        valid_to: "",
        source_description: "",
      });
      fetchDataSources();
      setError("");
      setSuccessMessage("✅ Data Source created successfully!"); // ✅ success
      closeAddModal();
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide
    } catch (error) {
      console.error("Error creating data source:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create data source";
      setError(errorMessage);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://10.13.10.12:5001/api/dataSources/${editingDataSource.source_id}`,
        editingDataSource
      );
      closeEditModal();
      fetchDataSources();
      setError("");
      setSuccessMessage("✅ Data Source updated successfully!"); // ✅ success
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide
    } catch (error) {
      console.error("Error updating data source:", error);
      setError("Failed to update data source");
    }
  };

  // 🔹 Reusable modal style
  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
    },
    content: {
      width: "400px",
      height: "500px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 1001,
    },
  };

  return (
    <div className="data-source-manager">
      <div className="list-header">
        <h2>Current Data Sources</h2>
        {role === "admin" && (
          <button onClick={openAddModal} className="btn">
            Add New Data Source
          </button>
        )}
      </div>
      {/* ✅ Success message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* ❌ Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Data Source List */}
      <div className="data-source-list">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Source ID</th>
                <th>Source System</th>
                <th>Source Location</th>
                <th>Host/API URL</th>
                <th>Source Type</th>
                <th>System Type</th>
                <th>Source Name</th>
                <th>Source Status</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {dataSources.map((dataSource) => (
                <tr key={dataSource.source_id}>
                  <td>{dataSource.source_id}</td>
                  <td>{dataSource.source_system}</td>
                  <td>{dataSource.source_location}</td>
                  <td>{dataSource.host_api_url}</td>
                  <td>{dataSource.source_type}</td>
                  <td>{dataSource.system_type}</td>
                  <td>{dataSource.source_name}</td>
                  <td>{dataSource.source_status}</td>
                  <td>{dataSource.valid_from}</td>
                  <td>{dataSource.valid_to}</td>
                  <td>
                    <button
                      onClick={() => setEditingDataSource(dataSource)}
                      className="btn btn-small btn-edit"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        style={modalStyle}
      >
        <h2>Add New Data Source</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(newDataSource).map((field) => (
            <div className="form-group" key={field}>
              <input
                type={
                  field.includes("date")
                    ? "date"
                    : field === "source_id"
                    ? "number"
                    : "text"
                }
                name={field}
                value={newDataSource[field]}
                onChange={(e) => handleInputChange(e, false)}
                placeholder={field.replace(/_/g, " ")}
                className="form-input"
                required={field !== "valid_from" && field !== "valid_to"}
              />
            </div>
          ))}
          <button type="submit" className="btn">
            Add Data Source
          </button>
        </form>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal
        isOpen={!!editingDataSource}
        onRequestClose={closeEditModal}
        style={modalStyle}
      >
        <h3>Edit Data Source</h3>
        {editingDataSource && (
          <form onSubmit={handleUpdate}>
            {Object.keys(editingDataSource).map((field) => (
              <div className="form-group" key={field}>
                <input
                  type={
                    field.includes("date")
                      ? "date"
                      : field === "source_id"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={editingDataSource[field]}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder={field.replace(/_/g, " ")}
                  className="form-input"
                  disabled={field === "source_id"}
                  required={
                    field !== "valid_from" &&
                    field !== "valid_to" &&
                    field !== "source_description"
                  }
                />
              </div>
            ))}
            <div className="modal-actions">
              <button type="submit" className="btn">
                Save Changes
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      <br />
    </div>
  );
};

export default DataSourcesManager;
