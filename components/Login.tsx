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
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => { //check for existing session on component mount
    const id = localStorage.getItem("loggedInUserId");
    setIsLoggedIn(!!id);
  }, []);
  useEffect(() => {
    if (open) setVisible(true);
    else setTimeout(() => setVisible(false), 200);
  }, [open]);
  async function loginbutton() { //handles login logic
    const cleanUsername = userID.trim();
    const cleanPassword = password.trim();
    if (!cleanUsername || !cleanPassword) {
      alert("Enter username and password");
      return;
    }
    try { //query for user with matching username
      const q = query(
        collection(db, "Users"),
        where("username", "==", cleanUsername)
      ); //assumes usernames are unique
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("User not found");
        return;
      } //validate password
      const userDoc = snap.docs[0];
      const userData = userDoc.data();
      if (cleanPassword !== userData.password) {
        alert("Incorrect password");
        return;
      }
      //saves user info to local storage for session persistence
      localStorage.setItem("loggedInUserId", userDoc.id);
      localStorage.setItem("loggedInAccountId", userDoc.id); // FIX
      localStorage.setItem(
        "loggedInRole",
        userData.role?.trim().toLowerCase() || "user"
      );
      setIsLoggedIn(true);
      setOpen(false);
      //routing based on role
      if (userData.role?.trim().toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }
  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  }
  return (
    <div className="login-container">
      {isLoggedIn ? (
        <button className="login-toggle" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <button onClick={() => setOpen(!open)} className="login-toggle">
            Login
          </button>
          {visible && (
            <div className={`login-dropdown ${open ? "open" : "close"}`}>
              <input
                placeholder="Username"
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
        </>
      )}
    </div>
  );
}