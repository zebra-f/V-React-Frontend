import ky from "ky";

const apiUrl = import.meta.env.VITE_REACT_API_URL;

const baseBackendApi = ky.create({ prefixUrl: apiUrl });

interface refreshDataObject {
  access: string;
}
let backendApi = baseBackendApi.extend({
  credentials: "include",
  hooks: {
    beforeRequest: [
      (options) => {
        const access = localStorage.getItem("access");
        if (access) {
          options.headers.set("authorization", `Bearer ${access}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        const responseData = await response.json();

        if (response.status == 401) {
          if (
            "detail" in responseData &&
            responseData["detail"] === "Token is invalid or expired"
          ) {
            forceSignOut();
          } else if (
            localStorage.getItem("isAuthenticated") === "true" &&
            localStorage.getItem("access")
          ) {
            try {
              const refreshData: refreshDataObject = await backendApi
                .post("token/refresh/")
                .json();

              if ("access" in refreshData) {
                localStorage.setItem("access", refreshData.access);
                return backendApi(request);
              } else {
                forceSignOut();
              }
            } catch (error) {
              forceSignOut();
            }
          }
        }

        if (response.status == 404) {
          if (
            "detail" in responseData &&
            responseData["detail"] ===
              "No valid refresh token has been found in cookies."
          ) {
            forceSignOut();
          }
        }
      },
    ],
  },
});

function forceSignOut() {
  localStorage.setItem("isAuthenticated", "false");
  localStorage.removeItem("access");
  window.location.replace(window.location.href);
}

// import as kyClient
export default { backendApi };
