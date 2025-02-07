// oratsAPI.js
import React, { useEffect, useState } from 'react';
import { fetchStrikes, fetchExpirationDates } from '../oratsAPI';


const StrikesTable = ({ ticker }) => {
  const [strikes, setStrikes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStrikes = async () => {
      try {
        const data = await fetchStrikes(ticker);
        setStrikes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getStrikes();
  }, [ticker]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Strikes for {ticker}</h2>
      <ul>
        {strikes.map((strike, index) => (
          <li key={index}>{strike}</li>
        ))}
      </ul>
    </div>
  );
};


export const fetchExpirationDates = async (ticker) => {
  try {
    const response = await axios.get(`${BASE_URL}/expiration-dates`, {
      params: { token: API_TOKEN, ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las fechas de expiración:', error);
    throw error;
  }
};


export default StrikesTable;
