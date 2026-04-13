"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function login() {

  const [account, setAccount] = useState<any[]>([]);
  const [userID, setUserID] = useState("")
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
        const querySnapshot = await getDocs(collection(db, "Passwords"));
        const accountList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAccount(accountList);
      };
    fetchAccount();
  }, []);


  function loginbutton () {

    let sum = 0
    for (let i=0; i < account.length; i++){
      if (userID === account[i].username && password === account[i].password) {
        localStorage.setItem("loggedInAccountId", userID);
        localStorage.setItem("loggedInRole", "admin");
        router.push("/admin1");
        return;
      }
    }
  }

  return (
    <div className="login-form">
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

      <button onClick={loginbutton}>
        Login
      </button>
    </div>
  );
}