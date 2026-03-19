"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Withdraw() {
  // List of accounts from API
  const [accounts, setAccounts] = useState<any[]>([]);
  // Selected account ID
  const [accountId, setAccountId] = useState("");
  // Withdrawal amount
  const [amount, setAmount] = useState("");
  // Router for navigation
  const router = useRouter();

  // Fetch accounts
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  // Handle withdrawal
  const handleWithdraw = async () => {
    // Validate input
    if (!accountId || Number(amount) <= 0) return;

    // Get selected account
    const res = await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
    );
    const account = await res.json();

    const currentBalance = Number(account.balance);
    const withdrawAmount = Number(amount);

    // Prevent withdrawal if not enough balance
    if (withdrawAmount > currentBalance) return;

    // Update balance by subtracting amount
    await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...account,
          balance: currentBalance - withdrawAmount,
        }),
      }
    );

    // Redirect to account page
    router.push(`/accounts/${accountId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Select account */}
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        style={{ padding: 8, marginBottom: 10 }}
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br />

      {/* Input withdrawal amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      {/* Withdraw button */}
      <button onClick={handleWithdraw} style={{ padding: "8px 16px" }}>
        Withdraw
      </button>
    </div>
  );
}