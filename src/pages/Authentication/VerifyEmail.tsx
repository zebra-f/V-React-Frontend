import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import verifyEmail from "./components/verifyEmail";
import verifyEmailResendEmail from "./components/verifyEmailResendEmail";

interface props {
  isAuthenticated: boolean;
}
function VerifyEmail({ isAuthenticated }: props) {
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

  if (id && token) {
    return verifyEmail(id, token);
  }
  return verifyEmailResendEmail();
}

export default VerifyEmail;
