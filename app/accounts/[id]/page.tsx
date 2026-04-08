"use client"; 
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
export default function AccountPage() {
  const { id } = useParams(); 
  // Extract the dynamic route param 'id' from the URL
  const searchParams = useSearchParams(); 
  // Access query parameters from the URL
  const router = useRouter(); 
  // Allows programmatic navigation (redirects)
  const [account, setAccount] = useState<any>(null); 
  // Stores account data fetched from API
  const [loading, setLoading] = useState(true); 
  // Tracks loading state while fetching data
  const success = searchParams.get("success"); 
  const amount = searchParams.get("amount"); 
  const type = searchParams.get("type"); 
  // Extract query params for showing success messages (e.g., after deposit/withdrawal)
  useEffect(() => {
    if (!id) return; 
    // If no account ID is provided, do nothing
    const accountId = Array.isArray(id) ? id[0] : id; 
    // Handle the case when id could be an array (dynamic route with catch-all)
    // Access control: check logged-in account
    const loggedInAccountId = localStorage.getItem("loggedInAccountId"); 
    const role = localStorage.getItem("loggedInRole"); 
    // Check localStorage for logged-in user info

    if (!loggedInAccountId) {
      alert("Please log in first");
      router.push("/login"); // redirect to login page if not logged in
      return;
    }

    // Prevent users from accessing other accounts
    if (role !== "admin" && loggedInAccountId !== accountId) {
      alert("Access denied!");
      router.push("/"); // redirect to homepage if user tries to access another account
      return;
    }

    // Function to fetch account data from API
    const fetchAccount = async () => {
      try {
        const res = await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
        );

        if (!res.ok) throw new Error(); 
        // Throw error if response not OK (404, etc.)

        const data = await res.json(); 
        setAccount(data); 
        // Save fetched account data to state
      } catch {
        console.log("Fetch failed"); 
        // Log fetch errors
      } finally {
        setLoading(false); 
        // Stop loading whether fetch succeeds or fails
      }
    };

    fetchAccount(); 
    // Call fetch function
  }, [id, router]); 
  // Dependencies: run whenever id or router changes

  if (loading) return <p>Loading...</p>; 
  // Show loading state while data is being fetched
  if (!account) return <p>Account not found</p>; 
  // Show error if account does not exist

  return (
    <div style={{ padding: 20 }}>
      {/* Show back link only for admin users */}
      {localStorage.getItem("loggedInRole") === "admin" && (
        <Link
          href="/admin1"
          style={{
            display: "inline-block",
            marginBottom: 15,
            padding: "8px 12px",
            background: "#eee",
            textDecoration: "none",
          }}
        >
          ← Back to Admin
        </Link>
      )}

      <h2>Account Page</h2>

      {/* Success messages for deposit or withdrawal */}
      {success && (
        <div style={{ color: "green" }}>
          <p>
            {type === "deposit"
              ? "Deposit successful"
              : "Withdrawal successful"}
          </p>
          {amount && <p>Amount: ${amount}</p>}
        </div>
      )}

      {/* Display account information */}
      <h2>Account Information</h2>
      <p>
        <strong>ID:</strong> {account.id}
      </p>
      <p>
        <strong>Balance:</strong> ${account.balance}
      </p>

      {/* Transaction history */}
      <h3 style={{ marginTop: 20 }}>Transaction History</h3>

      {account.transactions && account.transactions.length > 0 ? (
        <ul>
          {account.transactions
            .slice()
            .reverse() // Show newest first
            .map((tx: any, index: number) => (
              <li key={index}>
                <strong>{tx.type.toUpperCase()}</strong> - ${tx.amount} <br />
                <small>{new Date(tx.date).toLocaleString()}</small>
              </li>
            ))}
        </ul>
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
}