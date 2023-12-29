import jwt from "../utils/jwt";

function signIn(
  accessToken: string,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
) {
  localStorage.setItem("access", accessToken);
  setIsAuthenticated(true);
  console.log(jwt.getUserId(accessToken));
}

export default signIn;
