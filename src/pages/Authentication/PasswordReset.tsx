import { useRedirectAuthenticatedUserEffect } from "../../shared/hooks/useEffect";

import passwordResetEmail from "./components/passwordResetEmail";
import passwordResetPassword from "./components/passwordResetPassword";

interface props {
  isAuthenticated: boolean;
}
function PasswordReset({ isAuthenticated }: props) {
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
