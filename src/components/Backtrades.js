import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';
import './Backtrades.css';

const Backtrades = ({ backtrades, setBacktrades, getCurrentPrice, optionChainSelection, backtradesDate, setBacktradesDate }) => {
    const [isExpanded, setIsExpanded] = useState(true);
  
    const extractPLData = (row) => {
        console.log("Extracting P/L Data for row:", row); 
    
        if (!row) {
            console.error("Fila de Backtrades no encontrada.");
            return null;
        }
    
        const { ticker, strike, price, action, type, qtySymbol } = row;
    
        if (!ticker || !strike || !price || !action || !type || !qtySymbol) {
            console.warn("Datos incompletos en la fila:", row);
            return null;
        }
    
        const spotPrice = getCurrentPrice ? getCurrentPrice(ticker, backtradesDate) : 0;
        console.log("Spot Price obtenido:", spotPrice);
    
        if (spotPrice === undefined || spotPrice === null) {
            console.warn(`Precio actual no encontrado para el ticker: ${ticker}`);
            return null;
        }
    
        return { ticker, strike, price, action, type, qtySymbol, spotPrice };
    };
    
    const calculatePLOpen = (row) => {
        const plData = extractPLData(row);
        if (!plData) {
            console.warn("Datos P/L no disponibles.");
            return "$0.00";
        }
    
        const { strike, price, action, type, qtySymbol, spotPrice } = plData;
    
        let plOpen = 0;
        if (type === "CALL") {
            plOpen =
                action === "BUY"
                    ? (spotPrice - strike - price) * qtySymbol
                    : (price + strike - spotPrice) * qtySymbol;
        } else if (type === "PUT") {
            plOpen =
                action === "BUY"
                    ? (strike - spotPrice - price) * qtySymbol
                    : (price + spotPrice - strike) * qtySymbol;
        }
    
        console.log(`P/L Open calculado (${type} - ${action}):`, plOpen);
        return `$${plOpen.toFixed(2)}`;
    };
    
   

    const handleDateChange = (date, index) => {
        const updatedData = [...backtrades];
        updatedData[index].tradeDate = date?.toISOString().split("T")[0] || "-";
        setBacktrades(updatedData);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleRowCheck = (index) => {
        const updatedData = [...backtrades];
        updatedData[index].checked = !updatedData[index].checked || false;
        setBacktrades(updatedData);
    };

    const updateQtySymbol = (index, change) => {
        setBacktrades((prevBacktrades) =>
            prevBacktrades.map((row, i) =>
                i === index
                    ? {
                          ...row,
                          qtySymbol: Math.max((row.qtySymbol || 1) + change, 1), 
                          plOpen: calculatePLOpen({
                              ...row,
                              qtySymbol: Math.max((row.qtySymbol || 1) + change, 1),
                          }), 
                      }
                    : row
            )
        );
    };
    

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(3);
        }
        return "-";
    };

    const handleSpreadChange = (index, newSpread) => {
        const updatedData = [...backtrades];
        updatedData[index].spread = newSpread; 
        setBacktrades(updatedData);
    };

    const spreadOptions = ["Single", "Vertical", "Calendar", "Diagonal", "Iron Condor", "Custom"]; 


    const handleTickerChange = (index, newTicker) => {
        const updatedData = [...backtrades];
        updatedData[index].ticker = newTicker;
        setBacktrades(updatedData);
    };
    

    useEffect(() => {
       
        setBacktrades((prevBacktrades) =>
            prevBacktrades.map((row) => ({
                ...row,
                plOpen: calculatePLOpen(row), 
            }))
        );
    }, [backtradesDate]); 
    


    const tickerOptions = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA"];

    
    const isWeekly = (tradeDate, expirDate) => {
        if (!tradeDate || !expirDate) return false;
    
        const trade = new Date(tradeDate);
        const expir = new Date(expirDate);
    
        const diffDays = (expir - trade) / (1000 * 60 * 60 * 24); 
        const expirDay = expir.getDay(); 
    
        const isMonthly = expirDay === 5 && expir.getDate() > 14 && expir.getDate() <= 21;
        return expirDay === 5 && diffDays > 0 && !isMonthly;
    };
    


      // Actualiza los datos cuando se selecciona algo en OptionChain
      useEffect(() => {
        if (optionChainSelection) {
            const { ticker, expirationDate, strike, type, price, action } = optionChainSelection;

            const newEntry = {
                ticker,
                expirationDate,
                strike,
                type,
                price,
                action,
                qtySymbol: 1,
                tradeDate: new Date().toISOString().split("T")[0],
                isWeekly: isWeekly(new Date(), expirationDate),
            };

            setBacktrades((prevBacktrades) => [...prevBacktrades, newEntry]);
        }
    }, [optionChainSelection, setBacktrades]);




    // Incrementa la fecha seleccionada en un día
    const incrementDate = () => {
        setBacktradesDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };
    
    const decrementDate = () => {
        setBacktradesDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };
    
    

        
    return (
        <section className="backtrades">
            <div className="backtrades-header">
                <input
                    type="checkbox"
                    className="backtrades-checkbox"
                    checked={isExpanded}
                    onChange={toggleExpand}
                />
                <h2 className="backtrades-title">
                    Backtrades <i className={`fas ${isExpanded ? 'fa-caret-down' : 'fa-caret-right'}`}></i>
                </h2>
                <div className="backtrades-date">
                    <label htmlFor="date-input" className="backtrades-date-label">P/L Date:</label>
                    <div className="date-picker-container">
                        
                        <DatePicker
                            selected={backtradesDate}
                            onChange={(date) => setBacktradesDate(date)}
                            dateFormat="MM/dd/yyyy"
                            className="backtrades-date-input"
                            placeholderText="MM/DD/YYYY"
                            id="date-input"
                        />
                        <FaCalendarAlt className="calendar-icon" /> 
                    </div>
                    <div className='date-adjust-btn-container'>
                        <button
                            className="date-adjust-btn increment-btn"
                            onClick={incrementDate}
                            title="Increase Date"
                        >
                            +
                        </button>
                         <button
                            className="date-adjust-btn decrement-btn"
                            onClick={decrementDate}
                            title="Decrease Date"
                        >
                            -
                        </button>
                        
                        </div>
                </div>
            </div>
            {isExpanded && (
                <table className="backtrades-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Spread</th>
                            <th>Side</th>
                            <th>Qty Symbol</th>
                            <th>Exp</th>
                            <th>Strike</th>
                            <th>Type</th>
                            <th>Trade Date</th>
                            <th>Price</th>
                            <th>Delta</th>
                            <th>Theta</th>
                            <th>P/L Open</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {backtrades.map((row, index) => (
                            <tr
                                key={index}
                                className={row.action === "BUY" ? "row-buy" : "row-sell"}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={row.checked || false}
                                        onChange={() => toggleRowCheck(index)}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={row.spread || "Single"}
                                        onChange={(e) => handleSpreadChange(index, e.target.value)}
                                        className="spread-select"
                                    >
                                        {spreadOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={row.action || "BUY"}
                                        onChange={(e) => {
                                            const updatedData = [...backtrades];
                                            updatedData[index].action = e.target.value;
                                            setBacktrades(updatedData);
                                        }}
                                        className="side-select"
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </select>
                                </td>
                                <td className="qty-symbol-cell">
                                    <div className="qty-input-container">
                                    <button
                                        onClick={() => updateQtySymbol(index, -1)}
                                        className="qty-btn"
                                        title="Decrease Quantity"
                                    >
                                            -
                                        </button>
                                        <span className="qty-value">
                                            {`${row.qtySymbol >= 0 ? "+" : ""}${row.qtySymbol || 0}`}
                                        </span>
                                        <button
                                            onClick={() => updateQtySymbol(index, 1)}
                                            className="qty-btn"
                                            title="Increase Quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="qty-ticker-dropdown-container">
                                        <select
                                            value={row.ticker || "N/A"}
                                            onChange={(e) => handleTickerChange(index, e.target.value)}
                                            className="qty-ticker-dropdown"
                                        >
                                            {tickerOptions.map((ticker, idx) => (
                                                <option key={idx} value={ticker}>
                                                    {ticker}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    {row.expirationDate ? (
                                        <span>
                                            {row.isWeekly ? <span className="weekly-tag">(Weeklys)</span> : null}
                                            {new Date(row.expirationDate).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: '2-digit',
                                            })} 
                                        </span>
                                    ) : "-"}
                                </td>
                                <td>{row.strike || "-"}</td>
                                <td>{row.type || "CALL"}</td>
                                <td>
                                <DatePicker
                                    selected={backtradesDate}
                                    onChange={(date) => setBacktradesDate(date)}
                                    dateFormat="MM/dd/yyyy"
                                    className="backtrades-date-input"
                                    placeholderText="MM/DD/YYYY"
                                    id="date-input"
                                />

                                </td>
                                <td>
                                    {formatPrice(row.price)} <FaEdit className="edit-icon" />
                                </td>
                                <td>{row.delta || "-"}</td>
                                <td>{row.theta || "-"}</td>
                                <td>{calculatePLOpen(row)}</td>
                                <td className='td-input'>
                                    <button
                                        className="remove-row-btn"
                                        onClick={() => setBacktrades(backtrades.filter((_, i) => i !== index))}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );



};

export default Backtrades;
