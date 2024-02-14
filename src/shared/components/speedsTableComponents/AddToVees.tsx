import { useState } from "react";
import Button from "@mui/material/Button";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import AddIcon from "@mui/icons-material/Add";

import {
  useVeesSpeedData,
  veesSpeedDataInterface,
} from "../../contexts/VeesSpeedData";
import { speedInterface } from "../../interfaces/speedInterfaces";

export default function AddToVees({ speed }: { speed: speedInterface }) {
  const [veesSpeedData, setVeesSpeedData] = useVeesSpeedData();

  const [addedToVees, setAddedToVees] = useState(false);
  if (!addedToVees) {
    veesSpeedData.forEach((veesSpeed: veesSpeedDataInterface) => {
      if (veesSpeed.localSpeed.id === speed.id) {
        setAddedToVees(true);
      }
    });
  }

  const handleAddToVeesSpeedData = () => {
    setVeesSpeedData((prev: veesSpeedDataInterface[]) => {
      return [
        ...prev,
        {
          local: false,
          localSpeed: {
            id: speed.id,
            name: speed.name,
            kmph: speed.kmph,
            mph: speed.kmph * 0.621371,
          },
          externalSpeed: speed,
        },
      ];
    });
    setAddedToVees(true);
  };
  return (
    <>
      {addedToVees ? (
        <Button disabled={true}>
          <BeenhereIcon color="success" />
        </Button>
      ) : (
        <Button onClick={handleAddToVeesSpeedData}>
          <AddIcon />
        </Button>
      )}
    </>
  );
}
