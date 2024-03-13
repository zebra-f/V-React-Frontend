import ky from "ky";

import { clearVeesSpeedData } from "../../utils/localStorage";

const apiUrl = import.meta.env.VITE_REACT_API_URL;
const baseBackendApi = ky.create({ prefixUrl: apiUrl });

interface refreshDataObject {
  access: string;
}
let backendApi = baseBackendApi.extend({
  headers: {
    Accept: "application/json",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      (options) => {
        const access = localStorage.getItem("access");
        if (access) {
          options.headers.set("Authorization", `Bearer ${access}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        let responseData = {};
        // handles `DELETE` method that returns no content
        if (response.status !== 204) {
          responseData = await response.json();
        }

        if (response.status == 401) {
          if (
            "detail" in responseData &&
            (responseData["detail"] === "Token is invalid or expired" ||
              responseData["detail"] === "User not found")
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
  clearVeesSpeedData();
  window.location.replace(window.location.href);
}

const goMeilisearchGatewayUrl = import.meta.env.VITE_GO_MEILISEARCH_GATEWAY_URL;
const goMeilisearchGateway = ky.create({ prefixUrl: goMeilisearchGatewayUrl });

// import as kyClient
export default { backendApi, goMeilisearchGateway };
