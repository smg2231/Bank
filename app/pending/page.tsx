"use client"; // Enables client-side rendering (needed for hooks like useEffect, router, etc.)

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PendingPage() {
  const router = useRouter(); // Used for navigation
  const searchParams = useSearchParams(); // Access query parameters from URL

  // Get values passed from previous page via URL
  const accountId = searchParams.get("accountId");
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
      if (!accountId || !amount) {
        setStatus("error");
        setMessage("Missing transaction details.");
        return;
      }

      try {
        // Fetch account data from API
        const res = await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
        );

        // If account doesn't exist
        if (!res.ok) {
          setStatus("error");
          setMessage("Account not found.");
          return;
        }

        // Parse account data
        const account = await res.json();

        const currentBalance = Number(account.balance); // Current balance
        const transactionAmount = Number(amount); // Amount to deposit/withdraw

        let newBalance = currentBalance; // Initialize new balance

        // Handle withdrawal
        if (type === "withdraw") {
          // Prevent overdraft
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

        // Append new transaction to existing history
        const updatedTransactions = [
          ...(account.transactions || []),
          {
            type, // deposit or withdraw
            amount: transactionAmount,
            date: new Date().toISOString(), // timestamp
          },
        ];

        // Simulate processing delay (for UX)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update account with new balance + transactions
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

        // Redirect to account page after short delay
        setTimeout(() => {
          router.push(
            `/accounts/${accountId}?success=true&amount=${transactionAmount}&type=${type}`
          );
        }, 2000);
      } catch (err) {
        // Catch any unexpected errors (network, server, etc.)
        console.error(err);
        setStatus("error");
        setMessage("Transaction failed.");
      }
    };

    // Run transaction when component loads
    processTransaction();
  }, [accountId, amount, type, router]); // Re-run if any dependency changes

  return (
    <div style={{ padding: 20 }}>
      {/* Show while transaction is processing */}
      {status === "processing" && (
        <>
          <h2>Processing...</h2>
          <p>Please wait</p>
        </>
      )}

      {/* Show success message */}
      {status === "success" && (
        <>
          <h2>Success</h2>
          <p>{message}</p>
        </>
      )}

      {/* Show error and allow user to go back */}
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