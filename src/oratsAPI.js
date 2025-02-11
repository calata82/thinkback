// oratsAPI.js
import axios from 'axios';
import { API_TOKEN } from './config';

const BASE_URL = 'https://api.orats.io/datav2';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Fetch strikes for a specific ticker
export const fetchStrikes = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/live/strikes`, {
      params: { token: API_TOKEN, ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener strikes:', error);
    throw error;
  }
};

// Fetch expiration dates for options of a specific ticker
export const fetchExpirationDates = async (ticker) => {
  try {
    const response = await axios.get(`${BASE_URL}/options/expirations`, {
      params: { token: API_TOKEN, ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las fechas de expiración:', error);
    throw error;
  }
};

// Fetch tickers from API
export const fetchTickers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickers`, {
      params: { token: API_TOKEN },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los tickers:', error);
    return [];
  }
};
