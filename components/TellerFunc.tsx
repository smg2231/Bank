"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import {
  collection,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import "../styles/teller.css";
type Props = {
  type: "deposit" | "withdraw" | "transfer" | "history";
};
export default function TellerFunc({ type }: Props) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selected, setSelected] = useState({ from: "", to: "" });
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  // load accounts on page load and listen for changes
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Accounts"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setAccounts(list);
      if (!selected.from && list.length > 0) {
        setSelected((prev) => ({
          ...prev,
          from: list[0].id,
          to: list[0].id,
        }));
      }
    });
    return () => unsub();
  }, []);

  //transaction history listener (only for history page)
  useEffect(() => {
    if (type !== "history") return;
    const unsub = onSnapshot(collection(db, "transcactions"), (snapshot) => {
      setTransactions(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
    return () => unsub();
  }, [type]);
  const logTransaction = async (data: any) => {
    await addDoc(collection(db, "transcactions"), {
      ...data,
      date: serverTimestamp(),
    });
  };
  // handles submit for all transaction types
  const handleSubmit = async () => {
    if (amount <= 0) {
      alert("Enter valid amount");
      return;
    }
    const userId = localStorage.getItem("loggedInAccountId") || "unknown";

    //transfer logic
    if (type === "transfer") {
      if (!selected.from || !selected.to) return alert("Select accounts");

      if (selected.from === selected.to)
        return alert("Cannot transfer to same account");
      const fromAcc = accounts.find((a) => a.id === selected.from);
      if (!fromAcc) return alert("Account not found");
      if (Number(fromAcc.balance) < amount)
        return alert("Insufficient funds");
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
    //deposit/withdraw logic
    if (!selected.from) return alert("Select account");
    const account = accounts.find((a) => a.id === selected.from);
    if (!account) return alert("Account not found");
    const ref = doc(db, "Accounts", selected.from);
    if (type === "withdraw") {
      if (Number(account.balance) < amount)
        return alert("Insufficient funds");
      await updateDoc(ref, { balance: increment(-amount) });
      await logTransaction({
        type: "withdrawal",
        amount,
        accountId: selected.from,
        userId,
      });
      alert("Withdrawal successful");
    }
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
  };
  // transaction history UI
  if (type === "history") {
    return (
      <div className="teller-container">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t.id}>
                <b>{t.type}</b> — ${t.amount}
                <br />
                Account: {t.accountId}
                <br />
                {t.date?.toDate?.()?.toLocaleString?.() || "Pending"}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  // deposit/withdraw/transfer UI
  return (
    <div className="teller-container">
      <h2>
        {type === "deposit"
          ? "Deposit"
          : type === "withdraw"
          ? "Withdraw"
          : "Transfer"}
      </h2>
      {type === "transfer" ? (
        <>
          <select
            className="teller-select"
            value={selected.from}
            onChange={(e) =>
              setSelected({ ...selected, from: e.target.value })
            }
          >
            <option value="">From</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} (${a.balance})
              </option>
            ))}
          </select>
          <select
            className="teller-select"
            value={selected.to}
            onChange={(e) =>
              setSelected({ ...selected, to: e.target.value })
            }
          >
            <option value="">To</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} (${a.balance})
              </option>
            ))}
          </select>
        </>
      ) : (
        <select
          className="teller-select"
          value={selected.from}
          onChange={(e) =>
            setSelected({ ...selected, from: e.target.value })
          }
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.id} (${a.balance})
            </option>
          ))}
        </select>
      )}
      <input
        className="teller-input"
        type="number"
        placeholder="Enter amount"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button className="teller-button" onClick={handleSubmit}>
        {type}
      </button>
    </div>
  );
}