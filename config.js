// src/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://thinkback-backend-production.up.railway.app";

const API_TOKEN = process.env.REACT_APP_API_TOKEN || "c554da6b-ad43-421d-894b-5035713aba59";

console.log("🔹 API Base URL:", API_BASE_URL);
console.log("🔹 API Token:", API_TOKEN);


export { API_BASE_URL, API_TOKEN }; // Exportar ambas variables
