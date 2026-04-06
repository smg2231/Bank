"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    // Hardcoded admin1 login
    if (accountId === "admin1" && password === "password") {
      localStorage.setItem("loggedInAccountId", accountId);
      localStorage.setItem("loggedInRole", "admin");
      router.push("/admin1/page"); // go to admin page
      return;
    }

    // Otherwise, try regular account from API
    try {
      const res = await fetch(
        `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
      );

      if (!res.ok) throw new Error("Account not found");

      const account = await res.json();

      if (password !== "password") {
        alert("Wrong password");
        return;
      }

      localStorage.setItem("loggedInAccountId", accountId);
      localStorage.setItem("loggedInRole", account.role);

      // Redirect based on role
      if (account.role === "admin") {
        router.push("/admin"); // other admins
      } else {
        router.push(`/accounts/${accountId}`); // regular user
      }
    } catch {
      alert("Account not found");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <input
        placeholder="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        className="border px-4 py-2 rounded"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded"
      />
      <button
        onClick={login}
        className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-400"
      >
        Login
      </button>
    </div>
  );
}