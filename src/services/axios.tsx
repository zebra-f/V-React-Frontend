import axios from "axios";

console.log("I'm here");
const apiUrl = import.meta.env.VITE_REACT_API_URL;
const authApiUrl = import.meta.env.VITE_REACT_API_AUTH_URL;
console.log(apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
const authApi = axios.create({
  baseURL: authApiUrl,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// import as axiosClient
export default { api, authApi };
