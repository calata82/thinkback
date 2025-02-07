import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import './TickerSelection.css';
import TickerDropdown from './TickerDropDown';
import { TickerContext } from '../context/TickerContext';

const TickerSelection = ({ tickers }) => {
  const { selectedTicker, setSelectedTicker, selectedDate, setSelectedDate } = useContext(TickerContext); // Consumir TickerContext
  const [closePrice, setClosePrice] = useState(null); // Precio de cierre

  // useEffect para obtener datos del ticker cada vez que cambien el ticker o la fecha
  useEffect(() => {
    const fetchTickerData = async () => {
      if (selectedTicker && selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await axios.get(
            `http://localhost:5000/api/getTickerData?ticker=${selectedTicker}&tradeDate=${formattedDate}`
          );
          if (response.data) {
            setClosePrice(response.data.clsPx); // Mostrar precio de cierre
          } else {
            setClosePrice('Precio no encontrado');
          }
        } catch (error) {
          console.error('Error al obtener el precio del ticker:', error);
          setClosePrice('No ticker');
        }
      } else {
        setClosePrice(null);
      }
    };

    fetchTickerData();
  }, [selectedTicker, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Actualizar la fecha en el contexto
    setClosePrice(null); // Limpiar el precio mientras se carga
  };

  return (
    <div className="selection">
      <div className="selection-date-text">
        <span>
          {selectedDate ? selectedDate.toLocaleDateString('en-US') : 'MM/DD/YYYY'} Trading Day
        </span>
      </div>
      <div className="selection-bottom">
        <div className="selection-input-container">
          <label htmlFor="ticker" className="selection-label">Select symbol</label>
          <TickerDropdown tickers={tickers} /> {/* Dropdown conectado al contexto */}
          <span className="selection-value">
            {closePrice !== null ? `$${closePrice}` : ''}
          </span>
        </div>
        <div className="selection-date">
          <label htmlFor="date" className="selection-date-label">Select Date:</label>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="selection-date-input"
              placeholderText="MM/DD/YYYY"
              id="date"
            />
            <FaCalendarAlt className="calendar-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerSelection;
