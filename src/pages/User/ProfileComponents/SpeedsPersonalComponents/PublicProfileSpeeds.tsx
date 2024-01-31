import { useState, useEffect } from "react";

import { getAndPrepareSpeedsData } from "../../../../shared/services/speeds/getData";
import { speedInterface } from "../../../../shared/interfaces/speedInterfaces";

import SpeedsTable from "../../../../shared/components/SpeedTable";

import Container from "@mui/material/Container";

interface props {
  measurementSystem: "metric" | "imperial";
}
export default function PublicProfileSpeeds({ measurementSystem }: props) {
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [results, setResults] = useState<Array<speedInterface>>([]);

  useEffect(() => {
    getAndPrepareSpeedsData({ userName: null }, false).then((result) => {
      if (result.status === 200) {
        setCount(result.count);
        setResults(result.results);
      }
    });
  }, [page]);

  return (
    <>
      <Container>
        <h2>Public Profile Speeds</h2>
        <SpeedsTable
          page={page}
          setPage={setPage}
          results={results}
          count={count}
          measurementSystem={measurementSystem}
          isEditable={false}
        />
      </Container>
    </>
  );
}
