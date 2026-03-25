"use client"; // Enables client-side rendering (needed for hooks like useEffect, router, etc.)

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PendingPage() {
  const router = useRouter(); // Used for navigation
  const searchParams = useSearchParams(); // Access query parameters from URL

  // Existing params
  const accountId = searchParams.get("accountId");

  // Transfer params
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const amount = searchParams.get("amount");
  const type = searchParams.get("type") || "withdraw"; // Default to withdraw if not provided

  // Track current transaction status
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );

  // Message to display to user (success or error)
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Function to handle the transaction logic
    const processTransaction = async () => {
      // Validate required data
      if (!amount) {
        setStatus("error");
        setMessage("Missing transaction details.");
        return;
      }

      const transactionAmount = Number(amount);

      try {
        // Transfer logic
        if (type === "transfer") {
          if (!from || !to) {
            setStatus("error");
            setMessage("Missing transfer accounts.");
            return;
          }

          // Fetch both accounts
          const [fromRes, toRes] = await Promise.all([
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${from}`),
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${to}`)
          ]);

          // If one or both accounts don't exist
          if (!fromRes.ok || !toRes.ok) {
            setStatus("error");
            setMessage("One or both accounts not found.");
            return;
          }

          // Parse account data
          const fromAccount = await fromRes.json();
          const toAccount = await toRes.json();

          const fromBalance = Number(fromAccount.balance);
          const toBalance = Number(toAccount.balance);

          // Prevent overdraft
          if (transactionAmount > fromBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }

          const newFromBalance = fromBalance - transactionAmount;
          const newToBalance = toBalance + transactionAmount;

          // Append transaction history
          const fromTransactions = [
            ...(fromAccount.transactions || []),
            {
              type: "transfer-out",
              amount: transactionAmount,
              to,
              date: new Date().toISOString(),
            },
          ];

          const toTransactions = [
            ...(toAccount.transactions || []),
            {
              type: "transfer-in",
              amount: transactionAmount,
              from,
              date: new Date().toISOString(),
            },
          ];

          // Simulate processing delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Update both accounts
          await Promise.all([
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${from}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                balance: newFromBalance,
                transactions: fromTransactions,
              }),
            }),
            fetch(`https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${to}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                balance: newToBalance,
                transactions: toTransactions,
              }),
            }),
          ]);

          // Mark success and show confirmation message
          setStatus("success");
          setMessage(
            `Transferred $${transactionAmount} from ${from} to ${to}.`
          );

          // Redirect after delay
          setTimeout(() => {
            router.push(`/accounts/${from}`);
          }, 2000);

          return;
        }

        // Deposit / Withdraw logic
        if (!accountId) {
          setStatus("error");
          setMessage("Missing account details.");
          return;
        }

        // Fetch account data
        const res = await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
        );

        // If account doesn't exist
        if (!res.ok) {
          setStatus("error");
          setMessage("Account not found.");
          return;
        }

        const account = await res.json();
        const currentBalance = Number(account.balance);

        let newBalance = currentBalance;

        // Handle withdrawal
        if (type === "withdraw") {
          if (transactionAmount > currentBalance) {
            setStatus("error");
            setMessage("Insufficient funds.");
            return;
          }
          newBalance = currentBalance - transactionAmount;
        }
        // Handle deposit
        else if (type === "deposit") {
          newBalance = currentBalance + transactionAmount;
        }

        // Append transaction history
        const updatedTransactions = [
          ...(account.transactions || []),
          {
            type,
            amount: transactionAmount,
            date: new Date().toISOString(),
          },
        ];

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update account
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

        // Mark success and show confirmation message
        setStatus("success");
        setMessage(
          `${type === "deposit" ? "Deposited" : "Withdrew"} $${transactionAmount}. New balance: $${newBalance}`
        );

        // Redirect after delay
        setTimeout(() => {
          router.push(`/accounts/${accountId}`);
        }, 2000);
      } catch (err) {
        // Catch unexpected errors
        console.error(err);
        setStatus("error");
        setMessage("Transaction failed.");
      }
    };

    // Run transaction when component loads
    processTransaction();
  }, [accountId, from, to, amount, type, router]);

  return (
    <div style={{ padding: 20 }}>
      {/* Show while processing */}
      {status === "processing" && (
        <>
          <h2>Processing...</h2>
          <p>Please wait</p>
        </>
      )}

      {/* Show success */}
      {status === "success" && (
        <>
          <h2>Success</h2>
          <p>{message}</p>
        </>
      )}

      {/* Show error */}
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