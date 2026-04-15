"use client";

import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { increment } from "firebase/firestore";

type Props = {
  type: "deposit" | "withdraw" | "transfer";
};

export default function TellerFunc({ type }: Props) {
  const [accounts, setAccounts] = useState<any[]>([]); // All accounts
  const [selected, setSelected] = useState({ from: "", to: "" }); // From/To
  const [amount, setAmount] = useState(Number); // Amount

  const router = useRouter();

  // Fetch accounts on load
  useEffect(() => {
    const fetchAccount = async():Promise<void> =>{
      const querySnapshot = await getDocs(collection(db, "Accounts"));
      const accountList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccounts(accountList)
    }
    fetchAccount()
  }, []);

  const handleSubmit = async () => {
    // Validate amount
    if (Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    // Transfer validation
    if (type === "transfer") {
      if (!selected.from || !selected.to) {
        alert("Select both accounts");
        return;
      }
      if (selected.from === selected.to) {
        alert("Cannot transfer to same account");
        return;
      }

      let userRef = doc(db, "Accounts", selected.to)
      await updateDoc(userRef, { balance: increment(amount) });

      userRef = doc(db, "Accounts", selected.from)
      await updateDoc(userRef, { balance: increment(-(amount)) });

      return;
    }

    // Deposit/Withdraw validation
    if (!selected.from) {
      alert("Select account");
      return;
    }

    let userRef = doc(db, "Accounts", selected.from)

    if (type === "deposit") {
      await updateDoc(userRef, { balance: increment(amount) });
    } else if (type === "withdraw") {
      await updateDoc(userRef, { balance: increment(-(amount)) });
    }
  };

  return (
    <div style={{ padding: 20 }}>
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
          <label>From:</label>
          <br />
          <select
            value={selected.from}
            onChange={(e) => setSelected({ ...selected, from: e.target.value })}
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.id} (${acc.balance})
              </option>
            ))}
          </select>
          <br /><br />
          <label>To:</label>
          <br />
          <select
            value={selected.to}
            onChange={(e) => setSelected({ ...selected, to: e.target.value })}
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
        <select
          value={selected.from}
          onChange={(e) => setSelected({ ...selected, from: e.target.value })}
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.id} (${acc.balance})
            </option>
          ))}
        </select>
      )}

      <br /><br />
      {/* Amount input */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <br /><br />
      {/* Submit button */}
      <button onClick={handleSubmit}>
        {type === "deposit" ? "Deposit" : type === "withdraw" ? "Withdraw" : "Transfer"}
      </button>
    </div>
  );
}