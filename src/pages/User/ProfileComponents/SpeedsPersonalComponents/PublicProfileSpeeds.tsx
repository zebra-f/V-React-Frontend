import { useState, useEffect } from "react";

import { getAndPrepareSpeedsData } from "../../../../shared/services/speeds/getData";
import {
  speedInterface,
  speedQueryParams,
} from "../../../../shared/interfaces/speedInterfaces";

import SpeedsTable from "../../../../shared/components/SpeedTable";

import Container from "@mui/material/Container";

interface props {
  measurementSystem: "metric" | "imperial";
  userName: string;
}
export default function PublicProfileSpeeds({
  measurementSystem,
  userName,
}: props) {
  const [queryParams, setQueryParams] = useState<speedQueryParams>({
    page: 1,
    isPublic: null,
    userName: userName,
    speedType: null,
    speedTags: null,
  });

  const [count, setCount] = useState(0);
  const [results, setResults] = useState<Array<speedInterface>>([]);

  useEffect(() => {
    getAndPrepareSpeedsData(queryParams, false).then((result) => {
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
          measurementSystem={measurementSystem}
          isEditable={false}
        />
      </Container>
    </>
  );
}
