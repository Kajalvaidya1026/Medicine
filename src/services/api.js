
import axios from "axios";

// Create one Axios instance for communicating with Spring Boot.
const api = axios.create({
  // Address where your Spring Boot backend is running.
  baseURL: "http://localhost:8085/api",

  // Tell the backend that we are sending JSON data.
  headers: {
    "Content-Type": "application/json",
  },
});

// Function called by the Create Account page.
export async function registerUser(userData) {
  try {
    // Send the registration information to the backend.
    const response = await api.post("/users/register", userData);

    // Return the response from Spring Boot to the React page.
    return response.data;
  } catch (error) {
    // Show an understandable error if the request fails.
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string"
        ? error.response.data
        : null) ||
      error.message ||
      "Registration failed.";

    // Pass the error back to the Create Account page.
    throw new Error(message);
  }
}

// Export Axios so other API functions can reuse it.
export default api;
