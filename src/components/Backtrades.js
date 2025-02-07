import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';
import './Backtrades.css';

const Backtrades = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isExpanded, setIsExpanded] = useState(true);
    const [data, setData] = useState([
        {
            spread: "Single",
            side: "BUY",
            qtySymbol: 10,
            exp: "01/13/2023 (Weekly)",
            strike: "132",
            type: "CALL",
            tradeDate: "01/10/2023",
            price: 1.49,
            delta: "385.37",
            theta: "-349.70",
            plOpen: "$0.00",
            checked: true,
        },
        {
            spread: "Single",
            side: "SELL",
            qtySymbol: -10,
            exp: "01/13/2023 (Weekly)",
            strike: "132",
            type: "CALL",
            tradeDate: "01/10/2023",
            price: 1.49,
            delta: "-385.37",
            theta: "349.70",
            plOpen: "$0.00",
            checked: false,
        },
        {
            spread: "Single",
            side: "SELL",
            qtySymbol: -10,
            exp: "02/17/2023",
            strike: "135",
            type: "PUT",
            tradeDate: "01/10/2023",
            price: 8.525,
            delta: "587.22",
            theta: "67.42",
            plOpen: "$0.00",
            checked: false,
        },
    ]);

    const handleDateChange = (date, index) => {
        const updatedData = [...data];
        updatedData[index].tradeDate = date.toISOString().split("T")[0]; // Actualizar la fecha
        setData(updatedData);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleRowCheck = (index) => {
        const updatedData = [...data];
        updatedData[index].checked = !updatedData[index].checked;
        setData(updatedData);
    };

    const updateSide = (index, side) => {
        const updatedData = [...data];
        updatedData[index].side = side;
        setData(updatedData);
    };

    const updateQtySymbol = (index, change) => {
        const updatedData = [...data];
        updatedData[index].qtySymbol += change;
        setData(updatedData);
    };

    const updateStrikeType = (index, type) => {
        const updatedData = [...data];
        updatedData[index].type = type;
        setData(updatedData);
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
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MM/dd/yyyy"
                            className="backtrades-date-input"
                            placeholderText="MM/DD/YYYY"
                            id="date-input"
                        />
                        <FaCalendarAlt className="calendar-icon" />
                    </div>
                </div>
            </div>
            {isExpanded && (
                <table className="backtrades-table">
                    <thead>
                        <tr>
                            <th></th> {/* Checkbox */}
                            <th>Spread</th>
                            <th>Side</th>
                            <th>Qty Symbol</th>
                            <th>Exp</th>
                            <th>Strike Type</th>
                            <th>Trade Date</th>
                            <th>Price</th>
                            <th>Delta</th>
                            <th>Theta</th>
                            <th>P/L Open</th>
                            <th></th> {/* Actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className={row.side === "BUY" ? "row-buy" : "row-sell"}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={row.checked}
                                        onChange={() => toggleRowCheck(index)}
                                    />
                                </td>
                                <td>{row.spread}</td>
                                <td>
                                    <select className='select-backtrades'
                                        value={row.side}
                                        onChange={(e) => updateSide(index, e.target.value)}
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => updateQtySymbol(index, -1)}>-</button>
                                    {row.qtySymbol}
                                    <button onClick={() => updateQtySymbol(index, 1)}>+</button>
                                </td>
                                <td>{row.exp}</td>
                                <td>
                                    <select className='select-backtrades'
                                        value={row.type}
                                        onChange={(e) => updateStrikeType(index, e.target.value)}
                                    >
                                        <option value="CALL">CALL</option>
                                        <option value="PUT">PUT</option>
                                    </select>
                                </td>
                                <td>
                                    <DatePicker
                                        selected={new Date(row.tradeDate)}
                                        onChange={(date) => handleDateChange(date, index)}
                                        dateFormat="MM/dd/yyyy"
                                    />
                                    
                                </td>
                                <td>
                                    {row.price.toFixed(3)}{" "}
                                    <FaEdit className="edit-icon" />
                                </td>
                                <td>{row.delta}</td>
                                <td>{row.theta}</td>
                                <td>{row.plOpen}</td>
                                <td>
                                    <button className="remove-row-btn" onClick={() => setData(data.filter((_, i) => i !== index))}>
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
