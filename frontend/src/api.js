// API base URL — reads from env on Render, defaults to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default API_BASE;
