"use client"; // Marks this component for client-side rendering in Next.js

import { useEffect, useState } from "react";

export default function TotalMoney() {
  // State to hold the sum of all account balances
  const [total, setTotal] = useState(0);
  // Function to fetch all accounts and calculate total balance
  const fetchTotal = async () => {
    try {
      // Fetch account data from API, bypass cache to get latest balances
      const res = await fetch(
        "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account", 
        { cache: "no-store" } 
      );
      // Convert response to JSON array of accounts
      const accounts = await res.json();
      // Sum up balances
      let sum = 0;
      for (let i = 0; i < accounts.length; i++) {
        sum += Number(accounts[i].balance || 0); // Default to 0 if balance missing
      }
      // Update state with total sum
      setTotal(sum);
    } catch {
      // On error (network, API issues, etc.), set total to 0
      setTotal(0);
    }
  };
  // Run fetchTotal once when component mounts
  useEffect(() => {
    fetchTotal();
  }, []); // Empty dependency array = run once
  // Display total money
  return (
    <div style={{ fontSize: 20, marginTop: 5 }}>
      Total Money: ${total}
    </div>
  );
}