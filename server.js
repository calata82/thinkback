// server.js (backend implementation with multiple endpoints)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 8080;
require('dotenv').config();

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Proxy para frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Variables de configuración
const token = process.env.API_TOKEN;
const BASE_URL = 'https://api.orats.io/datav2';
const OPTIONS_URL = 'https://api.orats.io/datav2/strikes';

// Endpoint para obtener la cadena de opciones (Option Chain)
app.get('/api/getOptionChain', async (req, res) => {
  const { ticker, tradeDate } = req.query;

  if (!ticker || !tradeDate) {
    return res.status(400).json({ error: 'El parámetro ticker y tradeDate son requeridos' });
  }

  try {
    const response = await axios.get(`${OPTIONS_URL}`, {
      params: { token, ticker }
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ error: 'No hay datos disponibles para el ticker proporcionado' });
    }

    // Transformar datos para enviarlos al frontend
    const transformedData = response.data.data.map((option) => ({
      expirationDate: option.expirDate,
      strike: option.strike,
      callBid: option.callBidPrice || '-',
      callAsk: option.callAskPrice || '-',
      putBid: option.putBidPrice || '-',
      putAsk: option.putAskPrice || '-',
    }));

    res.json({ data: transformedData });
  } catch (error) {
    console.error('Error al obtener Option Chain:', error.message);
    res.status(500).json({ error: 'Error al obtener Option Chain', details: error.message });
  }
});

// Endpoint para datos históricos de precios
app.get('/api/getTickerData', async (req, res) => {
  const { ticker, tradeDate } = req.query;

  if (!ticker || !tradeDate) {
    return res.status(400).json({ error: 'Parámetros ticker y tradeDate son requeridos' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/hist/dailies`, {
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
    const response = await axios.get(`${OPTIONS_URL}`, {
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

// Iniciar servidor
app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});
