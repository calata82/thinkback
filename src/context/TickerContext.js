import React, { createContext, useState } from 'react';

export const TickerContext = createContext();

const TickerProvider = ({ children }) => {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Añadido estado para la fecha

  return (
    <TickerContext.Provider
      value={{
        selectedTicker,
        setSelectedTicker,
        selectedDate, // Exponer selectedDate en el contexto
        setSelectedDate, // Exponer setSelectedDate para poder modificarlo
      }}
    >
      {children}
    </TickerContext.Provider>
  );
};

export default TickerProvider;
