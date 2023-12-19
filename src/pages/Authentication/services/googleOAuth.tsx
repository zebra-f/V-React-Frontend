import { redirect } from "react-router-dom";
import kyClient from "../../../shared/services/ky";

async function initializeAuth() {
  try {
    const response: any = await kyClient.backendApi
      .get("token/google/login/")
      .json();
    return response.redirect_url;
  } catch (_error: any) {
    return "";
  }
}

async function validate() {
  try {
    const response: any = await kyClient.backendApi
      .get("token/google/login/")
      .json();
    return response.redirect_url;
  } catch (_error: any) {
    return "";
  }
}

function openGoogleConsentWindow(event: any) {
  let redirect_url = "";
  initializeAuth()
    .then((url) => {
      console.log(url);
      openWindow(url);
    })
    .catch((_error) => {
      return;
    });

  const openWindow = (redirect_url: string) => {
    const popupWidth = 640;
    const popupHeight = 480;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    const windowFeatures = `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition},popup=true`;

    let popupWindow = window.open(redirect_url, "popup", windowFeatures);
    window.addEventListener("message", function (event) {
      if (event.data) {
        console.log(event.data);
        exchangeCallbackParams(event.data).then((data) => {
          console.log(data);
        });
      }
      popupWindow?.close();
    });
  };
}

async function exchangeCallbackParams(queryParams: string) {
  try {
    const response: any = await kyClient.backendApi
      .get(`token/google/callback/${queryParams}`, { retry: 0 })
      .json();
    return response.redirect_url;
  } catch (_error: any) {
    return "";
  }
}

export { openGoogleConsentWindow, exchangeCallbackParams };
