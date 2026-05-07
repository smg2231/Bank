"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Login from "@/components/Login";

export default function LoginWrapper() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("loggedInAccountId");
      setUserId(stored && stored !== "null" && stored !== "undefined" ? stored : null);
    };

    checkUser();
    setMounted(true);

    window.addEventListener("authChanged", checkUser);
    return () => window.removeEventListener("authChanged", checkUser);
  }, []);

  // Pages where Login should be hidden when logged in
  const protectedPaths = ["/admin", "/user"];
  const isProtectedPage = protectedPaths.some(path => pathname.startsWith(path));

  // Only hide on protected pages when logged in
  if (mounted && userId && isProtectedPage) return null;

  return <Login />;
}