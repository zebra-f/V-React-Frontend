import { v4 as uuidv4 } from "uuid";

import { veesSpeedDataInterface } from "../shared//contexts/VeesSpeedData";

function clearVeesSpeedData() {
  // WARNING: this function doesn't clear in-memory data held by
  // useVeesSpeedData, solutions: refresh page (programatically), or use
  // setVeesSpeedData() with the current localStorage value of veesSpeedData

  const veesSpeedDataStringRepresentation =
    localStorage.getItem("veesSpeedData");
  if (!veesSpeedDataStringRepresentation) {
    return;
  }

  const veesSpeedData = JSON.parse(veesSpeedDataStringRepresentation);
  veesSpeedData.forEach((speed: veesSpeedDataInterface) => {
    if (speed.externalSpeed) {
      speed.externalSpeed.user_speed_feedback = null;
      speed.externalSpeed.user_speed_bookmark = null;
      speed.externalSpeedBasic = true;
      if (!speed.externalSpeed.is_public) {
        speed.externalSpeed = null;
        speed.local = true;
        speed.localSpeed.id = uuidv4();
      }
    }
  });
  localStorage.setItem("veesSpeedData", JSON.stringify(veesSpeedData));
}

export { clearVeesSpeedData };
