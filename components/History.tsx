"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function History() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "transcactions"),
      (snapshot) => {
        const allTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        allTransactions.sort((a: any, b: any) => {
          const aDate = a.date?.seconds ? a.date.seconds * 1000 : a.date;
          const bDate = b.date?.seconds ? b.date.seconds * 1000 : b.date;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

        setTransactions(allTransactions);
        setStatus("success");
      },
      (err) => {
        console.error(err);
        setStatus("error");
        setMessage("Failed to load transaction history.");
      }
    );

    return () => unsub();
  }, []);

  // ... rest of your JSX unchanged
}