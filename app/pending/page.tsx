"use client"; // client-side component

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PendingPage() {
  const router = useRouter(); // navigation
  const searchParams = useSearchParams(); // get URL params

  // query params
  const accountId = searchParams.get("accountId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amount = searchParams.get("amount");
  const type = searchParams.get("type") || "withdraw";

  // status and message
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");

  // delay helper
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    const processTransaction = async () => {
      // check amount
      if (!amount) {
        setStatus("error");
        setMessage("Missing transaction details.");
        return;
      }

      const transactionAmount = Number(amount);

      try {
        // transfer
        if (type === "transfer") {
          if (!from || !to) {
            setStatus("error");
            setMessage("Missing transfer accounts.");
            return;
          }

          // fetch accounts
          const [fromRes, toRes] = await Promise.all([
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${from}`),
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${to}`)
          ]);

          if (!fromRes.ok || !toRes.ok) {
            setStatus("error");
            setMessage("One or both accounts not found.");
            return;
          }

          const fromAccount = await fromRes.json();
          const toAccount = await toRes.json();

          const fromBalance = Number(fromAccount.balance);
          const toBalance = Number(toAccount.balance);

          // check funds
          if (transactionAmount > fromBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }

          const newFromBalance = fromBalance - transactionAmount;
          const newToBalance = toBalance + transactionAmount;

          // update transactions
          const fromTransactions = [
            ...(fromAccount.transactions || []),
            { type: "transfer-out", amount: transactionAmount, to, date: new Date().toISOString() },
          ];

          const toTransactions = [
            ...(toAccount.transactions || []),
            { type: "transfer-in", amount: transactionAmount, from, date: new Date().toISOString() },
          ];

          await delay(1500);

          // update both accounts
          await Promise.all([
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${from}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ balance: newFromBalance, transactions: fromTransactions }),
            }),
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${to}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ balance: newToBalance, transactions: toTransactions }),
            }),
          ]);

          setStatus("success");
          setMessage(`Transferred $${transactionAmount} from ${from} to ${to}.`);

          setTimeout(() => router.push(`/accounts/${from}`), 2000);
          return;
        }

        // deposit / withdraw
        if (!accountId) {
          setStatus("error");
          setMessage("Missing account details.");
          return;
        }

        // fetch account
        const res = await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
        );

        if (!res.ok) {
          setStatus("error");
          setMessage("Account not found.");
          return;
        }

        const account = await res.json();
        const currentBalance = Number(account.balance);

        let newBalance = currentBalance;

        // withdraw
        if (type === "withdraw") {
          if (transactionAmount > currentBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }
          newBalance -= transactionAmount;
        }

        // deposit
        if (type === "deposit") {
          newBalance += transactionAmount;
        }

        // update transactions
        const updatedTransactions = [
          ...(account.transactions || []),
          {
            type,
            amount: transactionAmount,
            date: new Date().toISOString(),
          },
        ];

        await delay(1500);

        // update account
        await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              balance: newBalance,
              transactions: updatedTransactions,
            }),
          }
        );

        setStatus("success");
        setMessage(
          `${type === "deposit" ? "Deposited" : "Withdrew"} $${transactionAmount}. New balance: $${newBalance}`
        );

        setTimeout(() => router.push(`/accounts/${accountId}`), 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Transaction failed.");
      }
    };

    processTransaction();
  }, [accountId, from, to, amount, type, router]);

  return (
    <div style={{ padding: 20 }}>
      {status === "processing" && (
        <>
          <h2>Processing...</h2>
          <p>Please wait</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Success</h2>
          <p>{message}</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Error</h2>
          <p>{message}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </>
      )}
    </div>
  );
}