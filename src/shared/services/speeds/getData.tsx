import kyClient from "../ky";

interface queryParams {
  userName: string | null;
}
async function getSpeeds({ userName }: queryParams, personalList: boolean) {
  try {
    const response = await kyClient.backendApi.get(
      personalList ? "speeds/personal-list/" : `speeds/?`,
    );
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.resonse;
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}

export { getSpeeds };
