"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Transfer() {
  // Holds list of accounts fetched from API
  const [accounts, setAccounts] = useState<any[]>([]);

  // Stores selected accounts
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");

  // Stores transfer amount
  const [amount, setAmount] = useState("");

  const router = useRouter();

  // Fetch account data when component mounts
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, []);

  // Handles transfer button click
  const handleTransfer = () => {
    // Validation
    if (!fromAccount || !toAccount || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    if (fromAccount === toAccount) {
      alert("Cannot transfer to the same account");
      return;
    }

    // Navigate to pending page with transfer details
    router.push(
      `/pending?from=${fromAccount}&to=${toAccount}&amount=${amount}&type=transfer`
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Transfer Funds</h2>

      {/* From Account */}
      <label>From Account:</label>
      <br />
      <select
        value={fromAccount}
        onChange={(e) => setFromAccount(e.target.value)}
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br /><br />

      {/* To Account */}
      <label>To Account:</label>
      <br />
      <select
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br /><br />

      {/* Amount */}
      <label>Amount:</label>
      <br />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      {/* Transfer Button */}
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}