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
  resetPasswordForEmail: (email: string, redirectTo: string) => Promise<void>;
  verifyResetToken: (token: string) => Promise<string>;
  completePasswordReset: (token: string, newPassword: string) => Promise<void>;
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

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
          const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

          if (found) {
            if (found.password === password) {
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
              setLoading(false);
              reject(new Error("Incorrect password. Please try again."));
            }
          } else {
            setLoading(false);
            reject(new Error("Account not found. Please register first."));
          }
        } catch (error) {
          setLoading(false);
          reject(new Error("Login failed."));
        }
      }, 800);
    });
  };

  const register = async (email: string, password: string, name?: string): Promise<UserProfile> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simple email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            setLoading(false);
            reject(new Error("Invalid email format."));
            return;
          }

          if (password.length < 6) {
            setLoading(false);
            reject(new Error("Password must be at least 6 characters."));
            return;
          }

          const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
          const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

          if (exists) {
            setLoading(false);
            reject(new Error("User with this email already exists."));
            return;
          }

          const newUser = {
            id: Math.random().toString(36).substring(2, 9),
            email: email,
            password: password, // Storing password for validation in demo
            name: name || email.split("@")[0],
            plan: "Pro", // Free upgrade in demo mode
            createdAt: new Date().toISOString(),
          };

          localStorage.setItem("promptscore_users", JSON.stringify([...users, newUser]));
          
          const sessionUser: UserProfile = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            plan: newUser.plan as any,
            createdAt: newUser.createdAt,
          };
          localStorage.setItem("promptscore_session", JSON.stringify(sessionUser));
          setUser(sessionUser);
          setLoading(false);
          resolve(sessionUser);
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

  const resetPasswordForEmail = async (email: string, redirectTo: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email.trim() || !emailRegex.test(email)) {
            setLoading(false);
            reject(new Error("Please enter a valid email address."));
            return;
          }

          const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
          const found = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

          if (!found) {
            setLoading(false);
            reject(new Error("No account found with this email address."));
            return;
          }

          // Generate simulated secure token
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          
          // Save token to localStorage with 1-hour expiration
          const tokens = JSON.parse(localStorage.getItem("promptscore_reset_tokens") || "[]");
          const activeTokens = tokens.filter((t: any) => t.expires > Date.now());
          activeTokens.push({
            token,
            email: email.toLowerCase(),
            expires: Date.now() + 3600000 // 1 hour expiration
          });
          localStorage.setItem("promptscore_reset_tokens", JSON.stringify(activeTokens));

          // Construct simulated redirect URL
          const resetLink = `${window.location.origin}${redirectTo}?token=${token}`;
          localStorage.setItem("promptscore_latest_reset_link", resetLink);
          console.log(`[Supabase Demo Link]: ${resetLink}`);

          setLoading(false);
          resolve();
        } catch (error) {
          setLoading(false);
          reject(new Error("Failed to process password reset request."));
        }
      }, 800);
    });
  };

  const verifyResetToken = async (token: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const tokens = JSON.parse(localStorage.getItem("promptscore_reset_tokens") || "[]");
        const found = tokens.find((t: any) => t.token === token && t.expires > Date.now());
        
        if (!found) {
          reject(new Error("Invalid or expired reset token."));
          return;
        }
        resolve(found.email);
      } catch (error) {
        reject(new Error("Failed to verify reset token."));
      }
    });
  };

  const completePasswordReset = async (token: string, newPassword: string): Promise<void> => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const email = await verifyResetToken(token);
        
        if (newPassword.length < 6) {
          setLoading(false);
          reject(new Error("Password must be at least 6 characters."));
          return;
        }

        const users = JSON.parse(localStorage.getItem("promptscore_users") || "[]");
        const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (userIndex === -1) {
          setLoading(false);
          reject(new Error("Account not found."));
          return;
        }

        // Update password
        users[userIndex].password = newPassword;
        localStorage.setItem("promptscore_users", JSON.stringify(users));

        // Revoke the token
        const tokens = JSON.parse(localStorage.getItem("promptscore_reset_tokens") || "[]");
        const remainingTokens = tokens.filter((t: any) => t.token !== token);
        localStorage.setItem("promptscore_reset_tokens", JSON.stringify(remainingTokens));

        setLoading(false);
        resolve();
      } catch (error: any) {
        setLoading(false);
        reject(error || new Error("Failed to complete password reset."));
      }
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
        resetPasswordForEmail,
        verifyResetToken,
        completePasswordReset,
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
