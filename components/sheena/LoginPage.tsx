"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage({ redirectToAdmin }: { redirectToAdmin?: boolean }) {
  const [accountId, setAccountId] = useState(""); // Store account ID from input
  const [password, setPassword] = useState(""); // In real app, never store password like this. This is just for demo purposes.

  const router = useRouter();

  const login = async () => {
    try {
      const res = await fetch(
        `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}` //fetch account by ID
      );

      if (!res.ok) throw new Error();

      const account = await res.json(); // In real app, you would verify password securely on the server. This is just a demo check.

      if (password !== "password") {
        alert("Wrong password");
        return;
      }

      // Smart redirect logic
      if (account.role === "admin") { ///if account is admin, go to admin page
        router.push("/admin");
      } else {
        router.push(`/accounts/${accountId}`); //if account is not admin, go to their account page
      }

    } catch {
      alert("Account not found");
    }
  };

  return (
    <div>
      <input
        placeholder="Account ID"
        onChange={(e) => setAccountId(e.target.value)} //update accountId state on input change
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)} //update password state on input change
      />
      <button onClick={login}>Login</button>
    </div>
  );
}