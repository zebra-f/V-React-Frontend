import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import AppProvidersProvider from "./shared/contexts/AppProvidersProvider";

import Navbar from "./shared/components/Navbar";
import Home from "./pages/Home/Home";

import Vees from "./pages/Vees/Vees";
import About from "./pages/About/About";

import Length from "./pages/Vees/Length";
import Speed from "./pages/Vees/Speed";

import Data from "./pages/VeesData/Data";
import SpeedsList from "./pages/VeesData/SpeedsList";
import SpeedDetail from "./pages/VeesData/SpeedDetail";

import TermsOfService from "./pages/Other/TermsOfService";

import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import PasswordReset from "./pages/Authentication/PasswordReset";
import VerifyEmail from "./pages/Authentication/VerifyEmail";
import GoogleRedirect from "./pages/Authentication/google/GoogleRedirect";
import GoogleSignUp from "./pages/Authentication/google/GoogleSignUp";

// Account
import Account from "./pages/User/Account";
import MyAccount from "./pages/User/AccountComponents/MyAccount";
import ChangePassword from "./pages/User/AccountComponents/ChangePassword";
import DeleteAccount from "./pages/User/AccountComponents/DeleteAccount";

// Profile
import Profile from "./pages/User/Profile";
import ProfileSpeeds from "./pages/User/ProfileComponents/Speeds";
import MySpeeds from "./pages/User/ProfileComponents/SpeedsComponents/MySpeeds";
import MySpeedFeedback from "./pages/User/ProfileComponents/SpeedsComponents/MyFeedback";
import MySpeedBookmarks from "./pages/User/ProfileComponents/SpeedsComponents/MyBookmarks";
import ProfileLengths from "./pages/User/ProfileComponents/Lengths";

// Public Profile
import PublicProfile from "./pages/User/PublicProfile";
import PublicProfileSpeeds from "./pages/User/PublicProfileComponents/Speeds";
import PublicProfileLengths from "./pages/User/PublicProfileComponents/Lengths";

export default function App(props: any) {
  const [googleEventListenerActive, setGoogleEventListenerActive] =
    useState(false);

  const location = useLocation();
  const pathsWithoutNavbar = ["openid/googleredirect", "termsofservice"];
  let renderNavbar = true;
  pathsWithoutNavbar.forEach((path) => {
    const i = location.pathname.indexOf(path);
    if (i !== -1) {
      renderNavbar = false;
    }
  });

  return (
    <AppProvidersProvider>
      <div className="App">
        {renderNavbar && (
          <Navbar
            setSessionThemeMode={props.setSessionThemeMode}
            sessionThemeMode={props.sessionThemeMode}
          />
        )}
        <Routes>
          <Route path="" element={<Home />} />
          {/* Vees */}
          <Route path="vees" element={<Vees />}>
            {["", "speed"].map((path, index) => (
              <Route key={index} path={path} element={<Speed />} />
            ))}
            <Route path="length" element={<Length />} />
          </Route>
          {/* Data */}
          <Route path="data" element={<Data />}>
            {["", "speeds"].map((path, index) => (
              <Route key={index} path={path} element={<SpeedsList />} />
            ))}
            <Route path="length" element={<Length />} />
          </Route>
          <Route path="data/speeds/:speedId" element={<SpeedDetail />} />

          {/* About */}
          <Route path="about" element={<About />} />

          {/* Account */}
          <Route path="account" element={<Account />}>
            {["", "myaccount"].map((path, index) => (
              <Route key={index} path={path} element={<MyAccount />} />
            ))}
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="deleteaccount" element={<DeleteAccount />} />
          </Route>
          {/* Profile */}
          <Route path="account/profile" element={<Profile />}>
            {["", "speeds"].map((path, index) => (
              <Route key={index} path={path} element={<ProfileSpeeds />}>
                {["", "speeds"].map((path, index) => (
                  <Route key={index} path={path} element={<MySpeeds />} />
                ))}
                <Route path="feedback" element={<MySpeedFeedback />} />
                <Route path="bookmarks" element={<MySpeedBookmarks />} />
              </Route>
            ))}
            <Route path="lengths" element={<ProfileLengths />}></Route>
          </Route>
          {/* Public Profile */}
          <Route path="profile/:userName?" element={<PublicProfile />}>
            {["", "speeds"].map((path, index) => (
              <Route
                key={index}
                path={path}
                element={<PublicProfileSpeeds />}
              />
            ))}
            <Route path="lengths" element={<PublicProfileLengths />} />
          </Route>

          {/* Authentication */}
          <Route
            path="signin"
            element={
              <SignIn
                googleEventListenerActive={googleEventListenerActive}
                setGoogleEventListenerActive={setGoogleEventListenerActive}
              />
            }
          />
          <Route
            path="signup"
            element={
              <SignUp
                googleEventListenerActive={googleEventListenerActive}
                setGoogleEventListenerActive={setGoogleEventListenerActive}
              />
            }
          />
          <Route path="passwordreset" element={<PasswordReset />} />
          <Route path="verifyemail" element={<VerifyEmail />} />
          <Route path="googlesignup" element={<GoogleSignUp />} />
          {/* Don't render Navbar */}
          <Route path="openid/googleredirect" element={<GoogleRedirect />} />
          <Route path="termsofservice" element={<TermsOfService />} />
        </Routes>
      </div>
    </AppProvidersProvider>
  );
}
