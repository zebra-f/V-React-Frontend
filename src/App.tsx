import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

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
import VerifyEmail from "./pages/Authentication/VerifyEmail";
import GoogleRedirect from "./pages/Authentication/google/GoogleRedirect";
import GoogleSignUp from "./pages/Authentication/google/GoogleSignUp";

import Account from "./pages/User/Account";
import MyAccount from "./pages/User/AccountComponents/MyAccount";
import ChangePassword from "./pages/User/AccountComponents/ChangePassword";
import DeleteAccount from "./pages/User/AccountComponents/DeleteAccount";

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

  const [googleEventListenerActive, setGoogleEventListenerActive] =
    useState(false);

  const location = useLocation();
  const pathsWithoutNavbar = ["openid/googleredirect"];
  let renderNavbar = true;
  pathsWithoutNavbar.forEach((path) => {
    const i = location.pathname.indexOf(path);
    if (i !== -1) {
      renderNavbar = false;
    }
  });

  return (
    <div className="App">
      {renderNavbar && (
        <Navbar
          setSessionThemeMode={props.setSessionThemeMode}
          sessionThemeMode={props.sessionThemeMode}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      <Routes>
        <Route path="" element={<Home />} />
        {/* Vees */}
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
          path="account"
          element={<Account isAuthenticated={isAuthenticated} />}
        >
          <Route path="" element={<MyAccount />} />
          <Route path="myaccount" element={<MyAccount />} />

          <Route path="changepassword" element={<ChangePassword />} />
          <Route
            path="deleteaccount"
            element={<DeleteAccount setIsAuthenticated={setIsAuthenticated} />}
          />
        </Route>

        {/* Authentication */}
        <Route
          path="signin"
          element={
            <SignIn
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              googleEventListenerActive={googleEventListenerActive}
              setGoogleEventListenerActive={setGoogleEventListenerActive}
            />
          }
        />
        <Route
          path="signup"
          element={
            <SignUp
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              googleEventListenerActive={googleEventListenerActive}
              setGoogleEventListenerActive={setGoogleEventListenerActive}
            />
          }
        />
        <Route
          path="passwordreset"
          element={<PasswordReset isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="verifyemail"
          element={<VerifyEmail isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="googlesignup"
          element={
            <GoogleSignUp
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        {/* Don't render Navbar */}
        <Route path="openid/googleredirect" element={<GoogleRedirect />} />
      </Routes>
    </div>
  );
}
