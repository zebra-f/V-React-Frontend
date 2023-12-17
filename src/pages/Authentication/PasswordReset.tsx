import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import passwordResetEmail from "./components/passwordResetEmail";
import passwordResetPassword from "./components/passwordResetPassword";

interface props {
  isAuthenticated: boolean;
}
function PasswordReset({ isAuthenticated }: props) {
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const token = urlParams.get("token");

  const handleAuthenticatedUser = () => {
    if (isAuthenticated) {
      navigate("/");
    }
  };
  useEffect(() => {
    handleAuthenticatedUser();
  }, []);
  useEffect(() => {
    handleAuthenticatedUser();
  }, [isAuthenticated]);

  if (id && token) {
    return passwordResetPassword(id, token);
  }
  return passwordResetEmail();
}

export default PasswordReset;
