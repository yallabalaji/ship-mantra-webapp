export const getUserRole = () => {
    return localStorage.getItem("userRole") || "Guest"; // Default to Guest if not logged in
  };
  