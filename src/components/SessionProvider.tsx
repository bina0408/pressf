"use client";

import { ReactNode, useEffect, useState } from "react";
import { getCurrentUser } from "@/api/api";
import { logout } from "@/api/api";


interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  interface Session {
    name: string;
    // Add other properties of the session object here
  }

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const user = await getCurrentUser();
      setSession(user);
    };
    fetchSession();
  }, []);

  return (
    <div>
      {children}
      {session && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          Welcome, {session.name}!
          <button onClick={() => logout()}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
