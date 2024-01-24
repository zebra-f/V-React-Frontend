import { useParams } from "react-router-dom";

import SpeedTable from "../../../shared/components/SpeedTable";

import Container from "@mui/material/Container";

interface props {
  measurementSystem: "metric" | "imperial";
}
export default function Speeds({ measurementSystem }: props) {
  const { userName } = useParams();
  console.log("Speeds userName", userName);
  return (
    <>
      <Container>
        <h1>Speeds Placeholder {measurementSystem}</h1>
        <SpeedTable />
      </Container>
    </>
  );
}
