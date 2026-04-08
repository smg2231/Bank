"use client"; // Enables client-side rendering in Next.js

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Deposit() {
  // Holds list of accounts fetched from API
  const [accounts, setAccounts] = useState<any[]>([]);
  // Stores selected account ID from dropdown
  const [accountId, setAccountId] = useState("");
  // Stores deposit amount entered by user
  const [amount, setAmount] = useState("");
  // Router used for navigating between pages
  const router = useRouter();
  // Fetch account data when component mounts
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json()) // Convert response to JSON
      .then((data) => setAccounts(data)); // Save data into state
  }, []); // Runs only once
  // Handles deposit button click
  const handleDeposit = () => {
    // Basic validation: account must be selected and amount must be positive
    if (!accountId || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }
    // Navigate to pending page with deposit details
    router.push(
      `/pending?accountId=${accountId}&amount=${amount}&type=deposit`
    );
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>Deposit Funds</h2>
      {/* Dropdown for selecting an account */}
      <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
        <option value="">Select Account</option>
        {/* Render each account as an option */}
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>
      <br /><br />
      {/* Input field for deposit amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      {/* Button to trigger deposit action */}
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}