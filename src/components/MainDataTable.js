import React, { useState, useEffect, useContext   } from "react";
import { TickerContext } from '../context/TickerContext';
import "./MainDataTable.css";

const MainDataTable = ({ optionChain, addToBacktrades }) => {
  const [expandedDates, setExpandedDates] = useState({});
  const [strikeCount, setStrikeCount] = useState(4);
  const [selectedMetricCalls, setSelectedMetricCalls] = useState("Extrinsic");
  const [selectedMetricPuts, setSelectedMetricPuts] = useState("Extrinsic");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { selectedDate } = useContext(TickerContext); 
 
  const [optionChainSelection, setOptionChainSelection] = useState(null);


  const handleOptionClick = (option, action, type) => {
    if (!option || !action || !type) {
        console.warn("Información incompleta para agregar a Backtrades:", { option, action, type });
        return;
    }

    setOptionChainSelection(option);

    const newBacktradeEntry = {
        ticker: option.ticker,
        expirationDate: option.expirDate,
        isWeekly: isWeekly(option.tradeDate, option.expirDate),
        strike: option.strike,
        type: type || "CALL",
        price: action === "BUY"
            ? type === "CALL"
                ? option.callAskPrice || 0
                : option.putAskPrice || 0
            : type === "CALL"
                ? option.callBidPrice || 0
                : option.putBidPrice || 0,
        action,
        qtySymbol: 1,
        tradeDate: selectedDate,
        delta: option.delta || "N/A",
        theta: option.theta || "N/A",
    };

    console.debug("Adding new backtrade entry:", newBacktradeEntry);
    addToBacktrades(newBacktradeEntry);
};



  

  useEffect(() => {
    console.debug("Data received from backend:", optionChain);
  }, [optionChain]);

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

  const groupedData = optionChain.reduce((acc, option) => {
    const date = option.expirDate || "No Expiration Date";
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



  const handleContractClick = (option, type, action) => {
    if (!option || !type || !action) {
      console.warn("Información incompleta para agregar a Backtrades:", { option, type, action });
      return;
    }
  
    // Lógica para determinar si es Weekly
    const isWeeklySpread = isWeekly(option.tradeDate, option.expirDate);
  
    const contract = {
      ticker: option.ticker || "N/A",
      type, // CALL o PUT
      expirationDate: option.expirDate || "N/A",
      strike: option.strike || "-", 
      price:
        action === "BUY"
          ? type === "CALL"
            ? option.callBidPrice || "-"
            : option.putBidPrice || "-"
          : type === "CALL"
          ? option.callAskPrice || "-"
          : option.putAskPrice || "-",
      action, // BUY o SELL
      delta: option.delta || "-",
      theta: option.theta || "-",
      spread: isWeeklySpread ? "Weekly" : "Single", 
      color: action === "BUY" ? "green" : "red", 
    };
  
    console.debug("Contrato generado:", contract);
    addToBacktrades(contract);
  };
  


  const handleMetricClick = (type, event) => {
    event.stopPropagation();
    setDropdownOpen(type);
  };

 // Manejar la selección de métricas en el dropdown
const handleMetricSelect = (type, metric) => {
  if (type === "CALLS") {
    setSelectedMetricCalls(metric); 
  } else if (type === "PUTS") {
    setSelectedMetricPuts(metric); 
  }
  setDropdownOpen(null); 
};


const getMetricValue = (option, metric, type) => {
  switch (metric) {
    case "Intrinsic":
      return calculateIntrinsic(option, type);
    case "Extrinsic":
      return calculateExtrinsic(option, type);
    case "Delta":
      return option.delta || "-";
    case "Gamma":
      return option.gamma || "-";
    case "Theta":
      return option.theta || "-";
    case "Rho":
      return option.rho || "-";
    case "Vega":
      return option.vega || "-";
    case "Impl Vol":
      return type === "CALL"
        ? option.callMidIv || "-"
        : option.putMidIv || "-";
    case "Theo Price":
      return type === "CALL"
        ? option.callValue || "-"
        : option.putValue || "-";
        case "Covered Return":
          return calculateCoveredReturn(option);
      case "Max Covered Return":
          return calculateMaxCoveredReturn(option);
      case "Return on Risk":
          return calculateReturnOnRisk(option);
      case "Return on Capital":
          return calculateReturnOnCapital(option);
      case "Probability ITM":
          return calculateProbabilityITM(option);
      case "Probability OTM":
          return calculateProbabilityOTM(option);
      case "Probability of Touching":
          return calculateProbabilityTouching(option);
    default:
      return "-";
  }
};


const calculateIntrinsic = (option, type) => {
  const stockPrice = option.stockPrice || 0;
  const strike = option.strike || 0;

  if (type === "CALL") {
    return Math.max(stockPrice - strike, 0).toFixed(2);
  } else if (type === "PUT") {
    return Math.max(strike - stockPrice, 0).toFixed(2);
  }
  return "-";
};


const calculateExtrinsic = (option, type) => {
  const intrinsicValue = parseFloat(calculateIntrinsic(option, type));
  const price = type === "CALL" ? option.callAskPrice || 0 : option.putAskPrice || 0;

  return (price - intrinsicValue).toFixed(2);
};

const calculateProbabilityITM = (option) => {
  const { delta } = option;
  return delta !== undefined ? (delta * 100).toFixed(2) + "%" : "-";
};

const calculateProbabilityOTM = (option) => {
  const { delta } = option;
  return delta !== undefined ? ((1 - delta) * 100).toFixed(2) + "%" : "-";
};

const calculateProbabilityTouching = (option) => {
  const { delta } = option;
  return delta !== undefined ? (2 * Math.abs(delta) * 100).toFixed(2) + "%" : "-";
};

const calculateCoveredReturn = (option) => {
  const { callBidPrice, stockPrice } = option;
  return callBidPrice && stockPrice
      ? ((callBidPrice / stockPrice) * 100).toFixed(2) + "%"
      : "-";
};

const calculateMaxCoveredReturn = (option) => {
  const { callAskPrice, stockPrice } = option;
  return callAskPrice && stockPrice
      ? ((callAskPrice / stockPrice) * 100).toFixed(2) + "%"
      : "-";
};

const calculateReturnOnRisk = (option) => {
  const { strike, putBidPrice, stockPrice } = option;
  return strike && putBidPrice && stockPrice
      ? (((strike - stockPrice + putBidPrice) / (stockPrice - putBidPrice)) * 100).toFixed(2) + "%"
      : "-";
};

const calculateReturnOnCapital = (option) => {
  const { strike, putAskPrice, stockPrice } = option;
  return strike && putAskPrice && stockPrice
      ? (((strike - stockPrice - putAskPrice) / stockPrice) * 100).toFixed(2) + "%"
      : "-";
};


const calculateCustomMetric = (option, metric, type) => {
  switch (metric) {
    case "Delta":
      return (option.delta || "-").toFixed(4);
    case "Gamma":
      return (option.gamma || "-").toFixed(4);
    case "Theta":
      return (option.theta || "-").toFixed(4);
    case "Rho":
      return (option.rho || "-").toFixed(4);
    case "Vega":
      return (option.vega || "-").toFixed(4);
    case "Impl Vol":
      return type === "CALL"
        ? (option.callMidIv || "-").toFixed(2)
        : (option.putMidIv || "-").toFixed(2);
    case "Theo Price":
      return type === "CALL"
        ? (option.callValue || "-").toFixed(2)
        : (option.putValue || "-").toFixed(2);
    case "Covered Return":
    case "Max Covered Return":
    case "Return on Risk":
    case "Return on Capital":
    case "Probability ITM":
    case "Probability of Touching":
    case "Probability OTM":
      console.warn(`El cálculo de ${metric} aún no está implementado.`);
      return "-";
    default:
      console.error(`Métrica desconocida: ${metric}`);
      return "-";
  }
};


  const isInTheMoney = (option, type) => {
    const threshold = option.stockPrice || 0;
    return type === "CALL"
      ? option.strike < threshold
      : option.strike > threshold;
  };

  const isWeekly = (tradeDate, expirDate) => {
    if (!tradeDate || !expirDate) {
      console.warn("Invalid dates provided:", { tradeDate, expirDate });
      return false;
    }
  
    const trade = new Date(tradeDate);
    const expir = new Date(expirDate);
  
    const diffDays = (expir - trade) / (1000 * 60 * 60 * 24); 
    const expirDay = expir.getDay(); 
  
    // Verificar si es el tercer viernes del mes (mensual)
    const expirDateNum = expir.getDate();
    const isMonthly = expirDay === 5 && expirDateNum > 14 && expirDateNum <= 21;
  
    // Verificar si es weekly (viernes, no mensual)
    const isWeeklyContract = expirDay === 5 && diffDays > 0 && !isMonthly;
  
    // Logs para depurar
    console.log({
      tradeDate: trade.toISOString().split('T')[0],
      expirDate: expir.toISOString().split('T')[0],
      diffDays,
      expirDay,
      isMonthly,
      isWeeklyContract,
    });
  
    return isWeeklyContract;
  };
  

  const renderOptionRows = (options, type) => {
    const itmRows = options.filter((option) => isInTheMoney(option, type));
    const otmRows = options.filter((option) => !isInTheMoney(option, type));
  
    const rowsToShowCount =
      strikeCount === "ALL" ? itmRows.length + otmRows.length : strikeCount;
  
    const rowsToShow =
      type === "CALL"
        ? [
            ...itmRows.slice(-Math.ceil(rowsToShowCount / 2)),
            ...otmRows.slice(0, Math.floor(rowsToShowCount / 2)),
          ]
        : [
            ...otmRows.slice(0, Math.floor(rowsToShowCount / 2)),
            ...itmRows.slice(-Math.ceil(rowsToShowCount / 2)),
          ];
  
    return rowsToShow.map((option, index) => (
      <tr
        key={index}
        className={
          isInTheMoney(option, type)
            ? `itm-${type.toLowerCase()}-row`
            : `otm-${type.toLowerCase()}-row`
        }
      >
        <td>
          {getMetricValue(
            option,
            type === "CALL" ? selectedMetricCalls : selectedMetricPuts,
            type
          )}
        </td>
        <td
          className="hoverable"
          title="Sell"
          onClick={() => handleOptionClick(option, "SELL", type)}
        >
          {type === "CALL" ? option.callBidPrice || "-" : option.putBidPrice || "-"}
        </td>
        <td
          className="hoverable"
          title="Buy"
          onClick={() => handleOptionClick(option, "BUY", type)}
        >
          {type === "CALL" ? option.callAskPrice || "-" : option.putAskPrice || "-"}
        </td>
      </tr>
    ));
  };
  

  

  return (
    <div className="main-data-table-wrapper">
      {Object.keys(groupedData).length === 0 ? (
        <div className="no-data">No data available. Please select a ticker and a date.</div>
      ) : (
        <table className="main-data-table">
          <tbody>
            {Object.keys(groupedData).map((expirationDate) => (
              <React.Fragment key={expirationDate}>
                <tr
                  className="expiration-row"
                  onClick={() => toggleDate(expirationDate)}
                >
                  <td className="left-align">
                    <i
                      className={`fas fa-chevron-$
                        {expandedDates[expirationDate] ? "down" : "right"}`}
                    ></i>
                    <span className="expiration-date">{expirationDate}</span>
                    <span className="contract-count">
                      ({groupedData[expirationDate]?.length || 0})
                    </span>
                    {groupedData[expirationDate].some((option) => isWeekly(option.tradeDate, option.expirDate)) && (
                      <span className="weeklys-tag">(Weeklys)</span>
                    )}
                  </td>
                  <td className="right-align">
                    {Math.random().toFixed(2)}% (± {(Math.random() * 100).toFixed(3)})
                  </td>
                </tr>

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
                              <th>Bid
                              <div className="table-header-calls">CALLS</div>
                              </th>
                              <th>Ask</th>
                            </tr>
                          </thead>
                          <tbody>{renderOptionRows(groupedData[expirationDate], "CALL")}</tbody>
                        </table>
                        <div className="strikes-column">
                          <div className="strike-selector">
                            <label htmlFor="strikes-to-show">Strikes:</label>
                            <select
                              id="strikes-to-show"
                              value={
                                strikeCount === "ALL" ? "ALL" : strikeCount
                              }
                              onChange={(event) =>
                                setStrikeCount(
                                  event.target.value === "ALL"
                                    ? "ALL"
                                    : parseInt(event.target.value, 10)
                                )
                              }
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
                                .slice(
                                  0,
                                  strikeCount === "ALL"
                                    ? Infinity
                                    : strikeCount
                                )
                                .map((option, index) => (
                                  <tr key={index}
                                  onClick={() => handleOptionClick(option, "BUY", "CALL")} // Acción y tipo según corresponda
                                  >
                                    <td>{option.expirDate || "-"}</td>
                                    <td>{option.strike || "-"}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        <table className="puts-table">
                          <thead>
                            <tr>
                            <th
                                onClick={(e) => handleMetricClick("PUTS", e)}
                                className="metric-header"
                              >
                                {selectedMetricPuts}
                              </th>
                              <th>Bid
                              <div className="table-header-puts">PUTS</div>
                              </th>
                              <th>Ask</th>
                              
                            </tr>
                          </thead>
                          <tbody>{renderOptionRows(groupedData[expirationDate], "PUT")}</tbody>
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
