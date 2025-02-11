// src/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const API_TOKEN = process.env.REACT_APP_API_TOKEN || "c554da6b-ad43-421d-894b-5035713aba59";

export { API_BASE_URL, API_TOKEN }; // Exportar ambas variables
