"use client";

import { useEffect, useState } from "react";
import { loginWithGoogle, logout, getCurrentUser } from "@/api/api";

export default function LoginButton() {
  interface UserSession {
    name: string;
  }

  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const user = await getCurrentUser();
      setSession(user);
    };
    fetchSession();
  }, []);

  return session ? (
    <div>
      <p>Welcome, {session.name}!</p>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  ) : (
    <button onClick={() => loginWithGoogle()}>Sign in with Google</button>
  );
}
