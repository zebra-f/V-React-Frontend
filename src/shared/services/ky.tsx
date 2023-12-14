import ky from "ky";

const apiUrl = import.meta.env.VITE_REACT_API_URL;

const baseBackendApi = ky.create({ prefixUrl: apiUrl });

let backendApi = baseBackendApi.extend({
  headers: {
    authorization: localStorage.getItem("access")
      ? `Bearer ${localStorage.getItem("access")}`
      : undefined,
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      (options) => {
        if ("access" in localStorage) {
          options.headers.set(
            "authorization",
            `Bearer ${localStorage.getItem("access")}`
          );
        }
      },
    ],
    afterResponse: [],
  },
});

// import as kyClient
export default { backendApi };
