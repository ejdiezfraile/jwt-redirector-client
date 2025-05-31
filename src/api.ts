// src/api.ts
import { showError } from "./utils"; // Assuming showAlert is not directly needed here now

const API_BASE_URL = import.meta.env.VITE_API_REST; // Added line

export interface Usuario {
  sub: string;
  iss: string;
  exp: number;
  app: string;
  roles: string[];
}

export const fetchJWTAPI = async (
  usuario: Usuario,
  secretValue: string // Changed
) => {
  console.log("fetchJWTAPI invoked");
  return fetch(API_BASE_URL, { // Changed to use the constant
    method: "POST",
    body: JSON.stringify({
      payload: usuario,
      secret: secretValue, // Changed
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("An error has occured: " + response.status);
    }
    return response.json();
  });
};

export const getJWTAPI = async (
  usuario: Usuario,
  secretValue: string, // Changed
  validateFn: () => boolean
): Promise<string | undefined> => { // Added return type
  console.log("getJWTAPI invoked");
  if (!validateFn()) {
    console.log("getJWTAPI validation failed");
    return undefined; // Explicit return
  }

  try {
    const data = await fetchJWTAPI(usuario, secretValue); // Use secretValue
    if (data && data.jwt) {
      console.log("JWT data received:", data);
      return data.jwt; // Return JWT string
    } else {
      console.log("No JWT in response data:", data);
      return undefined; // Explicit return
    }
  } catch (error: any) {
    showError(error.message);
    return undefined; // Explicit return on error
  }
};

export const executeRedirectAPI = async (
  isPizarraValue: boolean,
  targetUrl: string,
  jwtValue: string,
  fallbackUrl: string
): Promise<void> => {
  console.log("executeRedirectAPI invoked");

  if (isPizarraValue) {
    window.open(targetUrl, "_blank")?.focus();
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      credentials: "include",
      headers: {
        Authorization: "Bearer " + jwtValue,
      },
    });
    console.log("executeRedirectAPI response:", response);
    if (response.redirected) {
      window.open(response.url, "_blank");
    } else if (response.ok) {
      window.open(fallbackUrl, "_blank");
    } else {
      throw new Error(
        "Problemas con " +
        response.url +
        " " +
        response.statusText +
        "(" +
        response.status +
        ")"
      );
    }
  } catch (error: any) {
    showError(error.message);
  }
};
