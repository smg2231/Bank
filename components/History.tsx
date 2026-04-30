"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function History() {
  const router = useRouter();

  const [status, setStatus] = useState<
    "processing" | "success" | "error"
  >("processing");

  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const loadAllTransactions = async () => {
      try {
        const snap = await getDocs(collection(db, "transcactions"));

        const allTransactions = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // sort newest first
        allTransactions.sort((a: any, b: any) => {
          const aDate = a.date?.seconds ? a.date.seconds * 1000 : a.date;
          const bDate = b.date?.seconds ? b.date.seconds * 1000 : b.date;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

        setTransactions(allTransactions);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Failed to load transaction history.");
      }
    };

    loadAllTransactions();
  }, []);

  // ✅ FIXED TRANSFER FILTER
  const transferTransactions = transactions.filter(
    (t) =>
      t.type === "transfer-in" ||
      t.type === "transfer-out"
  );

  // ✅ CLEAN LABELS
  const formatType = (type: string) => {
    switch (type) {
      case "transfer-in":
        return "Transfer In";
      case "transfer-out":
        return "Transfer Out";
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      default:
        return type;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>All Transactions</h2>

      {status === "processing" && <p>Loading...</p>}

      {status === "error" && (
        <>
          <p>{message}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </>
      )}

      {status === "success" && transactions.length === 0 && (
        <p>No transactions found.</p>
      )}

      {/* ===== TRANSFERS ===== */}
      {status === "success" && transferTransactions.length > 0 && (
        <>
          <h3>Transfer History</h3>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <ul>
              {transferTransactions.map((t) => (
                <li key={t.id} style={{ marginBottom: "10px" }}>
                  <strong>{formatType(t.type)}</strong> — ${t.amount} <br />
                  Account: {t.accountId} <br />
                  Date:{" "}
                  {new Date(
                    t.date?.seconds ? t.date.seconds * 1000 : t.date
                  ).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* ===== ALL ACTIVITY ===== */}
      {status === "success" && transactions.length > 0 && (
        <>
          <h3>All Activity</h3>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <ul>
              {transactions.map((t) => (
                <li key={t.id} style={{ marginBottom: "10px" }}>
                  <strong>{formatType(t.type)}</strong> — ${t.amount} <br />
                  Account: {t.accountId} <br />
                  Date:{" "}
                  {new Date(
                    t.date?.seconds ? t.date.seconds * 1000 : t.date
                  ).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}