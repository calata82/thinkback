import React, { useContext, useEffect, useState } from 'react';
import { TickerContext } from '../context/TickerContext';


const TickerInfo = () => {
  const { selectedTicker } = useContext(TickerContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tickerPrice, setTickerPrice] = useState(null);

  useEffect(() => {
    // Obtener el precio del ticker seleccionado para la fecha seleccionada
    const getTickerPrice = async () => {
      if (selectedTicker && selectedDate) {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0]; 
          const response = await fetch(
            `https://api.orats.io/datav2/hist/dailies?token=your-secret-token&ticker=${selectedTicker}&tradeDate=${formattedDate}`
          );
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setTickerPrice(data.data[0].clspx); 
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

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  return (
    <div>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={handleDateChange}
      />
      <div className="ticker-price">
        <span>Precio de cierre: {tickerPrice ? tickerPrice : 'Selecciona un ticker y una fecha'}</span>
      </div>
    </div>
  );
};

export default TickerInfo;
