import kyClient from "../shared/services/ky";

export default async function signOut(
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!isAuthenticated) {
    return false;
  }
  try {
    await kyClient.backendApi.post("token/logout/").json();
  } catch (error: any) {
    const response = await error.response;
    const responseData = await response.json();
    if ("detail" in responseData) {
      if (responseData.detail === "Token is blacklisted") {
        return true;
      }
    }
    return false;
  }
  setIsAuthenticated(false);
  if ("access" in localStorage) {
    localStorage.removeItem("access");
  }
  return true;
}
