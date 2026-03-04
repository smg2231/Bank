"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Deposit() {
  // Store list of accounts from the API
  const [accounts, setAccounts] = useState<any[]>([]);
  // Store selected account ID from dropdown
  const [accountId, setAccountId] = useState("");
  // Store deposit amount from input
  const [amount, setAmount] = useState("");
  // Used to navigate to another page after deposit
  const router = useRouter();
  // Fetches all accounts from the API
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json())
      .then((data) => setAccounts(data)); // Save accounts in state
  }, []);

  // Runs when Deposit button is clicked
  const handleDeposit = async () => {
    // Stop if no account selected or amount is invalid
    if (!accountId || Number(amount) <= 0) return;

    // Get the selected account from API
    const res = await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
    );
    const account = await res.json();

    // Update the account balance
    await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`,
      {
        method: "PUT", // Update existing account
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...account, // Keep existing account data
          balance: Number(account.balance) + Number(amount), // Add deposit
        }),
      }
    );

    // After deposit, go back to account page
    router.push(`/accounts/${accountId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Dropdown to choose account */}
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        style={{ padding: 8, marginBottom: 10 }}
      >
        <option value="">Select Account</option>

        {/* Loop through accounts and show each one */}
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name} (${acc.balance})
          </option>
        ))}
      </select>
      <br />
      {/* Input for deposit amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      {/* Deposit button */}
      <button onClick={handleDeposit} style={{ padding: "8px 16px" }}>
        Deposit
      </button>
    </div>
  );
}