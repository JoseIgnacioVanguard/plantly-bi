import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";

// required for accessibility
Modal.setAppElement("#root");

const RlsDmManager = () => {
  const [rlsDmPermissions, setRlsDmPermissions] = useState([]);
  const [newRlsDmPermission, setNewRlsDmPermission] = useState({
    id: "",
    sql_user: "",
    table_name: "",
    column_name: "",
    access_value: "",
  });
  const [editingRlsDmPermission, setEditingRlsDmPermission] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ new
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 🔹 modal handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setEditingRlsDmPermission(null);

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
      fetchRlsDmPermissions();
    }
  }, []);

  const token = localStorage.getItem("token");
  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const fetchRlsDmPermissions = async () => {
    try {
      const response = await axios.get("http://10.13.10.12:5001/api/rlsDm");
      setRlsDmPermissions(response.data);
    } catch (error) {
      console.error("Error fetching RLS DM permissions:", error);
      setError("Failed to load RLS DM permissions");
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingRlsDmPermission((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewRlsDmPermission((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://10.13.10.12:5001/api/RlsDm", newRlsDmPermission);
      setNewRlsDmPermission({
        id: "",
        sql_user: "",
        table_name: "",
        column_name: "",
        access_value: "",
      });
      fetchRlsDmPermissions();
      setError("");
      setSuccessMessage("✅ RLS DM Permission created successfully!"); // ✅ success
      closeAddModal();
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide
    } catch (error) {
      console.error("Error creating RLS DM Permission:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create RLS DM Permission";
      setError(errorMessage);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://10.13.10.12:5001/api/RlsDm/${editingRlsDmPermission.id}`,
        editingRlsDmPermission
      );
      closeEditModal();
      fetchRlsDmPermissions();
      setError("");
      setSuccessMessage("✅ RLS DM Permission updated successfully!"); // ✅ success
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide
    } catch (error) {
      console.error("Error updating RLS DM Permission:", error);
      setError("Failed to update RLS DM Permission");
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
        <h2>Current RLS DM Permissions</h2>
        {role === "admin" && (
          <button onClick={openAddModal} className="btn">
            Add New RLS DM Permission
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
                <th>RLS ID</th>
                <th>SQL User</th>
                <th>Table Name</th>
                <th>Column Name</th>
                <th>Access Value</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {rlsDmPermissions.map((rlsDmPermission) => (
                <tr key={rlsDmPermission.id}>
                  <td>{rlsDmPermission.id}</td>
                  <td>{rlsDmPermission.sql_user}</td>
                  <td>{rlsDmPermission.table_name}</td>
                  <td>{rlsDmPermission.column_name}</td>
                  <td>{rlsDmPermission.access_value}</td>
                  <td>
                    <button
                      onClick={() => setEditingRlsDmPermission(rlsDmPermission)}
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
        <h2>Add RLS Permission</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(newRlsDmPermission).map((field) => (
            <div className="form-group" key={field}>
              <input
                type={
                  field.includes("date")
                    ? "date"
                    : field === "id"
                    ? "number"
                    : "text"
                }
                name={field}
                value={newRlsDmPermission[field]}
                onChange={(e) => handleInputChange(e, false)}
                placeholder={field.replace(/_/g, " ")}
                className="form-input"
                required={field !== "access_value"}
              />
            </div>
          ))}
          <button type="submit" className="btn">
            Add RLS Permission
          </button>
        </form>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal
        isOpen={!!editingRlsDmPermission}
        onRequestClose={closeEditModal}
        style={modalStyle}
      >
        <h3>Edit RLS Permission</h3>
        {editingRlsDmPermission && (
          <form onSubmit={handleUpdate}>
            {Object.keys(editingRlsDmPermission).map((field) => (
              <div className="form-group" key={field}>
                <input
                  type={
                    field.includes("date")
                      ? "date"
                      : field === "id"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={editingRlsDmPermission[field]}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder={field.replace(/_/g, " ")}
                  className="form-input"
                  disabled={field === "id"}
                  required={field !== "access_value"}
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

export default RlsDmManager;
