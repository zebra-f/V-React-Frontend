import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { getAndPrepareSpeedsData } from "../../shared/services/speeds/getData";
import {
  speedInterface,
  speedQueryParams,
} from "../../shared/interfaces/speedInterfaces";

import SpeedsTable from "../../shared/components/SpeedsTable";

import Container from "@mui/material/Container";

export default function SpeedsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

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
          setResults={setResults}
          count={count}
          setCount={setCount}
          isEditable={false}
          rowType={"regular"}
        />
      </Container>
    </>
  );
}
