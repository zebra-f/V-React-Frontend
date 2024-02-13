import kyClient from "../ky";

import {
  speedInterface,
  responseSpeedDataInterface,
  speedQueryParams,
} from "../../interfaces/speedInterfaces";

async function getSpeeds(
  { page = 1, isPublic, userName, speedType, speedTags }: speedQueryParams,
  personalList: boolean,
) {
  let params = [`page=${page}`];
  if (isPublic !== null) {
    params.push(`is_public=${isPublic.toString()}`);
  }
  if (userName) {
    params.push(`user=${userName}`);
  }
  if (speedType) {
    params.push(`speed_type=${speedType}`);
  }
  if (speedTags && speedTags.length > 0) {
    params.push(`tags=${speedTags.join(",")}`);
  }

  try {
    const response = await kyClient.backendApi.get(
      personalList
        ? `speeds/personal-list/?${params.join("&")}`
        : `speeds/?${params.join("&")}`,
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
  { page, isPublic, userName, speedType, speedTags }: speedQueryParams,
  personalList: boolean,
) {
  const { status, data } = await getSpeeds(
    { page, isPublic, userName, speedType, speedTags },
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

async function getSpeed(id: string) {
  try {
    const response = await kyClient.backendApi.get(`speeds/${id}/`);
    const responseData = await response.json();
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

export { getSpeeds, getAndPrepareSpeedsData, getSpeed };
