import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { env } from "@/shared/config/env";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipRefreshRetry?: boolean;
  }
}

const SIGN_IN_PATH = "/auth/signin";
const REFRESH_PATH = "/auth/refresh";
const UNAUTHENTICATED_STATUSES = [401, 403];
const REFRESH_EXEMPT_PATHS = ["/auth/signin", "/auth/signup", REFRESH_PATH];

export interface IHttpClient {
  get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
  post<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  put<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  patch<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
}

export class HttpClient implements IHttpClient {
  private readonly instance: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (
          !axios.isAxiosError(error) ||
          !error.response ||
          typeof window === "undefined"
        ) {
          return Promise.reject(error);
        }

        const config = error.config;
        if (config && this.canRetryWithRefresh(error.response.status, config)) {
          try {
            await this.refreshSession();
            return await this.instance.request({
              ...config,
              skipRefreshRetry: true,
            });
          } catch {
            this.redirectToSignIn();
            return Promise.reject(error);
          }
        }

        if (UNAUTHENTICATED_STATUSES.includes(error.response.status)) {
          this.redirectToSignIn();
        }
        return Promise.reject(error);
      },
    );
  }

  private canRetryWithRefresh(
    status: number,
    config: AxiosRequestConfig,
  ): boolean {
    return (
      status === 401 &&
      !config.skipRefreshRetry &&
      !REFRESH_EXEMPT_PATHS.some((path) => config.url?.includes(path))
    );
  }

  private refreshSession(): Promise<void> {
    this.refreshPromise ??= this.instance
      .post(REFRESH_PATH, undefined, { skipRefreshRetry: true })
      .then(() => undefined)
      .finally(() => {
        this.refreshPromise = null;
      });
    return this.refreshPromise;
  }

  private redirectToSignIn(): void {
    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = SIGN_IN_PATH;
    }
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.instance.get<TResponse>(url, config);
    return response.data;
  }

  async post<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.instance.post<TResponse>(url, body, config);
    return response.data;
  }

  async put<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.instance.put<TResponse>(url, body, config);
    return response.data;
  }

  async patch<TResponse, TBody = undefined>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.instance.patch<TResponse>(url, body, config);
    return response.data;
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.instance.delete<TResponse>(url, config);
    return response.data;
  }
}
