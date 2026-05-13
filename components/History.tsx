"use client";

import "../styles/history.css";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

export default function History() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");
  const [transcactions, setTransactions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchAccount, setSearchAccount] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // get user + role
  useEffect(() => {
    const id = localStorage.getItem("loggedInAccountId") || "";
    const role = localStorage.getItem("loggedInRole") || "";
    const admin = role.toLowerCase() === "admin";

    setIsAdmin(admin);
    if (!admin && id) setSearchAccount(id);
    else setStatus("success");
  }, []);

  // listen to transactions
  useEffect(() => {
    setStatus("processing");

    let q;

    if (isAdmin && searchAccount) {
      q = query(
        collection(db, "transcactions"),
        where("accountId", "==", searchAccount),
        orderBy("date", "desc")
      );
    } else if (isAdmin) {
      q = query(collection(db, "transcactions"), orderBy("date", "desc"));
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
        setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStatus("success");
      },
      () => {
        setStatus("error");
        setMessage("Failed to load history");
      }
    );

    return () => unsub();
  }, [isAdmin, searchAccount]);

  // search admin
  function handleSearch() {
    setSearchAccount(searchInput.trim());
  }

  // format date
  const formatDate = (d: any) =>
    d?.toDate ? d.toDate().toLocaleString() : new Date(d).toLocaleString();

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
          <button onClick={() => setSearchAccount("")}>All</button>
        </div>
      )}

      {status === "processing" && <p>Loading...</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}

      {/* list */}
      {status === "success" && (
        <div className="history-scroll-box">
          {transcactions.length === 0 ? (
            <p>No data</p>
          ) : (
            transcactions.map((tx, i) => (
              <div key={i} className="history-item">
                <b>{tx.type}</b> - ${tx.amount}
                <br />
                <small>{tx.accountId}</small>
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