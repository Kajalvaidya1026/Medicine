import { ApiError, apiRequest } from "./client.js";

function isLoginResponse(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.flag === "boolean" &&
    typeof value.message === "string"
  );
}

export async function loginUser(email, password) {
  const response = await apiRequest("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!isLoginResponse(response)) {
    throw new ApiError("The backend returned an unexpected login response.");
  }

  return response;
}

export async function registerUser(registration) {
  const response = await apiRequest("/user/save", {
    method: "POST",
    body: JSON.stringify(registration),
  });

  if (response !== true) {
    throw new ApiError("Registration could not be completed.");
  }
}
