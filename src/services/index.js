import axios from "axios";

const api = axios.create({
  // URL do backend (via ngrok)
  baseURL: "https://reassign-bonsai-trance.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // precisa estar aqui
  },
});

export default api;