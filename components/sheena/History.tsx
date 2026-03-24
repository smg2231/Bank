"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const router = useRouter();

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const loadAllTransactions = async () => {
      try {
        const res = await fetch(
          "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account"
        );

        if (!res.ok) {
          setStatus("error");
          setMessage("Failed to fetch accounts.");
          return;
        }

        const accounts = await res.json();

        // Combine all transactions from all accounts
        const allTransactions = accounts.flatMap((account: any) =>
          (account.transactions || []).map((t: any) => ({
            ...t,
            accountId: account.id,
          }))
        );

        // Sort newest first
        allTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

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

  // Separate transfer transactions
  const transferTransactions = transactions.filter(
    (t) => t.type === "transfer"
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>All Transactions</h2>

      {/* Loading */}
      {status === "processing" && <p>Loading...</p>}

      {/* Error */}
      {status === "error" && (
        <>
          <p>{message}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </>
      )}

      {/* No transactions */}
      {status === "success" && transactions.length === 0 && (
        <p>No transactions found.</p>
      )}

      {/* Transfer History Section */}
      {status === "success" && transferTransactions.length > 0 && (
        <>
          <h3>Transfer History</h3>
          <ul>
            {transferTransactions.map((t, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>TRANSFER</strong> — ${t.amount} <br />
                Account: {t.accountId} <br />
                Date: {new Date(t.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Full Transaction list */}
      {status === "success" && transactions.length > 0 && (
        <>
          <h3>All Activity</h3>
          <ul>
            {transactions.map((t, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>{t.type.toUpperCase()}</strong> — ${t.amount} <br />
                Account: {t.accountId} <br />
                Date: {new Date(t.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}