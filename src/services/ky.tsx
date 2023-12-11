import ky from "ky";

const apiUrl = import.meta.env.VITE_REACT_API_URL;

const baseBackendApi = ky.create({ prefixUrl: apiUrl });

const backendApi = baseBackendApi.extend({
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 403) {
          const token = await ky("https://example.com/token").text();

          request.headers.set("Authorization", `token ${token}`);

          return ky(request);
        }
      },
    ],
  },
});

export default { backendApi };
