import axios from "axios";

import HTTP_CONFIG from "./http.config";

export const axiosClient = axios.create({
  baseURL: HTTP_CONFIG.baseURL,
  timeout: HTTP_CONFIG.axiosTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});
