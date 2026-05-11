"use client";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import {
  doc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

export default function History() {
  const [status, setStatus] = useState<
    "processing" | "success" | "error"
  >("processing");

  const [message, setMessage] = useState("");

  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [searchAccount, setSearchAccount] =
    useState("");

  // load user + role
  useEffect(() => {
    const id =
      localStorage.getItem("loggedInAccountId");

    const role =
      localStorage.getItem("loggedInRole");

    const admin =
      role?.toLowerCase() === "admin";

    setIsAdmin(admin);

    // normal user auto-loads account
    if (!admin && id) {
      setSearchAccount(id);
    }

    // admin starts empty
    if (admin) {
      setStatus("success");
    }
  }, []);

  // load account transactions
  useEffect(() => {
    // admin can stay empty
    if (!searchAccount) {
      if (isAdmin) {
        setTransactions([]);
        setStatus("success");
      }

      return;
    }

    setStatus("processing");

    const unsub = onSnapshot(
      doc(db, "Accounts", searchAccount),
      (snapshot) => {
        if (!snapshot.exists()) {
          setStatus("error");
          setMessage("Account not found");
          setTransactions([]);
          return;
        }

        const data = snapshot.data();

        let tx =
          data?.transactions ||
          data?.transcactions ||
          [];

        tx = tx.sort((a: any, b: any) => {
          const aDate = a.date?.seconds
            ? a.date.seconds * 1000
            : new Date(a.date).getTime();

          const bDate = b.date?.seconds
            ? b.date.seconds * 1000
            : new Date(b.date).getTime();

          return bDate - aDate;
        });

        setTransactions(tx);
        setStatus("success");
      },
      (err) => {
        console.error(err);

        setStatus("error");
        setMessage(
          "Failed to load transaction history."
        );
      }
    );

    return () => unsub();
  }, [searchAccount, isAdmin]);

  // admin view all
  async function loadAllAccounts() {
    try {
      setStatus("processing");

      const snap = await getDocs(
        collection(db, "Accounts")
      );

      const all: any[] = [];

      snap.forEach((docSnap) => {
        const data = docSnap.data();

        const tx =
          data.transactions ||
          data.transcactions ||
          [];

        tx.forEach((t: any) => {
          all.push({
            ...t,
            accountID: docSnap.id,
          });
        });
      });

      all.sort((a: any, b: any) => {
        const aDate = a.date?.seconds
          ? a.date.seconds * 1000
          : new Date(a.date).getTime();

        const bDate = b.date?.seconds
          ? b.date.seconds * 1000
          : new Date(b.date).getTime();

        return bDate - aDate;
      });

      setTransactions(all);
      setStatus("success");
    } catch (err) {
      console.error(err);

      setStatus("error");
      setMessage(
        "Failed to load all accounts."
      );
    }
  }

  return (
    <div className="history-container">
      <h2>Transaction History</h2>

      {/* admin search */}
      {isAdmin && (
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            className="history-search"
            placeholder="Search account ID"
            value={searchAccount}
            onChange={(e) =>
              setSearchAccount(e.target.value)
            }
          />

          <button onClick={loadAllAccounts}>
            View All Accounts
          </button>
        </div>
      )}

      {status === "processing" && (
        <p>Loading...</p>
      )}

      {status === "error" && (
        <p>{message}</p>
      )}

      {status === "success" && (
        <>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div className="history-scroll-box">
              <ul>
                {transactions.map((tx, index) => (
                  <li
                    key={index}
                    className="history-item"
                  >
                    <strong>{tx.type}</strong>
                    {" - $"}
                    {tx.amount}

                    <br />

                    {tx.accountID && (
                      <small>
                        Account: {tx.accountID}
                      </small>
                    )}

                    <br />

                    {tx.date?.toDate
                      ? tx.date
                          .toDate()
                          .toString()
                      : new Date(
                          tx.date
                        ).toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}