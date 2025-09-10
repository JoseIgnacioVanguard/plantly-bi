import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const InvoicingDetail = () => {
  const [invoicingData, setInvoicingData] = useState([]);
  const [error, setError] = useState("");

  const [documentoFilter, setDocumentoFilter] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [containerIdFilter, setContainerIdFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [dtFromFilter, setDtFromFilter] = useState("");
  const [dtToFilter, setDtToFilter] = useState("");

  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Apply filters before pagination
  const filteredData = invoicingData.filter((invoice) => {
    const documentoMatch = invoice.documento
      .toLowerCase()
      .includes(documentoFilter.toLowerCase());
    const clienteMatch = invoice.cliente
      .toLowerCase()
      .includes(clienteFilter.toLowerCase());
    const containerMatch = invoice.container_id
      .toLowerCase()
      .includes(containerIdFilter.toLowerCase());
    const empresaMatch = invoice.empresa
      .toLowerCase()
      .includes(empresaFilter.toLowerCase());

    const docDate = invoice.dt_documento;
    const dateFromOk = !dtFromFilter || docDate >= dtFromFilter;
    const dateToOk = !dtToFilter || docDate <= dtToFilter;

    return (
      documentoMatch &&
      clienteMatch &&
      containerMatch &&
      empresaMatch &&
      dateFromOk &&
      dateToOk
    );
  });

  const paginatedData = filteredData
    .sort((a, b) => a.dt_documento.localeCompare(b.dt_documento))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatNumber = (value) =>
    typeof value === "number" ? numberFormatter.format(value) : "-";

  const twoDecimalFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const downloadExcel = () => {
    if (!invoicingData.length) return;

    const worksheet = XLSX.utils.json_to_sheet(invoicingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoicing");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "invoicing_data.xlsx");
  };

  useEffect(() => {
    fetch("http://10.13.10.12:5001/api/invoicing")
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Received from API:", data);
        setInvoicingData(data);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError("Error fetching data");
      });
  }, []);

  return (
    <div>
      <h1>InvoicingDetail</h1>
      <div className="invoicingData-list">
        {error && <div className="error-message">{error}</div>}
        <button onClick={downloadExcel} className="login-btn">
          📥 Download Excel
        </button>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>
                  <input
                    type="text"
                    placeholder="Filter"
                    value={empresaFilter}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setEmpresaFilter(e.target.value);
                    }}
                    style={{ width: "100%" }}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Filter"
                    value={documentoFilter}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setDocumentoFilter(e.target.value);
                    }}
                    style={{ width: "100%" }}
                  />
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <input
                      type="date"
                      value={dtFromFilter}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setDtFromFilter(e.target.value);
                      }}
                    />
                    <input
                      type="date"
                      value={dtToFilter}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setDtToFilter(e.target.value);
                      }}
                    />
                  </div>
                </th>
                <th></th>
                <th></th>
                <th>
                  <input
                    type="text"
                    placeholder="Filter"
                    value={clienteFilter}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setClienteFilter(e.target.value);
                    }}
                    style={{ width: "100%" }}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Filter"
                    value={containerIdFilter}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setContainerIdFilter(e.target.value);
                    }}
                    style={{ width: "100%" }}
                  />
                </th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <th>source</th>
                <th>empresa</th>
                <th>documento</th>
                <th>dt_documento</th>
                <th>item</th>
                <th>status</th>
                <th>cliente</th>
                <th>container_id</th>
                <th className="number-cell">qty</th>
                <th className="number-cell">fob_usd</th>
                <th className="number-cell">flete_usd</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((invoice) => (
                <tr key={invoice.documento + invoice.item}>
                  <td>{invoice.source}</td>
                  <td>{invoice.empresa}</td>
                  <td>{invoice.documento}</td>
                  <td>{invoice.dt_documento}</td>
                  <td>{invoice.item}</td>
                  <td>{invoice.status}</td>
                  <td>{invoice.cliente}</td>
                  <td>{invoice.container_id}</td>
                  <td className="number-cell">
                    {twoDecimalFormatter.format(invoice.qty)}
                  </td>
                  <td className="number-cell">
                    {twoDecimalFormatter.format(invoice.fob_usd)}
                  </td>
                  <td className="number-cell">
                    {twoDecimalFormatter.format(invoice.flete_usd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            className="login-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="login-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicingDetail;
