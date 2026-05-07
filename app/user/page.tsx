"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "../../styles/admin.css";

export default function UserPage() {
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem("loggedInAccountId");

      if (!userId) {
        window.location.href = "/";
        return;
      }

      try {
        // GET ACCOUNT (direct lookup)
        const accRef = doc(db, "Accounts", userId);
        const accSnap = await getDoc(accRef);

        if (!accSnap.exists()) {
          alert("Account not found");
          return;
        }

        const accData = {
          id: accSnap.id,
          ...accSnap.data(),
        };

        setAccount(accData);

        // GET TRANSACTIONS
        const transSnap = await getDocs(collection(db, "transcactions"));

        const userTransactions = transSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((t: any) => t.accountId === userId); //IMPORTANT CHANGE

        // sort newest first
        userTransactions.sort((a: any, b: any) => {
          const aDate = a.date?.seconds ? a.date.seconds * 1000 : a.date;
          const bDate = b.date?.seconds ? b.date.seconds * 1000 : b.date;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

        setTransactions(userTransactions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error loading data");
      }
    };

    loadUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-text">User Panel</h2>

        <div className="admin-text">
          Balance:
          <br />
         <strong>
  {Number(account.balance).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })}
</strong>
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

      <section className="admin-content">
        <h1 className="admin-text">Welcome, {account.id}</h1>

        <h3>Your Transactions</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <ul>
              {transactions.map((t) => (
                <li key={t.id} style={{ marginBottom: "10px" }}>
                  <strong>{t.type}</strong> — ${t.amount}
                  <br />
                  Date:{" "}
                  {new Date(
                    t.date?.seconds ? t.date.seconds * 1000 : t.date
                  ).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}