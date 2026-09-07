import React, { createContext, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/supabase";
import { toast } from "sonner";

// InsForge user shape (only the fields the app reads).
export interface AuthUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithOtp: async () => { },
  verifyOtp: async () => { },
  logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Hydrate the current user on startup. In SPA mode the SDK rehydrates the
    // session from the httpOnly refresh cookie, so `user` may briefly be null.
    insforge.auth.getCurrentUser()
      .then(({ data, error }) => {
        if (cancelled) return;
        setUser(error ? null : ((data?.user as AuthUser) ?? null));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Auth session check failed:", error);
        if (!cancelled) setLoading(false);
      });

    // React to sign-in / sign-out that happen elsewhere in the app.
    const unsubscribe = insforge.auth.onAuthStateChange(() => {
      insforge.auth.getCurrentUser().then(({ data, error }) => {
        if (cancelled) return;
        setUser(error ? null : ((data?.user as AuthUser) ?? null));
        setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const loginWithOtp = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await insforge.auth.signInWithOtp({ email });

      if (error) throw error;
      toast.success("OTP sent!", {
        description: "Check your email for the verification code.",
      });
    } catch (error: any) {
      console.error("Login error:", error);

      // Smart Handling: If rate limit exceeded, user likely already has a valid OTP.
      // We allow them to proceed to the OTP step to enter the code they have.
      if (error.message?.toLowerCase().includes("rate limit") ||
          error.message?.toLowerCase().includes("too many requests") ||
          error.statusCode === 429 ||
          error.status === 429) {

        toast.info("OTP already sent recently", {
          description: "Please check your email for the code sent a moment ago. Rate limit exceeded for new codes.",
        });
        // We do NOT throw here, effectively treating it as a "success" so the UI moves to the next step
        return;
      }

      toast.error("Failed to send OTP", {
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setLoading(true);
      const { data, error } = await insforge.auth.verifyOtp({
        email,
        otp: token,
      });

      if (error) throw error;

      // verifyOtp saves the session automatically and returns the user.
      setUser((data?.user as AuthUser) ?? null);

      toast.success("Login successful!", {
        description: "Welcome back to Saree Sutra.",
      });
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Invalid OTP", {
        description: "Please check the code and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await insforge.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
