import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const KpiManager = () => {
  const [kpis, setKpis] = useState([]);
  const [newKpi, setNewKpi] = useState({
    kpi_id: "",
    name: "",
    description: "",
    category: "",
    target_value: "",
    actual_value: "",
    unit: "",
    frequency: "",
    status: "",
    department_id: "",
    project_id: "",
    active: true,
  });
  const [editingKpi, setEditingKpi] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/kpis");
      setKpis(response.data);
    } catch (error) {
      console.error("Error fetching kpis:", error);
      setError("Failed to load kpis");
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingKpi((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewKpi((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/kpis", newKpi);
      setNewKpi({
        name: "",
        description: "",
        category: "",
        target_value: "",
        actual_value: "",
        unit: "",
        frequency: "",
        status: "",
        department_id: "",
        project_id: "",
      });
      fetchKpis();
      setError("");
      closeModal();
    } catch (error) {
      console.error("Error creating kpi:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create kpi";
      setError(errorMessage);
    }
  };

  const handleEdit = (kpi) => {
    setEditingKpi(kpi);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:5001/api/kpis/${editingKpi._id}`,
        editingKpi
      );
      setEditingKpi(null);
      fetchKpis();
      setError("");
    } catch (error) {
      console.error("Error updating kpi:", error);
      setError("Failed to update kpi");
    }
  };

  const handleToggleActive = async (kpi) => {
    try {
      await axios.patch(`http://localhost:5001/api/kpis/${kpi._id}`, {
        active: !kpi.active,
      });
      fetchKpis();
      setError("");
    } catch (error) {
      console.error("Error toggling kpi status:", error);
      setError("Failed to update kpi status");
    }
  };

  const AddKpiModal = () => (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "400px",
          height: "500px",
          margin: "auto",
          padding: "20px",
        },
      }}
    >
      <h2>Add New KPI</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={newKpi.name}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="KPI Name"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="description"
            value={newKpi.description}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Description"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="category"
            value={newKpi.category}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Category"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="target_value"
            value={newKpi.target_value}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Target Value"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="actual_value"
            value={newKpi.actual_value}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Actual Value"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="unit"
            value={newKpi.unit}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Unit of Measure"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="frequency"
            value={newKpi.frequency}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Frequency"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="status"
            value={newKpi.status}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Status"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="department_id"
            value={newKpi.department_id}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Department ID"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="project_id"
            value={newKpi.project_id}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Project ID"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="active"
            checked={newKpi.active}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Active"
            className="form-input"
          />
        </div>
        <button type="submit" className="btn">
          Add KPI
        </button>
      </form>
    </Modal>
  );

  return (
    <div className="kpi-manager">
      <h2>Manage KPIs</h2>

      {/* KPI List */}
      <div className="kpi-list">
        <h3>Current KPIs</h3>
        {error && <div className="error-message">{error}</div>}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>KPI ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Target Value</th>
                <th>Actual Value</th>
                <th>Unit of Measure</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Department ID</th>
                <th>Project ID</th>
                <th>Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => (
                <tr key={kpi._id} className={!kpi.active ? "inactive" : ""}>
                  <td>{kpi.kpi_id}</td>
                  <td>{kpi.name}</td>
                  <td>{kpi.description}</td>
                  <td>{kpi.category}</td>
                  <td>{kpi.target_value}</td>
                  <td>{kpi.actual_value}</td>
                  <td>{kpi.unit}</td>
                  <td>{kpi.frequency}</td>
                  <td>{kpi.status}</td>
                  <td>{kpi.department_id}</td>
                  <td>{kpi.project_id}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        kpi.active ? "status-active" : "status-inactive"
                      }`}
                    >
                      {kpi.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(kpi)}
                      className="btn btn-small btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(kpi)}
                      className={`btn btn-small ${
                        kpi.active ? "btn-deactivate" : "btn-activate"
                      }`}
                    >
                      {kpi.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*     
      kpi_id: "",
    name: "",
    description: "",
    category: "",
    target_value: "",
    actual_value: "",
    unit: "",
    frequency: "",
    status: "",
    department_id: "",
    project_id: "",
    active: true, */}

      {/* Edit KPI Modal */}
      {editingKpi && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit KPI</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <input
                  type="text"
                  name="kpi_id"
                  value={editingKpi.kpi_id}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={editingKpi.name}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="KPI Name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="description"
                  value={editingKpi.description}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Description"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="category"
                  value={editingKpi.category}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Category"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="target_value"
                  value={editingKpi.target_value}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Source"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="actual_value"
                  value={editingKpi.actual_value}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Actual Value"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="unit"
                  value={editingKpi.unit || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Unit of Measure"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="frequency"
                  value={editingKpi.frequency || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Frequency"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="status"
                  value={editingKpi.status || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Status"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="department_id"
                  value={editingKpi.department_id || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Department ID"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="project_id"
                  value={editingKpi.project_id || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Project ID"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="active"
                  value={editingKpi.active || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Active"
                  className="form-input"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKpi(null)}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <br />
      <button onClick={openModal} className="btn">
        Add New KPI
      </button>
      <AddKpiModal />
    </div>
  );
};

export default KpiManager;
