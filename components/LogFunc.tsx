"use client"; // allows use of hooks and browser features

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [accountId, setAccountId] = useState(""); // user input
  const [password, setPassword] = useState(""); // user input
  const [loggedIn, setLoggedIn] = useState(false); // tracks login status
  const router = useRouter(); // used to navigate pages

  // check if user is already logged in
  useEffect(() => {
    const storedId = localStorage.getItem("loggedInAccountId");
    if (storedId) {
      setLoggedIn(true);
    }
  }, []);

  const login = async () => {
    // quick admin login
    if (accountId === "admin1" && password === "password") {
      localStorage.setItem("loggedInAccountId", accountId); // save login
      localStorage.setItem("loggedInRole", "admin");
      setLoggedIn(true);
      router.push("/admin1"); // go to admin page
      return;
    }

    try {
      // get account from API
      const res = await fetch(
        `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
      );

      if (!res.ok) throw new Error("Account not found");

      const account = await res.json();

      // simple password check
      if (password !== "password") {
        alert("Wrong password");
        return;
      }

      // save login info
      localStorage.setItem("loggedInAccountId", accountId);
      localStorage.setItem("loggedInRole", account.role);

      setLoggedIn(true);

      // go to correct page
      if (account.role === "admin") {
        router.push("/admin1");
      } else {
        router.push(`/accounts/${accountId}`);
      }
    } catch {
      alert("Account not found");
    }
  };

  // clear login data
  const logout = () => {
    localStorage.removeItem("loggedInAccountId");
    localStorage.removeItem("loggedInRole");
    setLoggedIn(false);
    router.push("/"); // go back to home
  };

  return (
    <div className="login-form">
      {/* if logged in, show logout */}
      {loggedIn ? (
        <>
          <p>You are logged in</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          {/* account input */}
          <input
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />

          {/* password input */}
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* login button */}
          <button onClick={login}>
            Login
          </button>
        </>
      )}
    </div>
  );
}