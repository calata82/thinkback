import React, { useState, useContext } from 'react';
import { TickerContext } from '../context/TickerContext';
import tickerDescriptions from './tickers.json';

import './TickerDropdown.css';

const TickerDropdown = ({ tickers = [] }) => {
  console.log('Tickers recibidos en TickerDropdown:', tickers);
  const { selectedTicker, setSelectedTicker, setSelectedDescription } = useContext(TickerContext); // Añadido setSelectedDescription
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const enrichedTickers = tickers.map((ticker) => ({
    ...ticker,
    description: tickerDescriptions.find((item) => item.ticker === ticker.ticker)?.description || 'No description available',
  }));

  const filteredTickers = enrichedTickers.filter((ticker) =>
    ticker.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticker.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectTicker = (ticker) => {
    setSelectedTicker(ticker.ticker);
    setSelectedDescription(ticker.description); 
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="ticker-dropdown">
      <button className="ticker-dropdown-toggle-btn" onClick={toggleDropdown}>
        <span>{selectedTicker || 'Select Ticker'}</span>
        <i className="fas fa-caret-down"></i>
      </button>
      {isDropdownOpen && (
        <div className="ticker-dropdown-menu">
          <div className="ticker-dropdown-categories">
            <button>All</button>
            <button>Recent</button>
            <button>Positions</button>
            <button>Futures</button>
            <button>Options</button>
            <button>Indices</button>
            <button>Indicators</button>
            <button>FX</button>
            <button>Lookup</button>
            <button>Personal</button>
          </div>
          <input
            type="text"
            className="ticker-search-input"
            placeholder="Search ticker or description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ul className="ticker-dropdown-list">
            <li className="ticker-dropdown-header ticker-dropdown-fixed">
              <span className="ticker-dropdown-symbol-header">Symbol</span>
              <span className="ticker-dropdown-description-header">Description</span>
            </li>
            {filteredTickers.map((ticker, index) => (
              <li
                key={index}
                onClick={() => handleSelectTicker(ticker)} 
              >
                <span>{ticker.ticker}</span>
                <span>{ticker.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TickerDropdown;
