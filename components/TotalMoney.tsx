"use client";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";
export default function TotalMoney() {
  const [total, setTotal] = useState(0);
  useEffect(() => { // real-time listener to calculate total money across all accounts
    const unsub = onSnapshot(collection(db, "Accounts"), (snapshot) => {
      let sum = 0;
      snapshot.forEach((doc) => {
        sum += Number(doc.data()?.balance || 0);
      });
      setTotal(sum);
    });
    return () => unsub();
  }, []);
  return (
    <div>
      <div className="total-label">Total Money</div>
      <div className="total-amount">
        {total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>
    </div>
  );
}