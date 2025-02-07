import React, { useState } from "react";
import "./MainDataTable.css";

const MainDataTable = ({ optionChain, addToBacktrades }) => {
  const [expandedDates, setExpandedDates] = useState({});
  const [strikeCount, setStrikeCount] = useState(4);
  const [selectedMetricCalls, setSelectedMetricCalls] = useState("Extrinsic");
  const [selectedMetricPuts, setSelectedMetricPuts] = useState("Extrinsic");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const metricsOptions = [
    "Intrinsic",
    "Extrinsic",
    "Delta",
    "Gamma",
    "Theta",
    "Rho",
    "Vega",
    "Impl Vol",
    "Theo Price",
    "Covered Return",
    "Max Covered Return",
    "Return on Risk",
    "Return on Capital",
    "Probability ITM",
    "Probability of Touching",
    "Probability OTM",
  ];

  // Agrupar datos por expirationDate
  const groupedData = optionChain.reduce((acc, option) => {
    const date = option.expirationDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(option);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleStrikeChange = (event) => {
    const value = event.target.value;
    setStrikeCount(value === "ALL" ? "ALL" : parseInt(value));
  };

  const isWeekly = (date) => date.includes("Weekly");

  const handleContractClick = (option, type) => {
    const contract = {
      type, // "CALL" o "PUT"
      expirationDate: option.expirationDate,
      strike: option.strike,
      price: type === "CALL" ? option.callBid : option.putBid,
    };
    addToBacktrades(contract); // Agregar a la tabla de backtrades
  };

  const handleMetricClick = (type, event) => {
    event.stopPropagation(); // Evitar que el click cierre filas
    setDropdownOpen(type);
  };

  const handleMetricSelect = (type, metric) => {
    if (type === "CALLS") {
      setSelectedMetricCalls(metric);
    } else {
      setSelectedMetricPuts(metric);
    }
    setDropdownOpen(null);
  };

  return (
    <div className="main-data-table-wrapper">
      {Object.keys(groupedData).length === 0 ? (
        <div className="no-data">
          No data available. Please select a ticker and a date.
        </div>
      ) : (
        <table className="main-data-table">
        <tbody>
          {Object.keys(groupedData).map((expirationDate) => (
            <React.Fragment key={expirationDate}>
              {/* Fila principal */}
              <tr
                className="expiration-row"
                onClick={() => toggleDate(expirationDate)}
              >
                <td className="left-align">
                  <i
                    className={`fas fa-chevron-${
                      expandedDates[expirationDate] ? "down" : "right"
                    }`}
                  ></i>
                  <span className="expiration-date">{expirationDate}</span>
                  {isWeekly(expirationDate) && (
                    <span className="weekly-indicator"> (Weekly)</span>
                  )}
                  <span className="contract-count"> (100)</span>
                </td>
                <td className="right-align">
                  <span>
                    {Math.random().toFixed(2)}% (± {(Math.random() * 100).toFixed(3)})
                  </span>
                </td>
              </tr>

              {/* Tabla expandida */}
              {expandedDates[expirationDate] && (
                <tr className="nested-row">
                  <td colSpan="2">
                    <div className="option-chain-tables">
                      <table className="calls-table">
                        <thead>
                          <tr>
                            <th
                              onClick={(e) => handleMetricClick("CALLS", e)}
                              className="metric-header"
                            >
                              {selectedMetricCalls}
                            </th>
                            <th>Bid</th>
                            <th>Ask</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedData[expirationDate]
                            .slice(0, strikeCount === "ALL" ? Infinity : strikeCount)
                            .map((option, index) => (
                              <tr key={index}>
                                <td>{option.callExtrinsic}</td>
                                <td
                                  className="hoverable"
                                  onClick={() => handleContractClick(option, "CALL")}
                                  title="Buy"
                                >
                                  {option.callBid}
                                </td>
                                <td
                                  className="hoverable"
                                  onClick={() => handleContractClick(option, "CALL")}
                                  title="Sell"
                                >
                                  {option.callAsk}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="strikes-column">
                        <div className="strike-selector">
                          <label htmlFor="strikes-to-show">Strikes:</label>
                          <select
                            id="strikes-to-show"
                            value={strikeCount === "ALL" ? "ALL" : strikeCount}
                            onChange={handleStrikeChange}
                          >
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                            <option value="ALL">ALL</option>
                          </select>
                        </div>
                        <table>
                          <thead>
                            <tr>
                              <th>Exp</th>
                              <th>Strike</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedData[expirationDate]
                              .slice(0, strikeCount === "ALL" ? Infinity : strikeCount)
                              .map((option, index) => (
                                <tr key={index}>
                                  <td>{option.expirationDate}</td>
                                  <td>{option.strike}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <table className="puts-table">
                        <thead>
                          <tr>
                            <th>Bid</th>
                            <th>Ask</th>
                            <th
                              onClick={(e) => handleMetricClick("PUTS", e)}
                              className="metric-header"
                            >
                              {selectedMetricPuts}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedData[expirationDate]
                            .slice(0, strikeCount === "ALL" ? Infinity : strikeCount)
                            .map((option, index) => (
                              <tr key={index}>
                                <td
                                  className="hoverable"
                                  onClick={() => handleContractClick(option, "PUT")}
                                  title="Buy"
                                >
                                  {option.putBid}
                                </td>
                                <td
                                  className="hoverable"
                                  onClick={() => handleContractClick(option, "PUT")}
                                  title="Sell"
                                >
                                  {option.putAsk}
                                </td>
                                <td>{option.putExtrinsic}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        </table>
      )}
      {dropdownOpen === "CALLS" && (
        <div className="dropdown-calls">
          {metricsOptions.map((metric, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleMetricSelect("CALLS", metric)}
            >
              {metric}
            </div>
          ))}
        </div>
      )}
      {dropdownOpen === "PUTS" && (
        <div className="dropdown-puts">
          {metricsOptions.map((metric, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleMetricSelect("PUTS", metric)}
            >
              {metric}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainDataTable;
