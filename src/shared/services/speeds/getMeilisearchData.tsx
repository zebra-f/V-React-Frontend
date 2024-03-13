import kyClient from "../ky";

import { speedInterface } from "../../interfaces/speedInterfaces";

async function getMeilisearchSpeeds(q: string) {
  try {
    const response = await kyClient.goMeilisearchGateway.get(
      `meilisearch/?q=${q}`,
    );
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

async function getAndPrepareMeilisearchSpeedsData(q: string) {
  const { status, data } = await getMeilisearchSpeeds(q);
  if (status === 200) {
    const count = data.count;

    let results: Array<speedInterface> = [];
    data.hits.forEach((result: any) => {
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

export { getMeilisearchSpeeds, getAndPrepareMeilisearchSpeedsData };
