import kyClient from "../../shared/services/ky";

interface createFeedbackData {
  speed_id: string & { isUUID: true };
  category: string | null;
}
async function createBookmark(data: createFeedbackData) {
  try {
    const response: any = await kyClient.backendApi.post(`speeds-bookmark/`, {
      json: data.category
        ? {
            speed: data.speed_id,
            category: data.category,
          }
        : {
            speed: data.speed_id,
          },
    });
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

interface deleteBookmarkData {
  id: number;
}
async function deleteBookmark(data: deleteBookmarkData) {
  try {
    const response = await kyClient.backendApi.delete(
      `speeds-bookmark/${data.id}/`,
      {
        retry: { limit: 0 },
      },
    );
    const responseData = {};
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: 401, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}

export async function createSpeedBookmark(
  speed_id: string & { isUUID: true },
  category: null | string,
) {
  const { status, data } = await createBookmark({
    speed_id: speed_id,
    category: category,
  });
  return { status, data };
}

export async function deleteSpeedBookmark(id: number) {
  const { status, data } = await deleteBookmark({
    id: id,
  });
  return { status, data}
}
