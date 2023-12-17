import { Routes, Route } from "react-router-dom";

import useLocalStorageState from "use-local-storage-state";

import Navbar from "./shared/components/Navbar";
import Home from "./pages/Home/Home";
import Vees from "./pages/Vees/Vees";
import About from "./pages/About/About";
import Length from "./pages/Vees/Length";
import Speed from "./pages/Vees/Speed";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import PasswordReset from "./pages/Authentication/PasswordReset";

export default function App(props: any) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState(
    "isAuthenticated",
    { defaultValue: false }
  );
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
        setIsAuthenticated={setIsAuthenticated}
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

        <Route
          path="signin"
          element={
            <SignIn
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="signup"
          element={<SignUp isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="passwordreset"
          element={<PasswordReset isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    </div>
  );
}
