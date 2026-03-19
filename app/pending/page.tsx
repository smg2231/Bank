"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accountId = searchParams.get("accountId");
  const amount = searchParams.get("amount");
  const type = searchParams.get("type") || "withdraw";

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processTransaction = async () => {
      if (!accountId || !amount) {
        setStatus("error");
        setMessage("Missing transaction details.");
        return;
      }

      try {
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
        const transactionAmount = Number(amount);

        let newBalance = currentBalance;

        if (type === "withdraw") {
          if (transactionAmount > currentBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }
          newBalance = currentBalance - transactionAmount;
        } else if (type === "deposit") {
          newBalance = currentBalance + transactionAmount;
        }

        const updatedTransactions = [
          ...(account.transactions || []),
          {
            type,
            amount: transactionAmount,
            date: new Date().toISOString(),
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 1500));

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

        setTimeout(() => {
          router.push(
            `/accounts/${accountId}?success=true&amount=${transactionAmount}&type=${type}`
          );
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Transaction failed.");
      }
    };

    processTransaction();
  }, [accountId, amount, type, router]);

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