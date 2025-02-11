import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MainDataTable from './MainDataTable'; 
import OptionChainHeader from './OptionChainHeader'; 
import UnderlyingData from './UnderlyingData'; 
import Backtrades from './Backtrades';
import { API_BASE_URL, API_TOKEN } from '../config'; 
import { TickerContext } from '../context/TickerContext'; 
import './OptionsTable.css';

const OptionsTable = () => {
  const { selectedTicker, selectedDate } = useContext(TickerContext); 
  const [isUnderlyingExpanded, setIsUnderlyingExpanded] = useState(true);
  const [isOptionChainExpanded, setIsOptionChainExpanded] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [strikesToShow, setStrikesToShow] = useState(4);
  const [hoverData, setHoverData] = useState(null);
  const [selectedMetricCalls, setSelectedMetricCalls] = useState('extrinsic');
  const [selectedMetricPuts, setSelectedMetricPuts] = useState('extrinsic');
  const [underlyingData, setUnderlyingData] = useState(null);
  const [optionChain, setOptionChain] = useState([]);
  const [backtrades, setBacktrades] = useState([]); 

  // Función para obtener la cadena de opciones históricas
  const fetchHistoricalOptionChain = async (ticker, date) => {
    if (!ticker || !date) {
      console.warn("Ticker o fecha no proporcionados");
      return;
    }
  
    console.log(`Solicitando datos históricos para ticker: ${ticker}, fecha: ${date}`);
  
    try {
      const { data } = await axios.get("${API_BASE_URL}/api/getHistoricalOptionChain", {
        params: {
          ticker,
          tradeDate: date,
        },
      });
  
      if (data && data.data) {
        const today = new Date(); 
        const filteredData = data.data.filter((option) => {
          const expirDate = new Date(option.expirDate);
          return expirDate <= today;
        });
  
        console.log("Datos históricos filtrados:", filteredData);
        setOptionChain(filteredData); 
      } else {
        console.warn("No se encontraron datos históricos válidos.");
        setOptionChain([]);
      }
    } catch (error) {
      console.error("Error en fetchHistoricalOptionChain:", error.message);
      setOptionChain([]);
    }
  };
  

  useEffect(() => {
    console.log("Backtrades actualizados:", backtrades);
  }, [backtrades]);
  
  const [backtradesDate, setBacktradesDate] = useState(new Date());


  // Función para obtener datos de Underlying
 // Función para obtener datos de Underlying
const fetchUnderlyingData = async (ticker, date) => {
  if (!ticker || !date) {
    console.warn("Ticker o fecha no proporcionados");
    return;
  }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/getTickerData`, {
      params: {
        ticker,
        tradeDate: date,
      },
    });

    if (data) {
      const { clsPx, hiPx, loPx, open, stockVolume } = data;
      setUnderlyingData({
        last: clsPx || "N/A",
        netChng: clsPx && open ? (clsPx - open).toFixed(2) : "N/A",
        volume: stockVolume || "N/A",
        open: open || "N/A",
        high: hiPx || "N/A",
        low: loPx || "N/A",
      });
    } else {
      setUnderlyingData(null);
    }
  } catch (error) {
    console.error("Error en fetchUnderlyingData:", error.message);
    setUnderlyingData(null);
  }
};

  // useEffect para cargar datos históricos al cambiar el ticker o la fecha
  useEffect(() => {
    if (selectedTicker && selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        fetchHistoricalOptionChain(selectedTicker, formattedDate);
        fetchUnderlyingData(selectedTicker, formattedDate);
    }
}, [selectedTicker, selectedDate]); 

  const addToBacktrades = (contract) => {
    setBacktrades((prevBacktrades) => [
      ...prevBacktrades,
      {
        ...contract,
        strike: contract.strike,
        type: contract.type,
      },
    ]);
  };
  
  const getCurrentPrice = (ticker, date) => {
    if (!ticker || !date) {
        console.warn("getCurrentPrice: Ticker o fecha no proporcionados.");
        return null;
    }

    const option = optionChain.find(
        (opt) => opt.ticker === ticker && opt.tradeDate === date.toISOString().split('T')[0]
    );

    if (!option) {
        console.warn(`Ticker ${ticker} con fecha ${date.toISOString().split('T')[0]} no encontrado en Option Chain.`);
        return null;
    }

    return option.spotPrice; 
};




const [optionChainSelection, setOptionChainSelection] = useState(null);


  // Lógica para alternar la visibilidad de las secciones
  const toggleUnderlying = () => {
    setIsUnderlyingExpanded(!isUnderlyingExpanded);
    if (isUnderlyingExpanded && isOptionChainExpanded) {
      setIsOptionChainExpanded(false);
    }
  };

  const toggleOptionChain = () => {
    setIsOptionChainExpanded(!isOptionChainExpanded);
  };

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleStrikeChange = (event) => {
    setStrikesToShow(event.target.value === 'All' ? optionChain.length : parseInt(event.target.value, 10));
  };

  const handleMouseOver = (event, data) => {
    const tooltipX = event.clientX + 15;
    const tooltipY = event.clientY - 20;
    setHoverData({ ...data, x: tooltipX, y: tooltipY });
  };

  const handleMouseOut = () => {
    setHoverData(null);
  };

  const handleMetricChange = (event, isCalls) => {
    const selectedMetric = event.target.value;
    if (isCalls) {
      setSelectedMetricCalls(selectedMetric);
    } else {
      setSelectedMetricPuts(selectedMetric);
    }
  };

  // Debugging para validar los datos antes de enviarlos a MainDataTable
  useEffect(() => {
    console.log("Datos actuales en optionChain:", optionChain);
  }, [optionChain]);

  return (
    <section className="tabla-opciones">
      {/* Sección Underlying */}
      <UnderlyingData
        isExpanded={isUnderlyingExpanded}
        toggle={toggleUnderlying} 
        data={underlyingData || { last: 'No data', netChng: 'N/A', volume: 'N/A', open: 'N/A', high: 'N/A', low: 'N/A' }}
      />

      {/* Encabezado Option Chain */}
      <OptionChainHeader
        isExpanded={isOptionChainExpanded}
        toggle={toggleOptionChain}
      />

      {/* Tabla de datos principales */}
      {isOptionChainExpanded && (
        <MainDataTable
          data={optionChain}
          isExpanded={isOptionChainExpanded}
          toggleRow={toggleRow}
          expandedRow={expandedRow}
          strikesToShow={strikesToShow}
          handleStrikeChange={handleStrikeChange}
          optionChain={optionChain}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          selectedMetricCalls={selectedMetricCalls}
          handleMetricChange={handleMetricChange}
          selectedMetricPuts={selectedMetricPuts}
          addToBacktrades={addToBacktrades} 
          setOptionChainSelection={setOptionChainSelection} 
        />
      )}

      {/* Renderizar tabla Backtrades */}
      {/* Renderizar tabla Backtrades */}
      <Backtrades
          backtrades={backtrades}
          setBacktrades={setBacktrades}
          getCurrentPrice={(ticker) => getCurrentPrice(ticker, backtradesDate)} // Ahora tiene acceso a la fecha
          optionChainSelection={optionChainSelection}
          backtradesDate={backtradesDate} // Pasamos la fecha a Backtrades
          setBacktradesDate={setBacktradesDate} // Pasamos la función para actualizarla
      />




    

    </section>
  );
};

export default OptionsTable;
