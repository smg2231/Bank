"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Login() {
  const [account, setAccount] = useState<any[]>([]);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
      const querySnapshot = await getDocs(collection(db, "Passwords"));
      const accountList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccount(accountList);
    };
    fetchAccount();
  }, []);

  // animation control
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 200);
    }
  }, [open]);

  function loginbutton() {
    for (let i = 0; i < account.length; i++) {
      if (
        userID === account[i].username &&
        password === account[i].password
      ) {
        localStorage.setItem("loggedInAccountId", userID);
        localStorage.setItem("loggedInRole", "admin");
        router.push("/admin1");
        return;
      }
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
            placeholder="Account ID"
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