"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Withdraw() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  const handleWithdraw = () => {
    if (!accountId || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    router.push(
      `/pending?accountId=${accountId}&amount=${amount}&type=withdraw`
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Withdraw Funds</h2>

      <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.id} (${acc.balance})
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}