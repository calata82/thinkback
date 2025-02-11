import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import './TickerSelection.css';
import { API_BASE_URL, API_TOKEN } from '../config'; 

import TickerDropdown from './TickerDropDown';
import { TickerContext } from '../context/TickerContext';

const TickerSelection = ({ tickers }) => {
  const {
    selectedTicker,
    setSelectedTicker,
    selectedDate,
    setSelectedDate,
    selectedDescription,
    setSelectedDescription,
  } = useContext(TickerContext);
  const [closePrice, setClosePrice] = useState(null);
  const [prevClosePrice, setPrevClosePrice] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  // useEffect para obtener datos del ticker cada vez que cambien el ticker o la fecha
  useEffect(() => {
    const fetchTickerData = async () => {
      if (selectedTicker && selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await axios.get(
            `${API_BASE_URL}/api/getTickerData?ticker=${selectedTicker}&tradeDate=${formattedDate}`
          );
          if (response.data) {
            setClosePrice(response.data.clsPx); 
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

  // Obtener el precio de cierre anterior
  useEffect(() => {
    const fetchPrevClose = async () => {
      if (selectedTicker && selectedDate) {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const formattedPrevDate = prevDate.toISOString().split('T')[0];

        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/getTickerData?ticker=${selectedTicker}&tradeDate=${formattedPrevDate}`
          );
          if (response.data) {
            setPrevClosePrice(response.data.clsPx);
          } else {
            setPrevClosePrice('N/A');
          }
        } catch (error) {
          console.error('Error al obtener el precio de cierre anterior:', error);
          setPrevClosePrice('N/A');
        }
      }
    };

    fetchPrevClose();
  }, [selectedTicker, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date); 
    setClosePrice(null); 
  };

  const handleSymbolSelect = (symbol, description) => {
    setSelectedTicker(symbol); 
    setSelectedDescription(description || 'No description available'); 
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
          <TickerDropdown
            tickers={tickers}
            onSymbolSelect={(symbol, description) => handleSymbolSelect(symbol, description)}
          />
          <span className="selection-value">
          {closePrice !== null ? `$${closePrice}` : ''}
          </span>
          {prevClosePrice !== null && closePrice !== null && (
            <span className={`selection-change ${closePrice > prevClosePrice ? 'positive' : 'negative'}`}>
              {closePrice > prevClosePrice
                ? `+${(closePrice - prevClosePrice).toFixed(2)} (+${(((closePrice - prevClosePrice) / prevClosePrice) * 100).toFixed(2)}%)`
                : `${(closePrice - prevClosePrice).toFixed(2)} (${(((closePrice - prevClosePrice) / prevClosePrice) * 100).toFixed(2)}%)`}
            </span>
          )}

          <span className="selection-prev-close">
            {prevClosePrice !== null ? `Prev Close: $${prevClosePrice}` : ''}
          </span>
        </div>
        <div className="symbol-description-box">
          <span className="symbol">{selectedTicker || "N/A"}</span>
          <span className="description">{selectedDescription || "No description available"}</span>
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
