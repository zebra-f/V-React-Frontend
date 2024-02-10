import kyClient from "../../shared/services/ky";

interface createFeedbackData {
  speed_id: string & { isUUID: true };
  vote: -1 | 1;
}
async function createFeedback(data: createFeedbackData) {
  try {
    const response: any = await kyClient.backendApi.post(`speeds-feedback/`, {
      json: {
        speed: data.speed_id,
        vote: data.vote,
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

interface updateFeedbackData {
  id: number;
  vote: -1 | 0 | 1;
}
async function updateFeedback(data: updateFeedbackData) {
  try {
    const response: any = await kyClient.backendApi.patch(
      `speeds-feedback/${data.id}/`,
      {
        json: {
          vote: data.vote,
        },
      },
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

export async function makeSpeedFeedback(
  id: null | number,
  speed_id: null | (string & { isUUID: true }),
  vote: -1 | 0 | 1,
  create: boolean,
) {
  // create
  if (create && speed_id && vote !== 0) {
    const { status, data } = await createFeedback({
      speed_id: speed_id,
      vote: vote,
    });
    return { status, data };
    // update
  } else if (!create && id) {
    const { status, data } = await updateFeedback({ id: id, vote: vote });
    return { status, data };
  } else {
    return { status: 500, data: {} };
  }
}
