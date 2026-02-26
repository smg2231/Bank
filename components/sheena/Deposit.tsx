"use client";

import { useState } from "react";

export default function DepositBox({ accountId, onDeposit }: { accountId: string, onDeposit?: () => void }) {
  const [amount, setAmount] = useState("");

  const deposit = async () => {
    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`);
      if (!res.ok) {
        alert("Account not found");
        return;
      }

      const account = await res.json();
      const newBalance = (Number(account.balance) || 0) + depositAmount;

      await fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }),
      });

      alert(`Deposited $${depositAmount} successfully!`);
      setAmount("");

      if (onDeposit) onDeposit();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        style={{ padding: 5, marginRight: 5 }}
      />
      <button onClick={deposit} style={{ padding: 5 }}>Deposit</button>
    </div>
  );
}