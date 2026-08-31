// Generated contract client. Regenerate alongside openapi.yaml when backend routes or schemas change.
import type { AxiosRequestConfig } from "axios";
import type { z } from "zod";
import api from "../lib/api";

export async function requestValidated<TSchema extends z.ZodType>(config: AxiosRequestConfig, schema: TSchema): Promise<z.infer<TSchema>> {
  const response = await api.request<unknown>(config);
  return schema.parse(response.data);
}

export const apiV1 = {
  get: <TSchema extends z.ZodType>(path: string, schema: TSchema, config?: AxiosRequestConfig) => requestValidated({ ...config, method: "GET", url: `/api/v1${path}` }, schema),
  post: <TSchema extends z.ZodType>(path: string, body: unknown, schema: TSchema, config?: AxiosRequestConfig) => requestValidated({ ...config, method: "POST", url: `/api/v1${path}`, data: body }, schema),
};
