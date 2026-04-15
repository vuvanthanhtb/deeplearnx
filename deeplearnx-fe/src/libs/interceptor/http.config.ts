const HTTP_CONFIG = {
  retry: {
    times: 3,
    delay: 1000,
  },
  baseURL: import.meta.env.VITE_API_URL,
  axiosTimeout: 15000,
};

export default HTTP_CONFIG;
