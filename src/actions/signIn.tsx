function signIn(
  access_token: string,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
) {
  localStorage.setItem("access", access_token);
  setIsAuthenticated(true);
}

export default signIn;
