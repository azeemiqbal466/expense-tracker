const SummaryCard = ({ title, value, icon, type }) => {
  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <p>{title}</p>
        <h3>Rs. {Number(value || 0).toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default SummaryCard;
