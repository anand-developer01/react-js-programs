import { useState, useCallback, useRef } from "react";
import apiClient from "../api/apiClient";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    // 🧹 Cancel previous request (real-time search safe)
    // if (controllerRef.current) {
    //   controllerRef.current.abort();
    // }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await apiClient({
        ...config,
        signal: controller.signal,
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);

      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        console.log("Request cancelled");
        return;
      }

      setError(err.response?.data || err.message);
      throw err;
    }
  }, []);

  // manual cancel
//   const cancelRequest = () => {
//     if (controllerRef.current) {
//       controllerRef.current.abort();
//     }
//   };

  return {
    request,
    loading,
    error,
    // cancelRequest,
  };
};

export default useApi;