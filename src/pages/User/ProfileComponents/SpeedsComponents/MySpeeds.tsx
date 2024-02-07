import { useEffect, useState } from "react";

import { getAndPrepareSpeedsData } from "../../../../shared/services/speeds/getData";
import {
  speedInterface,
  speedQueryParams,
} from "../../../../shared/interfaces/speedInterfaces";

import AddSpeedForm from "../../../../shared/components/AddSpeedForm";
import SpeedsTable from "../../../../shared/components/SpeedTable";

import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

interface props {
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
}
export default function MySpeeds({
  measurementSystem,
  setMeasurementSystem,
}: props) {
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

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="success" onClick={handleAddSpeed}>
            ADD MORE SPEEDS &nbsp;&nbsp; <CloudUploadIcon />
          </Button>
          <AddSpeedForm
            measurementSystem={measurementSystem}
            setMeasurementSystem={setMeasurementSystem}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            speedData={null}
          />
        </Box>
        <SpeedsTable
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          results={results}
          count={count}
          measurementSystem={measurementSystem}
          isEditable={true}
          rowType={"regular"}
        />
      </Container>
    </>
  );
}
