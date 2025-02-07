import React, { useState, useEffect } from "react";
import { fetchStrikes, fetchExpirationDates } from "../oratsAPI"; // Asegúrate de importar las funciones correctamente.

const StrikesTable = ({ initialTicker = "AAPL" }) => {
  const [strikes, setStrikes] = useState([]);
  const [expirationDates, setExpirationDates] = useState([]);
  const [ticker, setTicker] = useState(initialTicker); // Símbolo por defecto.
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const expirationData = await fetchExpirationDates(ticker);
        setExpirationDates(expirationData);

        const strikesData = await fetchStrikes(ticker);
        setStrikes(strikesData);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    if (ticker) fetchData();
  }, [ticker]);

  const handleTickerChange = (event) => {
    setTicker(event.target.value.toUpperCase());
  };

  return (
    <div>
      <h1>Datos de Strikes para {ticker}</h1>

      <label htmlFor="ticker-input">Ticker:</label>
      <input
        type="text"
        id="ticker-input"
        value={ticker}
        onChange={handleTickerChange}
        style={{ margin: "0.5rem", padding: "0.2rem" }}
      />

      {loading && <p>Cargando datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h2>Fechas de Expiración</h2>
      {expirationDates.length > 0 ? (
        <ul>
          {expirationDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      ) : (
        !loading && <p>No se encontraron fechas de expiración.</p>
      )}

      <h2>Strikes</h2>
      {strikes.length > 0 ? (
        <table border="1" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Strike</th>
              <th>Bid</th>
              <th>Ask</th>
            </tr>
          </thead>
          <tbody>
            {strikes.map((strike, index) => (
              <tr key={index}>
                <td>{strike.strike}</td>
                <td>{strike.bid}</td>
                <td>{strike.ask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No se encontraron strikes.</p>
      )}
    </div>
  );
};

export default StrikesTable;
