"use client";

import { useAuth } from "@/app/contexts/AuthContext";

export function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <button
      onClick={user ? signOut : signInWithGoogle}
      className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
    >
      {user ? "Sign Out" : "Sign in with Google"}
    </button>
  );
} 