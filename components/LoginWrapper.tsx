"use client";

import { usePathname } from "next/navigation";
import Login from "@/components/Login";

export default function LoginWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return <Login />;
}


//this is so login can hide on admin pages, and show on non-admin pages. couldnt figure out other way