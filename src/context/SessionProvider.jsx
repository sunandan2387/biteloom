"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log(`token:`, token);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      fetchUserDetails(token);
      // router.push("/console");
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      console.log("Fetching user details...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }, );
      const data = await response.json();
      if(data.status == true){
        console.log(`User data:`, data.data);
        setUser(data.data); // Simulated user data
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }; 

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/");
  };

  const goToConsole = () => {
    console.log('goToConsole');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, goToConsole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
