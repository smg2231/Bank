"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import "../styles/teller.css";
type Props = {
  type: "deposit" | "withdraw" | "transfer";
};

export default function TellerFunc({ type }: Props) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selected, setSelected] = useState({ from: "", to: "" });
  const [amount, setAmount] = useState<number>(0);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async (): Promise<void> => {
      const querySnapshot = await getDocs(collection(db, "Accounts"));
      const accountList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccounts(accountList);
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async () => {
    if (amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    // ===== Transfer =====
    if (type === "transfer") {
      if (!selected.from || !selected.to) {
        alert("Select both accounts");
        return;
      }

      if (selected.from === selected.to) {
        alert("Cannot transfer to same account");
        return;
      }

      const toRef = doc(db, "Accounts", selected.to);
      const fromRef = doc(db, "Accounts", selected.from);

      await updateDoc(toRef, { balance: increment(amount) });
      await updateDoc(fromRef, { balance: increment(-amount) });

      alert("Transfer successful");
      return;
    }

    // ===== Deposit / Withdraw =====
    if (!selected.from) {
      alert("Select account");
      return;
    }

    const userRef = doc(db, "Accounts", selected.from);

    if (type === "deposit") {
      await updateDoc(userRef, { balance: increment(amount) });
      alert("Deposit successful");
    } else if (type === "withdraw") {
      await updateDoc(userRef, { balance: increment(-amount) });
      alert("Withdrawal successful");
    }
  };

  return (
    <div className="teller-container">
      <h2>
        {type === "deposit"
          ? "Deposit Funds"
          : type === "withdraw"
          ? "Withdraw Funds"
          : "Transfer Funds"}
      </h2>

      {/* Account selection */}
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

      {/* Amount */}
      <label className="teller-label">Amount:</label>
      <input
        className="teller-input"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      {/* Submit */}
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