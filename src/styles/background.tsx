import MoonLight from "../assets/svg/moon-main-light.svg";
import UranusDark from "../assets/svg/uranus-main-dark.svg";

export default function backgroundDivStyle(mode: string) {
  const backgroundImagePosition =
    window.innerWidth <= 1920
      ? "top right"
      : `${window.innerWidth / 2 + 150}px 0px`;

  return {
    backgroundImage:
      mode === "light" ? `url(${MoonLight})` : `url(${UranusDark})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: backgroundImagePosition,
    minHeight: "800px",
  };
}
