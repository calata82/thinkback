import React, { createContext, useState } from 'react';

export const TickerContext = createContext();

const TickerProvider = ({ children }) => {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  return (
    <TickerContext.Provider
      value={{
        selectedTicker,
        setSelectedTicker,
        selectedDescription,
        setSelectedDescription, 
        selectedDate, 
        setSelectedDate, 
      }}
    >
      {children}
    </TickerContext.Provider>
  );
};

export default TickerProvider;
