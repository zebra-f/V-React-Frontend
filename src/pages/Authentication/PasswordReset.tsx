import { useRedirectAuthenticatedUserEffect } from "../../shared/hooks/useEffect";
import { useIsAuthenticated } from "../../shared/contexts/IsAuthenticated";

import passwordResetEmail from "./components/passwordResetEmail";
import passwordResetPassword from "./components/passwordResetPassword";

function PasswordReset() {
  const [isAuthenticated] = useIsAuthenticated();
  useRedirectAuthenticatedUserEffect(isAuthenticated, "/");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const token = urlParams.get("token");

  if (id && token) {
    return passwordResetPassword(id, token);
  }
  return passwordResetEmail();
}

export default PasswordReset;
