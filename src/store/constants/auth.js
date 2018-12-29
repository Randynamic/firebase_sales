import { PREFIX } from "./global";

export const AUTH_LANDING_ROUTE = "/dashboard";

export const AUTHENTICATE = PREFIX + "/auth/AUTHENTICATE";
export const AUTH_LOGIN = PREFIX + "/auth/LOGIN";
export const AUTH_LOGOUT = PREFIX + "/auth/LOGOUT";
export const AUTH_DEFAULT = AUTH_LOGIN;

export const GET_TOKEN = PREFIX + "/auth/GET_TOKEN";

export const MODULAIR_NON_AUTORIZED = PREFIX + "/auth/MODULE_NOT_AUTH";
export const AUTH_SESSION_FAILED = PREFIX + "/auth/AUTH_SESSION_FAILED";
export const AUTH_RESTRICTED_ACCESS = PREFIX + "/auth/AUTH_RESTRICTED_ACCESS";

export const SET_CURRENT_USER = PREFIX + "/auth/AUTH_SET_CURRENT_USER";
export const AUTH_GET_SESSION = PREFIX + "/auth/AUTH_GET_SESSION";
export const AUTH_CLEAR_SESSION = PREFIX + "/auth/AUTH_CLEAR_SESSION";
export const AUTH_SESSION_OK = PREFIX + "/auth/AUTH_SESSION_OK";
