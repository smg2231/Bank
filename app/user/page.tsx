"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import "../../styles/admin.css";

export default function UserPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  // ================= LOAD ACCOUNTS =================
  useEffect(() => {
    async function loadUserData() {
      const userId = localStorage.getItem("loggedInUserId");

      if (!userId) {
        window.location.href = "/";
        return;
      }

      const q = query(
        collection(db, "Accounts"),
        where("accountOwnerID", "==", userId)
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAccounts(list);
      setLoading(false);
    }

    loadUserData();
  }, []);

  // ================= LOAD TRANSACTIONS =================
  useEffect(() => {
    if (accounts.length === 0) return;

    const unsubscribes: any[] = [];

    accounts.forEach((account) => {
      const q = query(
        collection(db, "transcactions"),
        where("accountId", "==", account.id)
      );

      const unsub = onSnapshot(q, (snap) => {
        setTransactions((prev) => ({
          ...prev,
          [account.id]: snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        }));
      });

      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach((u) => u());
  }, [accounts]);

  // 🧠 TOTAL BALANCE CALC
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  if (loading) return <p>Loading...</p>;

  return (
    <main className="admin-container">

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <h2>My Accounts</h2>

        {/* 🔥 TOTAL BALANCE RIGHT UNDER TITLE */}
        <div className="total-money-card">
          <div className="total-label">Total Balance</div>

          <div className="total-amount">
            {totalBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>

        <button
          className="admin-button logout"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </aside>

      {/* ================= CONTENT ================= */}
      <section className="admin-content">
        <h1>Welcome</h1>

        {accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          accounts.map((account) => (
            <div key={account.id}>
              <h3>{account.type || "Account"}</h3>

              <p>
                Balance:{" "}
                <strong>
                  {Number(account.balance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </p>

              <div>
                <h4>Transactions</h4>

                {transactions[account.id]?.length > 0 ? (
                  transactions[account.id].map((t) => (
                    <div key={t.id}>
                      <b>{t.type}</b> — ${t.amount}
                      <br />
                      <small>
                        {t.date?.toDate?.()?.toLocaleString?.() || "Pending"}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No transactions</p>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}