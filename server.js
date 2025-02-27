// server.js (backend implementation with multiple endpoints)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};


const API_BASE_URL = process.env.API_BASE_URL || "https://api.orats.io/datav2";
console.log("🔹 API_BASE_URL:", API_BASE_URL);
const API_TOKEN = process.env.API_TOKEN || "NO_CARGADO";
app.use(cors({ origin: "*" })); 
app.use(express.json());

// Variables de configuración
console.log("🔹 API_TOKEN:", process.env.REACT_APP_API_TOKEN);
console.log("🔹 API Token cargado:", token ? "Cargado correctamente" : "NO CARGADO");

const BASE_URL = 'https://api.orats.io/datav2';
const OPTIONS_URL = `${BASE_URL}/strikes`;
const HISTORICAL_OPTION_CHAIN_URL = `${BASE_URL}/hist/strikes`; 


// Nuevo endpoint para obtener la cadena de opciones histórica
app.get('/api/getHistoricalOptionChain', async (req, res) => {
  const { ticker, tradeDate } = req.query;

  // Verificar si los parámetros requeridos están presentes
  if (!ticker || !tradeDate) {
    console.warn("Parámetros faltantes:", { ticker, tradeDate });
    return res.status(400).json({ error: 'El parámetro ticker y tradeDate son requeridos' });
  }

  try {
    console.log("Solicitud recibida para obtener cadena de opciones histórica:", { ticker, tradeDate });

    // Realizar la solicitud al endpoint de ORATS
    const response = await axios.get(HISTORICAL_OPTION_CHAIN_URL, {
      params: { token, ticker, tradeDate }
    });

    // Verificar si la respuesta contiene datos válidos
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      console.warn("No se encontraron datos históricos:", { ticker, tradeDate });
      return res.status(404).json({ error: 'No hay datos históricos disponibles para el ticker proporcionado' });
    }

    console.log("Datos recibidos de ORATS:", response.data.data.slice(0, 5)); // Muestra los primeros 5 registros para verificación

    // Transformar y mapear los datos recibidos
    const transformedData = response.data.data.map((option) => ({
      ticker: option.ticker,
      tradeDate: option.tradeDate,
      expirDate: option.expirDate,
      dte: option.dte,
      strike: option.strike,
      stockPrice: option.stockPrice,
      callVolume: option.callVolume,
      callOpenInterest: option.callOpenInterest,
      callBidSize: option.callBidSize,
      callAskSize: option.callAskSize,
      putVolume: option.putVolume,
      putOpenInterest: option.putOpenInterest,
      putBidSize: option.putBidSize,
      putAskSize: option.putAskSize,
      callBidPrice: option.callBidPrice,
      callValue: option.callValue,
      callAskPrice: option.callAskPrice,
      putBidPrice: option.putBidPrice,
      putValue: option.putValue,
      putAskPrice: option.putAskPrice,
      callBidIv: option.callBidIv,
      callMidIv: option.callMidIv,
      callAskIv: option.callAskIv,
      smvVol: option.smvVol,
      putBidIv: option.putBidIv,
      putMidIv: option.putMidIv,
      putAskIv: option.putAskIv,
      residualRate: option.residualRate,
      delta: option.delta,
      gamma: option.gamma,
      theta: option.theta,
      vega: option.vega,
      rho: option.rho,
      phi: option.phi,
      driftlessTheta: option.driftlessTheta,
      extSmvVol: option.extSmvVol,
      extCallValue: option.extCallValue,
      extPutValue: option.extPutValue,
      spotPrice: option.spotPrice,
      updatedAt: option.updatedAt,
    }));

    // Enviar los datos transformados al frontend
    res.json({ data: transformedData });
  } catch (error) {
    console.error('Error al obtener la cadena de opciones histórica:', error.message);
    res.status(500).json({
      error: 'Error al obtener la cadena de opciones histórica',
      details: error.response?.data || error.message,
    });
  }
});





// Endpoint para datos históricos de precios
app.get('/api/getTickerData', async (req, res) => {
  const { ticker, tradeDate } = req.query;

  if (!ticker || !tradeDate) {
    return res.status(400).json({ error: 'Parámetros ticker y tradeDate son requeridos' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/hist/dailies`, {
      params: { token, ticker, tradeDate }
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ error: 'Datos no encontrados para el ticker proporcionado' });
    }

    res.json(response.data.data[0]); // Envía el primer resultado
  } catch (error) {
    console.error('Error al obtener datos históricos:', error.message);
    res.status(500).json({ error: 'Error al obtener datos históricos', details: error.message });
  }
});

// Endpoint para obtener fechas de expiración
app.get('/api/getExpirations', async (req, res) => {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'El parámetro ticker es requerido' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { token, ticker }
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.json({ expirationDates: [] });
    }

    const expirationDates = response.data.data.map((item) => item.expirDate).filter(Boolean);
    res.json({ expirationDates });
  } catch (error) {
    console.error('Error al obtener fechas de expiración:', error.message);
    res.status(500).json({ error: 'Error al obtener fechas de expiración.', details: error.message });
  }
});

setInterval(() => {
  console.log("Servidor activo en Railway...");
}, 60000); // Muestra un mensaje cada 60 segundos para evitar que Railway lo detenga


// Iniciar servidor
app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});

