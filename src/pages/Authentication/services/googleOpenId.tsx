import kyClient from "../../../shared/services/ky";

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
  setGoogleEventListenerActive: React.Dispatch<React.SetStateAction<boolean>>
) {
  initializeAuth()
    .then((url) => {
      openWindow(url);
    })
    .catch((_error) => {
      return false;
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
          exchangeCallbackParamsForJwt(event.data);
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

async function exchangeCallbackParamsForJwt(queryParams: string) {
  try {
    const response: any = await kyClient.backendApi
      .get(`token/google/callback/${queryParams}`, { retry: 0 })
      .json();
    return response.redirect_url;
  } catch (_error: any) {
    return "";
  }
}

export { openGoogleConsentWindow };
