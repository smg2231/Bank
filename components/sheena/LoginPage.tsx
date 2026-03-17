"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");
  const router = useRouter();

  const login = async () => {
    if (!accountId || !password) {
      setColor("red");
      setMessage("Enter account ID and password");
      return;
    }

    try {
      const res = await fetch(
        `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
      );
      if (!res.ok) throw new Error("Account not found");

      const account = await res.json();

      if (password === "password") {
        setColor("green");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          router.push(`/admin1?id=${account.id}`);
        }, 800);
      } else {
        setColor("red");
        setMessage("Incorrect password");
      }
    } catch {
      setColor("red");
      setMessage("Account not found");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          onClick={login}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-3 text-center" style={{ color }}>
          {message}
        </p>
      </div>
    </div>
  );
}