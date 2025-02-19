import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = async () => {
    localStorage.clear();

    try {
      // Attempt to clear the native JWT cookie via our API route
      const res = await fetch("/api/logout-native");
      if (!res.ok) {
        console.error("Failed to clear native JWT cookie");
      }
    } catch (error) {
      console.error("Error clearing native JWT cookie:", error);
    }

    // Always call signOut to clear NextAuth cookies and redirect
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      style={{ color: "red" }}
      onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
