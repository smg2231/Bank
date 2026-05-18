"use client";
import "../styles/history.css";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
export default function History() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");
  const [transcactions, setTransactions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchAccount, setSearchAccount] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // get user
  useEffect(() => {
    const id = localStorage.getItem("loggedInAccountId") || "";
    const role = localStorage.getItem("loggedInRole") || "";
    const admin = role.toLowerCase() === "admin";
    setIsAdmin(admin);
    if (!admin && id) {
      setSearchAccount(id);
    } else {
      setStatus("success");
    }
  }, []);
  // load history
  useEffect(() => {
    if (!isAdmin && !searchAccount) return;
    setStatus("processing");
    let q;
    if (isAdmin && searchAccount) {
      q = query(
        collection(db, "transcactions"),
        where("accountId", "==", searchAccount),
        orderBy("date", "desc")
      );
    } else if (isAdmin) {
      q = query(
        collection(db, "transcactions"),
        orderBy("date", "desc")
      );
    } else {
      q = query(
        collection(db, "transcactions"),
        where("accountId", "==", searchAccount),
        orderBy("date", "desc")
      );
    }
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTransactions(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
        setStatus("success");
      },
      (error) => {
        console.error(error);
        setStatus("error");
        setMessage(error.message || "Failed to load history");
      }
    );
    return () => unsub();
  }, [isAdmin, searchAccount]);
  // admin search
  function handleSearch() {
    setSearchAccount(searchInput.trim());
  }
  // format date
  const formatDate = (d: any) => {
    if (!d) return "No date";
    return d?.toDate
      ? d.toDate().toLocaleString()
      : new Date(d).toLocaleString();
  };
  return (
    <div className="history-container">
      <h2>History</h2>
      {/* admin tools */}
      {isAdmin && (
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            className="history-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Account ID"
          />
          <button onClick={handleSearch}>Search</button>
          <button
            onClick={() => {
              setSearchInput("");
              setSearchAccount("");
            }}
          >
            All
          </button>
        </div>
      )}
      {/* loading */}
      {status === "processing" && <p>Loading...</p>}
      {/* error */}
      {status === "error" && (
        <p style={{ color: "red" }}>{message}</p>
      )}
      {/* list */}
      {status === "success" && (
        <div className="history-scroll-box">
          {transcactions.length === 0 ? (
            <p>No data</p>
          ) : (
            transcactions.map((tx) => (
              <div key={tx.id} className="history-item">
                <b>{tx.type || "Unknown"}</b> - ${tx.amount || 0}
                <br />
                <small>{tx.accountId || "No account"}</small>
                <br />
                <small>{formatDate(tx.date)}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}