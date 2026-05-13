"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Login() {
  const [userID, setUserID] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [visible, setVisible] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const router = useRouter();

  // sync login state on load
  useEffect(() => {
    const id = localStorage.getItem(
      "loggedInAccountId"
    );

    setIsLoggedIn(!!id);
  }, []);

  // dropdown animation
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setTimeout(
        () => setVisible(false),
        200
      );
    }
  }, [open]);

  // LOGIN
  async function loginbutton() {
    const cleanUsername =
      userID.trim();

    const cleanPassword =
      password.trim();

    if (
      !cleanUsername ||
      !cleanPassword
    ) {
      alert("Enter username and password");
      return;
    }

    try {
      // find user
      const q = query(
        collection(db, "Users"),
        where(
          "username",
          "==",
          cleanUsername
        )
      );

      const snap =
        await getDocs(q);

      if (snap.empty) {
        alert("User not found");
        return;
      }

      const userDoc =
        snap.docs[0];

      const acc =
        userDoc.data();

      // password check
      if (
        cleanPassword !==
        acc.password
      ) {
        alert(
          "Incorrect password"
        );

        return;
      }

      // USE FIRESTORE DOC ID
      localStorage.setItem(
        "loggedInAccountId",
        userDoc.id
      );

      // save role
      localStorage.setItem(
        "loggedInRole",
        acc.role || "user"
      );

      setIsLoggedIn(true);

      setOpen(false);

      // redirect
      if (
        acc.role
          ?.trim()
          .toLowerCase() ===
        "admin"
      ) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert("Login failed");
    }
  }

  // LOGOUT
  function logout() {
    localStorage.removeItem(
      "loggedInAccountId"
    );

    localStorage.removeItem(
      "loggedInRole"
    );

    setIsLoggedIn(false);

    router.push("/");
  }

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <button
          className="login-toggle"
          onClick={logout}
        >
          Logout
        </button>
      ) : (
        <>
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="login-toggle"
          >
            Login
          </button>

          {visible && (
            <div
              className={`login-dropdown ${
                open
                  ? "open"
                  : "close"
              }`}
            >
              <input
                placeholder="Username"
                value={userID}
                onChange={(e) =>
                  setUserID(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                onClick={
                  loginbutton
                }
              >
                Submit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}