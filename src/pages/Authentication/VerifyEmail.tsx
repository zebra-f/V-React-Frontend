import { useRedirectAuthenticatedUserEffect } from "../../shared/hooks/useEffect";
import { useIsAuthenticated } from "../../shared/contexts/IsAuthenticated";

import verifyEmail from "./components/verifyEmail";
import verifyEmailResendEmail from "./components/verifyEmailResendEmail";

function VerifyEmail() {
  const [isAuthenticated] = useIsAuthenticated();
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
