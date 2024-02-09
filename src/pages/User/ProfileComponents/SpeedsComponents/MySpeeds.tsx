import { useEffect, useState, useRef } from "react";

import { getAndPrepareSpeedsData } from "../../../../shared/services/speeds/getData";
import {
  speedInterface,
  speedQueryParams,
} from "../../../../shared/interfaces/speedInterfaces";

import SpeedForm from "../../../../shared/components/SpeedForm";
import SpeedsTable from "../../../../shared/components/SpeedTable";

import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function MySpeeds() {
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
    getAndPrepareSpeedsData(queryParams, true).then((result) => {
      if (result.status === 200) {
        setCount(result.count);
        setResults(result.results);
      }
    });
  }, [queryParams]);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const handleAddSpeed = () => {
    setFormOpen(true);
  };
  const [speedFormResponseData, setSpeedFormResponseData] =
    useState<speedInterface | null>(null);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (speedFormResponseData !== null) {
      setResults((prevState) => {
        return [speedFormResponseData, ...prevState];
      });
      setCount((prevState) => prevState + 1);
    }
  }, [speedFormResponseData]);

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="success" onClick={handleAddSpeed}>
            ADD MORE SPEEDS &nbsp;&nbsp; <CloudUploadIcon />
          </Button>
          {formOpen && (
            <SpeedForm
              formOpen={formOpen}
              setFormOpen={setFormOpen}
              speedData={null}
              setSpeedFormResponseData={setSpeedFormResponseData}
            />
          )}
        </Box>

        <SpeedsTable
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          results={results}
          count={count}
          isEditable={true}
          rowType={"regular"}
        />
      </Container>
    </>
  );
}
