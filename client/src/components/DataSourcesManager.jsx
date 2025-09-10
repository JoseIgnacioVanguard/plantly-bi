import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const DataSourcesManager = () => {
  const [dataSources, setDataSources] = useState([]);
  const [newDataSource, setNewDataSource] = useState({
    source_id: "",
    source_system: "",
    source_location: "",
    host_api_url: "",
    source_type: "",
    system_type: "",
    source_name: "",
    source_status: "",
    valid_from: "",
    valid_to: "",
    source_description: ""
  });
  const [editingDataSource, setEditingDataSource] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      const response = await axios.get("http://10.13.10.12:5001/api/dataSources");
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
      await axios.post("http://10.13.10.12:5001/api/dataSources", newDataSource);
      setNewDataSource({
        source_id: "",
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
      closeModal();
    } catch (error) {
      console.error("Error creating data source:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create data source";
      setError(errorMessage);
    }
  };

  const handleEdit = (dataSource) => {
    setEditingDataSource(dataSource);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://10.13.10.12:5001/api/dataSources/${editingDataSource.source_id}`,
        editingDataSource
      );
      setEditingDataSource(null);
      fetchDataSources();
      setError("");
    } catch (error) {
      console.error("Error updating data source:", error);
      setError("Failed to update data source");
    }
  };

  const AddDataSourceModal = () => (
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
      <h2>Add New Data Source</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="number"
            name="source_id"
            value={newDataSource.source_id}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Data Source ID"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_system"
            value={newDataSource.source_system}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source System"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_location"
            value={newDataSource.source_location}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Location"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="host_api_url"
            value={newDataSource.host_api_url}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Host/API URL"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_type"
            value={newDataSource.source_type}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Type"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="system_type"
            value={newDataSource.system_type}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="System Type"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_name"
            value={newDataSource.source_name}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Name"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_status"
            value={newDataSource.source_status}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Status"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="valid_from"
            value={newDataSource.valid_from}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Valid From"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="valid_to"
            value={newDataSource.valid_to}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Valid To"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_description"
            value={newDataSource.source_description}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Description"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="btn">
          Add Data Source
        </button>
      </form>
    </Modal>
  );

  return (
    <div className="data-source-manager">
      <h2>Manage Data Sources</h2>

      {/* Data Source List */}
      <div className="data-source-list">
        <h3>Current Data Sources</h3>
        {error && <div className="error-message">{error}</div>}
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
                <tr key={dataSource.source_id} >
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
                      onClick={() => handleEdit(dataSource)}
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

      {/* Edit Data Source Modal */}
      {editingDataSource && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Data Source</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <input
                  type="text"
                  name="source_id"
                  value={editingDataSource.source_id}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-group">
          <input
            type="text"
            name="source_system"
            value={editingDataSource.source_system}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source System"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_location"
            value={editingDataSource.source_location}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Location"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="host_api_url"
            value={editingDataSource.host_api_url}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Host/API URL"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_type"
            value={editingDataSource.source_type}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Type"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="system_type"
            value={editingDataSource.system_type}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="System Type"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_name"
            value={editingDataSource.source_name}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Name"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_status"
            value={editingDataSource.source_status}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Status"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="valid_from"
            value={editingDataSource.valid_from}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Valid From"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="valid_to"
            value={editingDataSource.valid_to}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Valid To"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="source_description"
            value={editingDataSource.source_description}
            onChange={(e) => handleInputChange(e, false)}
            placeholder="Source Description"
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
                  onClick={() => setEditingDataSource(null)}
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
        Add New Data Source
      </button>
      <AddDataSourceModal />
    </div>
  );
};

export default DataSourcesManager;
