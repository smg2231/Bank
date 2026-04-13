"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  type: "deposit" | "withdraw" | "transfer";
};

export default function TellerFunc({ type }: Props) {
  const [accounts, setAccounts] = useState<any[]>([]); // All accounts
  const [selected, setSelected] = useState({ from: "", to: "" }); // From/To
  const [amount, setAmount] = useState(""); // Amount

  const router = useRouter();

  // Fetch accounts on load
  useEffect(() => {
    fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account")
      .then((res) => res.json())
      .then(setAccounts)
      .catch(console.error);
  }, []);

  const handleSubmit = () => {
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
      router.push(
        `/pending?from=${selected.from}&to=${selected.to}&amount=${amount}&type=transfer`
      );
      return;
    }

    // Deposit/Withdraw validation
    if (!selected.from) {
      alert("Select account");
      return;
    }
    router.push(
      `/pending?accountId=${selected.from}&amount=${amount}&type=${type}`
    );
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
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      {/* Submit button */}
      <button onClick={handleSubmit}>
        {type === "deposit" ? "Deposit" : type === "withdraw" ? "Withdraw" : "Transfer"}
      </button>
    </div>
  );
}