const AirflowPage = () => {
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <iframe
        src="http://10.13.10.12:8080"
        title="Airflow UI"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default AirflowPage;
