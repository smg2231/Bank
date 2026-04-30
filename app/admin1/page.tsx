"use client";

import { useEffect, useState } from "react";
import TotalMoney from "@/components/TotalMoney";
import TellerFunc from "@/components/TellerFunc";
import "../../styles/admin.css";

export default function Admin1Page() {
  const [loggedInAccountId, setLoggedInAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  useEffect(() => {
    const accountId = localStorage.getItem("loggedInAccountId");
    const userRole = localStorage.getItem("loggedInRole");

    setLoggedInAccountId(accountId);

    if (!accountId || userRole !== "admin") {
      alert("Access denied!");
      window.location.href = "/";
      return;
    }

    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  const actions = [
    { title: "Deposit", type: "deposit" },
    { title: "Withdraw", type: "withdraw" },
    { title: "Transfer", type: "transfer" },
    { title: "History", type: "history" },
    { title: "Logout", type: "logout" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedInAccountId");
    localStorage.removeItem("loggedInRole");
    window.location.href = "/";
  };

  return (
    <main className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-text">Actions</h2>

        {actions.map((action) => {
          const isActive = activeComponent === action.type;

          return (
            <button
              key={action.type}
              onClick={
                action.type === "logout"
                  ? handleLogout
                  : () => setActiveComponent(action.type)
              }
              className={`admin-button ${isActive ? "active" : ""} ${
                action.type === "logout" ? "logout" : ""
              }`}
            >
              {action.title}
            </button>
          );
        })}

        <div style={{ textAlign: "center" }}>
          <TotalMoney />
        </div>
      </aside>

      <section className="admin-content">
        <h1 className="admin-text">Admin Dashboard</h1>
        <p>Welcome, {loggedInAccountId}</p>

        {activeComponent === "deposit" && <TellerFunc type="deposit" />}
        {activeComponent === "withdraw" && <TellerFunc type="withdraw" />}
        {activeComponent === "transfer" && <TellerFunc type="transfer" />}
        {activeComponent === "history" && <TellerFunc type="history" />}
        {activeComponent === "logout" && <p>Logging out...</p>}
      </section>
    </main>
  );
}