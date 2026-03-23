"use client"; // Marks this as a client-side component in Next.js

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Withdraw() {
  // State to store all accounts fetched from API
  const [accounts, setAccounts] = useState<any[]>([]);

  // State to store selected account ID
  const [accountId, setAccountId] = useState("");

  // State to store withdrawal amount
  const [amount, setAmount] = useState("");

  // Next.js router for navigation
  const router = useRouter();

  // Fetch accounts when component loads
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json()) // Convert response to JSON
      .then((data) => setAccounts(data)); // Store accounts in state
  }, []); // Empty dependency array = runs once on mount

  // Function to handle withdrawal action
  const handleWithdraw = () => {
    // Validate input: must have account selected and amount > 0
    if (!accountId || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    // Redirect to pending page with query params
    router.push(
      `/pending?accountId=${accountId}&amount=${amount}&type=withdraw`
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Withdraw Funds</h2>

      {/* Dropdown to select account */}
      <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
        <option value="">Select Account</option>

        {/* Loop through accounts and create options */}
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br /><br />

      {/* Input field for withdrawal amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      {/* Button to trigger withdrawal */}
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}