"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    if (accountId === "admin1" && password === "password") {
      localStorage.setItem("loggedInAccountId", accountId);
      localStorage.setItem("loggedInRole", "admin");
      router.push("/admin1/page");
      return;
    }

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

      if (account.role === "admin") {
        router.push("/admin");
      } else {
        router.push(`/accounts/${accountId}`);
      }
    } catch {
      alert("Account not found");
    }
  };

  return (
    <div className="login-form">
      <input
        placeholder="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}