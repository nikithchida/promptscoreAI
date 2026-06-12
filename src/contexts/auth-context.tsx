"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  plan: "Free" | "Pro" | "Enterprise";
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, name?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<UserProfile>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode] = useState<boolean>(true); // Defaults to demo mode for direct runs

  useEffect(() => {
    // Check if session exists in localStorage
    const savedSession = localStorage.getItem("promptscore_session");
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem("promptscore_session");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<UserProfile> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
          const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

          if (found) {
            const loggedInUser: UserProfile = {
              id: found.id,
              email: found.email,
              name: found.name,
              plan: found.plan || "Free",
              createdAt: found.createdAt,
            };
            localStorage.setItem("promptscore_session", JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            setLoading(false);
            resolve(loggedInUser);
          } else {
            // Self-register in demo mode if the user doesn't exist
            const newUser: UserProfile = {
              id: Math.random().toString(36).substring(2, 9),
              email: email,
              name: email.split("@")[0],
              plan: "Pro",
              createdAt: new Date().toISOString(),
            };
            const updatedUsers = [...users, newUser];
            localStorage.setItem("promptscore_users", JSON.stringify(updatedUsers));
            localStorage.setItem("promptscore_session", JSON.stringify(newUser));
            setUser(newUser);
            setLoading(false);
            resolve(newUser);
          }
        } catch (error) {
          setLoading(false);
          reject(new Error("Login failed."));
        }
      }, 800);
    });
  };

  const register = async (email: string, _password: string, name?: string): Promise<UserProfile> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
          const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

          if (exists) {
            setLoading(false);
            reject(new Error("User with this email already exists."));
            return;
          }

          const newUser: UserProfile = {
            id: Math.random().toString(36).substring(2, 9),
            email: email,
            name: name || email.split("@")[0],
            plan: "Pro", // Free upgrade in demo mode
            createdAt: new Date().toISOString(),
          };

          localStorage.setItem("promptscore_users", JSON.stringify([...users, newUser]));
          localStorage.setItem("promptscore_session", JSON.stringify(newUser));
          setUser(newUser);
          setLoading(false);
          resolve(newUser);
        } catch (error) {
          setLoading(false);
          reject(new Error("Registration failed."));
        }
      }, 800);
    });
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("promptscore_session");
        setUser(null);
        setLoading(false);
        resolve();
      }, 400);
    });
  };

  const updateProfile = async (name: string): Promise<UserProfile> => {
    if (!user) throw new Error("No authenticated user.");
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = { ...user, name };
        localStorage.setItem("promptscore_session", JSON.stringify(updated));
        setUser(updated);

        // Update list of users
        const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
        const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, name } : u));
        localStorage.setItem("promptscore_users", JSON.stringify(updatedUsers));

        resolve(updated);
      }, 500);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
