// src/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const API_TOKEN = process.env.REACT_APP_API_TOKEN || "85897900-a108-4c1c-ba14-2cd0a06d1f1e";

export { API_BASE_URL, API_TOKEN }; // Exportar ambas variables
