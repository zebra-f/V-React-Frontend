import { useRedirectAuthenticatedUserEffect } from "../../shared/hooks/useEffect";

import verifyEmail from "./components/verifyEmail";
import verifyEmailResendEmail from "./components/verifyEmailResendEmail";

interface props {
  isAuthenticated: boolean;
}
function VerifyEmail({ isAuthenticated }: props) {
  useRedirectAuthenticatedUserEffect(isAuthenticated, "/");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const token = urlParams.get("token");

  if (id && token) {
    return verifyEmail(id, token);
  }
  return verifyEmailResendEmail();
}

export default VerifyEmail;
