import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// import as axiosClient
export default axiosClient;
