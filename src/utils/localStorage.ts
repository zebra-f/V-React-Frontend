import { veesSpeedDataInterface } from "../shared//contexts/VeesSpeedData";

function clearVeesSpeedData() {
  // clears some fields of veesSpeedData after users logs out

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
      if (!speed.externalSpeed.is_public) {
        speed.externalSpeed = null;
        speed.local = true;
      }
    }
  });
  localStorage.setItem("veesSpeedData", JSON.stringify(veesSpeedData));
}

export { clearVeesSpeedData };
