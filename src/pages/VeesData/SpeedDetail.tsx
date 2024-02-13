import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSpeed } from "../../shared/services/speeds/getData";

import { speedInterface } from "../../shared/interfaces/speedInterfaces";

import Container from "@mui/material/Container";

interface resultInterface {
  status: number;
  data: speedInterface;
}

export default function SpeedDetail() {
  const { speedId } = useParams();
  const [speed, setSpeed] = useState<speedInterface | null>(null);

  useEffect(() => {
    if (!speedId) {
      return;
    }
    getSpeed(speedId).then((result: resultInterface) => {
      if (result.status === 200) {
      } else if (result.status === 500) {
      } else {
      }
    });
  }, []);

  console.log(speedId);

  return (
    <Container>
      <h1>Speed Detail</h1>
    </Container>
  );
}
