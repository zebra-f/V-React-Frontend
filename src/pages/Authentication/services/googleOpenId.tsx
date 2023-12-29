import kyClient from "../../../shared/services/ky";
import signIn from "../../../actions/signIn";

async function initializeAuth() {
  try {
    const response: any = await kyClient.backendApi
      .get("token/google/login/")
      .json();
    return response.redirect_url;
  } catch (_error: any) {
    throw new Error("Service Unavailable");
  }
}

function openGoogleConsentWindow(
  googleEventListenerActive: boolean,
  setGoogleEventListenerActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  navigateHandler: any
) {
  initializeAuth()
    .then((url) => {
      openWindow(url);
    })
    .catch((_error) => {
      return 500;
    });

  const openWindow = async (redirect_url: string) => {
    const popupWidth = 640;
    const popupHeight = 480;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    const windowFeatures = `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition},popup=true`;
    window.open(redirect_url, "popup", windowFeatures);

    const handleMessageEvent = (event: any) => {
      if (
        event.source &&
        event.source.opener &&
        event.source.opener.location.href == window.location.href
      ) {
        if (event.data) {
          exchangeCallbackParamsForAccess(event.data).then((response: any) => {
            if (response.status === 200 && "access" in response.data) {
              signIn(response.data.access, setIsAuthenticated);
            } else if (response.status === 202) {
              navigateHandler("/googlesignup");
            }
          });
        }
      }
      window.removeEventListener("message", handleMessageEvent);
      setGoogleEventListenerActive(false);
    };

    if (!googleEventListenerActive) {
      window.addEventListener("message", handleMessageEvent);
      setGoogleEventListenerActive(true);
    }
  };
}

async function exchangeCallbackParamsForAccess(queryParams: string) {
  try {
    const response: any = await kyClient.backendApi.get(
      `token/google/callback/${queryParams}/`,
      { retry: 0 }
    );
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (_error: any) {
    throw new Error("Something wen't worng. Try again later.");
  }
}

export { openGoogleConsentWindow };
