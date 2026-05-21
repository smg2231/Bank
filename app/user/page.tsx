"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../../styles/admin.css";
import "../../styles/teller.css";
export default function UserPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  //transfer states and handlers
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmt, setTransferAmt] = useState<number>(0);
  //loading user accounts on page load
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
  // loading transactions for each account
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
    })
    return () => unsubscribes.forEach((u) => u());
  }, [accounts]);
  // transfer handling
  async function handleTransfer() {
    if (!transferFrom || !transferTo)
      return alert("Select both accounts");
    if (transferFrom === transferTo)
      return alert("Cannot transfer to the same account");
    if (transferAmt <= 0)
      return alert("Enter a valid amount");
    const fromAcc = accounts.find((a) => a.id === transferFrom);
    if (!fromAcc || Number(fromAcc.balance) < transferAmt)
      return alert("Insufficient funds");
    const userId = localStorage.getItem("loggedInUserId") || "unknown";
    const fromRef = doc(db, "Accounts", transferFrom);
    const toRef   = doc(db, "Accounts", transferTo);
    await updateDoc(fromRef, { balance: increment(-transferAmt) });
    await updateDoc(toRef,   { balance: increment(transferAmt) });
    await addDoc(collection(db, "transcactions"), {
      type: "transfer-out",
      amount: transferAmt,
      accountId: transferFrom,
      userId,
      date: serverTimestamp(),
    });
    await addDoc(collection(db, "transcactions"), {
      type: "transfer-in",
      amount: transferAmt,
      accountId: transferTo,
      userId,
      date: serverTimestamp(),
    });
    alert("Transfer successful");
    setTransferAmt(0);
    // Refresh accounts to show updated balances
    const q = query(
      collection(db, "Accounts"),
      where("accountOwnerID", "==", userId)
    );
    const snap = await getDocs(q);
    setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  //total balance
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );
  if (loading) return <p>Loading...</p>;
  return (
    <main className="admin-container">
      {/*side bar*/}
      <aside className="admin-sidebar">
        <h2>My Accounts</h2>
        {/* TOTAL BALANCE */}
        <div className="total-money-card">
          <div className="total-label">Total Balance</div>
          <div className="total-amount">
            {totalBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        {/* TRANSFER TOGGLE — only show if user has 2+ accounts */}
        {accounts.length >= 2 && (
          <button
            className={`admin-button ${showTransfer ? "active" : ""}`}
            onClick={() => setShowTransfer(!showTransfer)}
          >
            ⇄ Transfer
          </button>
        )}
        {/* TRANSFER FORM */}
        {showTransfer && accounts.length >= 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <select
              className="teller-select"
              value={transferFrom}
              onChange={(e) => setTransferFrom(e.target.value)}
            >
              <option value="">From</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type || a.id} ($
                  {Number(a.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                  )
                </option>
              ))}
            </select>
            <select
              className="teller-select"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            >
              <option value="">To</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type || a.id} ($
                  {Number(a.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                  )
                </option>
              ))}
            </select>
            <input
              className="teller-input"
              type="number"
              placeholder="Amount"
              value={transferAmt || ""}
              onChange={(e) => setTransferAmt(Number(e.target.value))}
            />
            <button className="teller-button" onClick={handleTransfer}>
              Confirm Transfer
            </button>
          </div>
        )}
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

      {/*user page content*/}
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