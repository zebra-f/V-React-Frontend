import { useEffect, useState } from "react";

import {
  speedInterface,
  speedQueryParams,
  userSpeedFeedbackInterface,
} from "../../../../shared/interfaces/speedInterfaces";

import kyClient from "../../../../shared/services/ky";

import SpeedsTable from "../../../../shared/components/SpeedsTable";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

interface feedbackQueryParams {
  page: number;
  vote: -1 | 0 | 1 | "";
}
async function getFeedbacks({ page = 1, vote }: feedbackQueryParams) {
  try {
    let url = `speeds-feedback/?page=${page}`;
    if (vote) {
      url += `&vote=${vote}`;
    }

    const response = await kyClient.backendApi.get(url);
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

async function getAndPrepareFeedbackData({
  page = 1,
  vote,
}: feedbackQueryParams) {
  const { status, data } = await getFeedbacks({ page, vote });

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

  const [vote, setVote] = useState<-1 | 0 | 1 | "">("");
  useEffect(() => {
    getAndPrepareFeedbackData({ page: queryParams.page, vote: vote }).then(
      (result) => {
        if (result.status === 200) {
          setCount(result.count);
          setResults(result.results);
        }
      },
    );
  }, [queryParams, vote]);

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <FormControl>
            <RadioGroup
              aria-labelledby="vote-radio-group"
              value={vote}
              name="vote-radio-group"
              row
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="upvotes"
                onClick={() => {
                  setVote(1);
                  setQueryParams((prevState) => {
                    return { ...prevState, page: 1 };
                  });
                }}
              />
              <FormControlLabel
                value={""}
                control={<Radio />}
                label="all"
                onClick={() => {
                  setVote("");
                  setQueryParams((prevState) => {
                    return { ...prevState, page: 1 };
                  });
                }}
              />
              <FormControlLabel
                value={-1}
                control={<Radio />}
                label="downvotes"
                onClick={() => {
                  setVote(-1);
                  setQueryParams((prevState) => {
                    return { ...prevState, page: 1 };
                  });
                }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <SpeedsTable
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          results={results}
          setResults={setResults}
          count={count}
          setCount={setCount}
          isEditable={false}
          rowType={"feedback"}
        />
      </Container>
    </>
  );
}
