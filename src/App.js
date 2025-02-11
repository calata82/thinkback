import React, { useEffect, useState, useContext } from 'react';
import TickerProvider, { TickerContext } from './context/TickerContext';
import NavBar from './components/NavBar';
import TickerSelection from './components/TickerSelection';
import OptionsTable from './components/OptionsTable';
import PLGraph from './components/PLGraph'; 
import { API_BASE_URL, API_TOKEN } from './config'; 

import { fetchTickers } from './oratsAPI';

import './App.css';

function App() {
  const { selectedTicker, setSelectedTicker } = useContext(TickerContext);
  const [tickers, setTickers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tickerPrice, setTickerPrice] = useState(null);
  

  useEffect(() => {
    // Obtener la lista de tickers al cargar la aplicación
    const getTickers = async () => {
      try {
        const tickersData = await fetchTickers();
        console.log('Primer ticker obtenido:', tickersData[0]);
        setTickers(tickersData);
      } catch (error) {
        console.error('Error al obtener los tickers:', error);
      }
    };

    getTickers();
  }, []);

  useEffect(() => {
    const getTickerPrice = async () => {
      if (selectedTicker && selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0]; 
          const response = await fetch(`${API_BASE_URL}/api/getTickerData?ticker=${selectedTicker}&tradeDate=${formattedDate}`);

          const data = await response.json();
          if (data && data.length > 0) {
            setTickerPrice(data[0].clspx); 
          } else {
            setTickerPrice('No data available');
          }
        } catch (error) {
          console.error('Error al obtener el precio del ticker:', error);
          setTickerPrice('Error');
        }
      }
    };

    getTickerPrice();
  }, [selectedTicker, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTickerChange = (ticker) => {
    setSelectedTicker(ticker);
  };

  return (
    <TickerProvider>
      <div className="project-container">
        <NavBar />
        <div className="main-content">
          <TickerSelection
            tickers={tickers}
            onTickerChange={handleTickerChange}
            selectedTicker={selectedTicker}
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
            tickerPrice={tickerPrice}
          />
          <div className="bottom-section">
            <div className="section options-section">
              <OptionsTable selectedTicker={selectedTicker} />
            </div>
            {/* Eliminada la instancia duplicada de Backtrades */}
            <div className="section plgraph-section">
              <PLGraph selectedTicker={selectedTicker} />
            </div>
          </div>
        </div>
      </div>
    </TickerProvider>
  );
}

export default App;

