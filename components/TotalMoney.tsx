"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function TotalMoney() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Accounts"), (snapshot) => {
      const sum = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + Number(data.balance || 0);
      }, 0);
      setTotal(sum);
    });

    return () => unsub(); // cleanup listener on unmount
  }, []);

  return (
    <div style={{ fontSize: 20, marginTop: 5 }}>
      Total Money:{" "}
      {total.toLocaleString("en-US", { style: "currency", currency: "USD" })}
    </div>
  );
}