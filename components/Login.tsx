"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (open) setVisible(true);
    else setTimeout(() => setVisible(false), 200);
  }, [open]);

  async function loginbutton() {
    const cleanUserID = userID.trim();
    const cleanPassword = password.trim();

    if (!cleanUserID || !cleanPassword) {
      alert("Enter user ID and password");
      return;
    }

    try {
      const userRef = doc(db, "Users", cleanUserID);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("Invalid login (user not found)");
        return;
      }

      const acc = userSnap.data();

      if (cleanPassword !== acc.password) {
        alert("Invalid login (wrong password)");
        return;
      }

      // store session
      localStorage.setItem("loggedInAccountId", cleanUserID);
      localStorage.setItem("loggedInRole", acc.role || "user");

      // routing (unchanged)
      if (acc.role === "admin") {
        router.push("/admin1");
      } else {
        router.push("/user");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  }

  return (
    <div className="login-container">
      <button onClick={() => setOpen(!open)} className="login-toggle">
        Login
      </button>

      {visible && (
        <div className={`login-dropdown ${open ? "open" : "close"}`}>
          <input
            placeholder="User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={loginbutton}>Submit</button>
        </div>
      )}
    </div>
  );
}