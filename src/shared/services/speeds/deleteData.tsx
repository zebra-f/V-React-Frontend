import kyClient from "../ky";

interface dataInterface {
  id: string & { isUUID: true };
}
async function deleteSpeed(data: dataInterface) {
  try {
    const response = await kyClient.backendApi.delete(`speeds/${data.id}/`, {
      retry: { limit: 0 },
    });
    const responseData = {};
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}

export { deleteSpeed };
