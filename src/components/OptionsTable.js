import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MainDataTable from './MainDataTable'; 
import OptionChainHeader from './OptionChainHeader'; 
import UnderlyingData from './UnderlyingData'; 
import { TickerContext } from '../context/TickerContext'; 
import './OptionsTable.css';

  
  const OptionsTable = () => {
  const { selectedTicker } = useContext(TickerContext); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isUnderlyingExpanded, setIsUnderlyingExpanded] = useState(true);
  const [isOptionChainExpanded, setIsOptionChainExpanded] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [strikesToShow, setStrikesToShow] = useState(4);
  const [hoverData, setHoverData] = useState(null);
  const [selectedMetricCalls, setSelectedMetricCalls] = useState('extrinsic');
  const [selectedMetricPuts, setSelectedMetricPuts] = useState('extrinsic');
  const [underlyingData, setUnderlyingData] = useState(null);


  const data = [
    { date: '8 JAN 21', weekly: true, netChng: '+2.34', volume: '14,016,045', open: '524.17', high: '546.0999', low: '518.50' },
    { date: '15 JAN 21', weekly: true, netChng: '+1.12', volume: '12,456,789', open: '523.45', high: '545.00', low: '519.00' },
  ];
  const [optionChain, setOptionChain] = useState([]);

  useEffect(() => {
    const fetchOptionChain = async () => {
      if (!selectedTicker || !selectedDate) return;
  
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(
          `http://localhost:5000/api/getOptionChain`,
          {
            params: { ticker: selectedTicker, tradeDate: formattedDate },
          }
        );
  
        if (response.data && response.data.data) {
          setOptionChain(response.data.data);
        } else {
          setOptionChain([]);
        }
      } catch (error) {
        console.error('Error al obtener Option Chain:', error);
      }
    };
  
    fetchOptionChain();
  }, [selectedTicker, selectedDate]);
  

  useEffect(() => {
    console.log('Estado actual de underlyingData:', underlyingData);
    const fetchUnderlyingData = async () => {
      if (selectedTicker && selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await axios.get(
            `http://localhost:5000/api/getTickerData`,
            {
              params: {
                ticker: selectedTicker,
                tradeDate: formattedDate,
              },
            }
          );
          if (response.data) {
            const { clsPx, hiPx, loPx, open, stockVolume } = response.data;
            setUnderlyingData({
              last: clsPx || 'N/A',
              netChng: clsPx && open ? (clsPx - open).toFixed(2) : 'N/A',
              volume: stockVolume || 'N/A',
              open: open || 'N/A',
              high: hiPx || 'N/A',
              low: loPx || 'N/A',
            });
          } else {
            setUnderlyingData(null);
          }
        } catch (error) {
          console.error('Error en fetchUnderlyingData:', error);
          setUnderlyingData(null);
        }
      }
    };
    fetchUnderlyingData();
  }, [selectedTicker, selectedDate]);
  
  

  


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

  return (
    <section className="tabla-opciones">
      {/* Sección Underlying */}
      <UnderlyingData
        isExpanded={isUnderlyingExpanded}
        toggle={toggleUnderlying} // Sincroniza el toggle
        data={underlyingData || { last: 'No data', netChng: 'N/A', volume: 'N/A', open: 'N/A', high: 'N/A', low: 'N/A' }}
      />

      {/* Encabezado Option Chain */}
      <OptionChainHeader
        isExpanded={isOptionChainExpanded}
        toggle={() => setIsOptionChainExpanded(!isOptionChainExpanded)}
      />
  
      {/* Tabla de datos principales */}
      {isOptionChainExpanded && (
        <MainDataTable
          data={data}
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
        />
      )}
    </section>
  );
};
  export default OptionsTable;
  
