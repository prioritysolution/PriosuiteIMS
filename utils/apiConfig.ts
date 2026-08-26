import axios from "axios";
import Cookies from "./secureCookieHelper";
import getCookieData from "./getCookieData";
import {
  AUTH_TOKEN_KEY,
  logoutAndRedirectToPortal,
} from "./authRedirect";

interface ApiCallData {
  url: string;
  bodyData?: any;
}

const makeApiCall = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  data: ApiCallData,
  content = "application/json"
) => {
  try {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = getCookieData<string>(AUTH_TOKEN_KEY);
    }

    const headers: Record<string, string> = {
      "Content-Type": content,
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    let body: any;

    body =
      content === "multipart/form-data"
        ? data.bodyData
        : JSON.stringify(data.bodyData);

    let response: any;

    switch (method) {
      case "GET":
        response = await axios.get(data?.url, { headers });
        break;
      case "POST":
        response = await axios.post(data?.url, body, { headers });
        break;
      case "PUT":
        response = await axios.put(data?.url, body, { headers });
        break;
      case "DELETE":
        response = await axios.delete(data?.url, { headers });
        break;
    }

    console.log("response", response);

    const returnedToken = response?.token || response?.data?.token;

    if (returnedToken) {
      Cookies.set(AUTH_TOKEN_KEY, returnedToken, {
        expires: 7,
        sameSite: "Lax",
        path: "/",
      });
    }

    if (!response.data) {
      console.warn("API response missing data field:", response);
      return null;
    }

    return response.data;
  } catch (error: any) {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: data?.url,
      method: method,
    });

    if (error.response?.status === 401) {
      logoutAndRedirectToPortal();
    }
    throw error;
  }
};

export const doGetApiCall = (data: ApiCallData) => makeApiCall("GET", data);
export const doPostApiCall = (data: ApiCallData, content?: string) =>
  makeApiCall("POST", data, content);
export const doDeleteApiCall = (data: ApiCallData) => makeApiCall("DELETE", data);
export const doPutApiCall = (data: ApiCallData) => makeApiCall("PUT", data);

// Default export to preserve backward compatibility for existing pages calling `api.get`, `api.post`, etc.
const api = {
  get: (url: string) => doGetApiCall({ url }),
  post: (url: string, bodyData?: any) => doPostApiCall({ url, bodyData }),
  put: (url: string, bodyData?: any) => doPutApiCall({ url, bodyData }),
  delete: (url: string) => doDeleteApiCall({ url }),
};

export default api;
