// <===================== file to show the custom hook for the api =================>

// importing the required modules
import { useState, useCallback } from "react";
import api from "../api/axiosConfig";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "../types/types";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type RequestData = Record<string, unknown> | FormData | null;

// creating the custom hook
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(
      method: HttpMethod,
      url: string,
      data: RequestData = null,
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        let response: AxiosResponse<T>;

        switch (method) {
          case "get":
            response = await api.get<T>(url, config);
            break;
          case "post":
            response = await api.post<T>(url, data, config);
            break;
          case "put":
            response = await api.put<T>(url, data, config);
            break;
          case "patch":
            response = await api.patch<T>(url, data, config);
            break;
          case "delete":
            response = await api.delete<T>(url, config);
            break;
          default:
            throw new Error(`unsupported http method ${method}`);
        }
        setLoading(false);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data?.message || "An error occurred");
        setLoading(false);
        throw error;
      }
    },
    []
  );

  const get = useCallback(
    <T>(url: string, config: AxiosRequestConfig = {}) =>
      request<T>("get", url, null, config),
    [request]
  );
  const post = useCallback(
    <T>(url: string, data: RequestData, config: AxiosRequestConfig = {}) =>
      request<T>("post", url, data, config),
    [request]
  );
  const put = useCallback(
    <T>(url: string, data: RequestData, config: AxiosRequestConfig = {}) =>
      request<T>("put", url, data, config),
    [request]
  );
  const patch = useCallback(
    <T>(url: string, data: null, config: AxiosRequestConfig = {}) =>
      request<T>("patch", url, data, config),
    [request]
  );
  const del = useCallback(
    <T>(url: string, config: AxiosRequestConfig = {}) =>
      request<T>("delete", url, null, config),
    [request]
  );

  return { get, post, put, patch, del, loading, error };
};

export default useApi;
