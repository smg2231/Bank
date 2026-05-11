"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function TotalMoney() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Accounts"),
      (snapshot) => {
        let sum = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const balance = parseFloat(data?.balance);

          if (!isNaN(balance)) {
            sum += balance;
          }
        });

        setTotal(sum);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ fontSize: 20, marginTop: 5 }}>
      Total Money:{" "}
      {total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}
    </div>
  );
}