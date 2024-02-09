import { useEffect, useState } from "react";

import {
  speedInterface,
  speedQueryParams,
  userSpeedBookmarkInterface,
} from "../../../../shared/interfaces/speedInterfaces";

import kyClient from "../../../../shared/services/ky";

import SpeedsTable from "../../../../shared/components/SpeedsTable";

import Container from "@mui/material/Container";

interface feedbackQueryParams {
  page: number;
}
async function getBookmarks({ page = 1 }: feedbackQueryParams) {
  try {
    const response = await kyClient.backendApi.get(
      `speeds-bookmark/?page=${page}`,
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

async function getAndPrepareBookmarkData({ page = 1 }: feedbackQueryParams) {
  const { status, data } = await getBookmarks({ page });

  if (status == 200) {
    const count = data.count;

    let results: Array<speedInterface> = [];
    data.results.forEach((result: any) => {
      let tempResult = result.speed;
      let bookmark: userSpeedBookmarkInterface = {
        bookmark_id: result.id,
        bookmar_category: result.category,
      };
      tempResult["user_speed_feedback"] = null;
      tempResult["user_speed_bookmark"] = bookmark;

      results.push(tempResult);
    });

    return { status, data, count, results };
  } else {
    return { status, data, count: 0, results: [] };
  }
}

export default function MySpeedBookmarks() {
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
    getAndPrepareBookmarkData(queryParams).then((result) => {
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
          setResults={setResults}
          count={count}
          setCount={setCount}
          isEditable={false}
          rowType={"bookmark"}
        />
      </Container>
    </>
  );
}
