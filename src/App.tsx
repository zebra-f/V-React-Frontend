import { Routes, Route } from "react-router-dom";

import Navbar from "./shared/components/Navbar";
import Home from "./pages/Home/Home";
import Vees from "./pages/Vees/Vees";
import About from "./pages/About/About";
import Length from "./pages/Vees/Length";
import Speed from "./pages/Vees/Speed";
import SignIn from "./pages/Authentication/Signin";
import SignUp from "./pages/Authentication/Signup";

import useLocalStorageState from "use-local-storage-state";

import kyClient from "./shared/services/ky";

export default function App(props: any) {
  const response = kyClient.backendApi.get("speeds/");
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState(
    "isAuthenticated",
    { defaultValue: false }
  );
  setIsAuthenticated(false);

  const [measurementSystem, setMeasurementSystem] = useLocalStorageState<
    "metric" | "imperial"
  >("measurementSystem", {
    defaultValue: "metric",
  });

  return (
    <div className="App">
      <Navbar
        setSessionThemeMode={props.setSessionThemeMode}
        sessionThemeMode={props.sessionThemeMode}
        isAuthenticated={isAuthenticated}
      />
      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="vees"
          element={
            <Vees
              setMeasurementSystem={setMeasurementSystem}
              measurementSystem={measurementSystem}
            />
          }
        >
          <Route path="length" element={<Length />} />
          <Route
            path=""
            element={<Speed measurementSystem={measurementSystem} />}
          />
        </Route>
        <Route path="about" element={<About />} />

        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}
