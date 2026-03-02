"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DepositProps {
  accountId: string;
}

export default function Deposit({ accountId }: DepositProps) {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleDeposit = async () => {
    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) return;

    const res = await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
    );
    const account = await res.json();

    await fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...account,
          balance: Number(account.balance) + depositAmount,
        }),
      }
    );

    router.push("/atm");
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{ padding: 8, marginRight: 10 }}
      />
      <button onClick={handleDeposit} style={{ padding: "8px 16px" }}>
        Deposit
      </button>
    </div>
  );
}