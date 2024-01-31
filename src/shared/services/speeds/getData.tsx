import kyClient from "../ky";

import {
  speedInterface,
  responseSpeedDataInterface,
} from "../../interfaces/speedInterfaces";

interface queryParams {
  userName: string | null;
}
async function getSpeeds({ userName }: queryParams, personalList: boolean) {
  try {
    const response = await kyClient.backendApi.get(
      personalList ? "speeds/personal-list/" : `speeds/?`,
    );
    const responseData: responseSpeedDataInterface = await response.json();
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

async function getAndPrepareSpeedsData(
  { userName }: queryParams,
  personalList: boolean,
) {
  const { status, data } = await getSpeeds(
    { userName: userName },
    personalList,
  );
  if (status === 200) {
    const count = data.count;

    let results: Array<speedInterface> = [];
    data.results.forEach((result: any) => {
      // anon user
      if (result.user_speed_bookmark === undefined) {
        result.user_speed_bookmark = null;
      }
      if (result.user_speed_feedback === undefined) {
        result.user_speed_bookmark = null;
      }

      results.push(result);
    });

    return { status, data, count, results };
  } else {
    return { status, data, count: 0, results: [] };
  }
}

export { getSpeeds, getAndPrepareSpeedsData };
