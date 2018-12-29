import axios from "axios";

export const config = {
  // API BASE Config
  baseURL: process.env.BASE,
  timeout: process.env.TTL,
  headers: {}
};

export const requestMiddlewareResolve = config => config;
export const requestMiddlewareReject = error => Promise.reject(error);

export const responseMiddlewareResolve = response => response;
export const responseMiddlewareReject = error => Promise.reject(error);

export const API = axios.create(config);

API.interceptors.request.use(requestMiddlewareResolve, requestMiddlewareReject);
API.interceptors.response.use(responseMiddlewareResolve, responseMiddlewareReject);

export default API;
