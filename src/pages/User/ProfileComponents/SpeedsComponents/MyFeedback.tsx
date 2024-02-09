import { useEffect, useState } from "react";

import {
  speedInterface,
  speedQueryParams,
  userSpeedFeedbackInterface,
} from "../../../../shared/interfaces/speedInterfaces";

import kyClient from "../../../../shared/services/ky";

import SpeedsTable from "../../../../shared/components/SpeedTable";

import Container from "@mui/material/Container";

interface feedbackQueryParams {
  page: number;
}
async function getFeedbacks({ page = 1 }: feedbackQueryParams) {
  try {
    const response = await kyClient.backendApi.get(
      `speeds-feedback/?page=${page}`,
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

async function getAndPrepareFeedbackData({ page = 1 }: feedbackQueryParams) {
  const { status, data } = await getFeedbacks({ page });

  if (status == 200) {
    const count = data.count;

    let results: Array<speedInterface> = [];
    data.results.forEach((result: any) => {
      let tempResult = result.speed;
      let feedback: userSpeedFeedbackInterface = {
        feedback_id: result.id,
        feedback_vote: result.vote,
      };
      tempResult["user_speed_feedback"] = feedback;
      tempResult["user_speed_bookmark"] = null;

      results.push(tempResult);
    });

    return { status, data, count, results };
  } else {
    return { status, data, count: 0, results: [] };
  }
}

export default function MySpeedFeedback() {
  const [queryParams, setQueryParams] = useState<speedQueryParams>({
    page: 1,
    isPublic: null,
    userName: null,
    speedType: null,
    speedTags: null,
  });

  const [count, setCount] = useState(0);
  const [results, setResults] = useState<Array<speedInterface>>([]);

  useEffect(() => {
    getAndPrepareFeedbackData(queryParams).then((result) => {
      if (result.status === 200) {
        setCount(result.count);
        setResults(result.results);
      }
    });
  }, [queryParams]);

  return (
    <>
      <Container>
        <SpeedsTable
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          results={results}
          count={count}
          isEditable={false}
          rowType={"feedback"}
        />
      </Container>
    </>
  );
}
