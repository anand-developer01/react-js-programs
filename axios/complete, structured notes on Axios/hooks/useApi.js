import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient(config);
      return response.data; // ✅ always return data
    } catch (err) {
      const errData = err.response?.data || err.message;
      setError(errData);
      throw err; // let caller handle if needed
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    request,
    loading,
    error,
  };
};

export default useApi;
