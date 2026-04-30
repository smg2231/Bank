"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/teller.css";

type Props = {
  type: "deposit" | "withdraw" | "transfer" | "history";
};

export default function TellerFunc({ type }: Props) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selected, setSelected] = useState({ from: "", to: "" });
  const [amount, setAmount] = useState<number>(0);

  // HISTORY STATE
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const snap = await getDocs(collection(db, "Accounts"));
      setAccounts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    fetchAccounts();
  }, []);

  // ===== LOAD HISTORY =====
  useEffect(() => {
    if (type !== "history") return;

    const fetchHistory = async () => {
      const snap = await getDocs(collection(db, "transcactions"));

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTransactions(data);
    };

    fetchHistory();
  }, [type]);

  const logTransaction = async (data: any) => {
    await addDoc(collection(db, "transcactions"), {
      ...data,
      date: serverTimestamp(),
    });
  };

  const handleSubmit = async () => {
    if (amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const userId = localStorage.getItem("loggedInAccountId") || "unknown";

    // ===== TRANSFER =====
    if (type === "transfer") {
      if (!selected.from || !selected.to) {
        alert("Select both accounts");
        return;
      }

      if (selected.from === selected.to) {
        alert("Cannot transfer to same account");
        return;
      }

      const fromRef = doc(db, "Accounts", selected.from);
      const toRef = doc(db, "Accounts", selected.to);

      await updateDoc(fromRef, { balance: increment(-amount) });
      await updateDoc(toRef, { balance: increment(amount) });

      await logTransaction({
        type: "transfer-out",
        amount,
        accountId: selected.from,
        userId,
      });

      await logTransaction({
        type: "transfer-in",
        amount,
        accountId: selected.to,
        userId,
      });

      alert("Transfer successful");
      return;
    }

    // ===== DEPOSIT / WITHDRAW =====
    if (!selected.from) {
      alert("Select account");
      return;
    }

    const ref = doc(db, "Accounts", selected.from);

    if (type === "deposit") {
      await updateDoc(ref, { balance: increment(amount) });

      await logTransaction({
        type: "deposit",
        amount,
        accountId: selected.from,
        userId,
      });

      alert("Deposit successful");
    }

    if (type === "withdraw") {
      await updateDoc(ref, { balance: increment(-amount) });

      await logTransaction({
        type: "withdrawal",
        amount,
        accountId: selected.from,
        userId,
      });

      alert("Withdrawal successful");
    }
  };

  // ================= HISTORY VIEW =================
  if (type === "history") {
    return (
      <div className="teller-container">
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <ul>
              {transactions.map((t, i) => (
                <li key={i} style={{ marginBottom: "10px" }}>
                  <strong>{t.type?.toUpperCase()}</strong> — ${t.amount}
                  <br />
                  Account: {t.accountId}
                  <br />
                  Date: {t.date?.toDate?.()?.toLocaleString?.() || "Pending"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ================= NORMAL UI =================
  return (
    <div className="teller-container">
      <h2>
        {type === "deposit"
          ? "Deposit Funds"
          : type === "withdraw"
          ? "Withdraw Funds"
          : "Transfer Funds"}
      </h2>

      {type === "transfer" ? (
        <>
          <label className="teller-label">From:</label>
          <select
            className="teller-select"
            value={selected.from}
            onChange={(e) =>
              setSelected({ ...selected, from: e.target.value })
            }
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.id} (${acc.balance})
              </option>
            ))}
          </select>

          <label className="teller-label">To:</label>
          <select
            className="teller-select"
            value={selected.to}
            onChange={(e) =>
              setSelected({ ...selected, to: e.target.value })
            }
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.id} (${acc.balance})
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label className="teller-label">Account:</label>
          <select
            className="teller-select"
            value={selected.from}
            onChange={(e) =>
              setSelected({ ...selected, from: e.target.value })
            }
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.id} (${acc.balance})
              </option>
            ))}
          </select>
        </>
      )}

      <label className="teller-label">Amount:</label>
      <input
        style={{ width: "96%" }}
        className="teller-input"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button className="teller-button" onClick={handleSubmit}>
        {type === "deposit"
          ? "Deposit"
          : type === "withdraw"
          ? "Withdraw"
          : "Transfer"}
      </button>
    </div>
  );
}