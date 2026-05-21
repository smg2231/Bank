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
  const [status, setStatus] = useState("processing");//load state
  const [message, setMessage] = useState("");//error msg
  const [transcactions, setTransactions] = useState<any[]>([]);//tx list
  const [isAdmin, setIsAdmin] = useState(false);//admin check
  const [searchAccount, setSearchAccount] = useState("");//active search id
  const [searchInput, setSearchInput] = useState("");//input field
  //get user role + default account
  useEffect(() => {
    const id = localStorage.getItem("loggedInAccountId") || "";//user id
    const role = localStorage.getItem("loggedInRole") || "";//role
    const admin = role.toLowerCase() === "admin";//check admin
    setIsAdmin(admin);//set role
    if (!admin && id) {
      setSearchAccount(id);//force user own history
    } else {
      setStatus("success");//admin starts ready
    }
  }, []);
  //load transactions from firestore
  useEffect(() => {
    if (!isAdmin && !searchAccount) return;//wait for id
    setStatus("processing");//loading
    let q;
    //admin searching specific account
    if (isAdmin && searchAccount) {
      q = query(
        collection(db, "transcactions"),
        where("accountId", "==", searchAccount),
        orderBy("date", "desc")
      );
    //admin viewing all
    } else if (isAdmin) {
      q = query(
        collection(db, "transcactions"),
        orderBy("date", "desc")
      );
    //user viewing own history
    } else {
      q = query(
        collection(db, "transcactions"),
        where("accountId", "==", searchAccount),
        orderBy("date", "desc")
      );
    }
    //real-time listener
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTransactions(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
        setStatus("success");//done
      },
      (error) => {
        console.error(error);//log error
        setStatus("error");//fail state
        setMessage(error.message || "Failed to load history");
      }
    );
    return () => unsub();//cleanup listener
  }, [isAdmin, searchAccount]);
  //admin search trigger
  function handleSearch() {
    setSearchAccount(searchInput.trim());//apply search
  }
  //format firestore date
  const formatDate = (d: any) => {
    if (!d) return "No date";//empty check
    return d?.toDate
      ? d.toDate().toLocaleString()
      : new Date(d).toLocaleString();
  };
  return (
    <div className="history-container">
      <h2>History</h2>
      {/* admin search controls */}
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
          <button onClick={() => {
            setSearchInput("");//clear input
            setSearchAccount("");//reset filter
          }}>
            All
          </button>
        </div>
      )}
      {/* loading state */}
      {status === "processing" && <p>Loading...</p>}
      {/* error state */}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
      {/* transaction list */}
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