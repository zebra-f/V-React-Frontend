function signIn(
  accessToken: string,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
) {
  localStorage.setItem("access", accessToken);
  setIsAuthenticated(true);
}

export default signIn;
