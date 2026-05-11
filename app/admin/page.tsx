"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TotalMoney from "@/components/TotalMoney";
import TellerFunc from "@/components/TellerFunc";
import "../../styles/admin.css";

import {
  Banknote,
  ArrowDownToLine,
  Send,
  History,
  LogOut,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  const [loggedInAccountId, setLoggedInAccountId] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //AUTH GUARD (real protection logic)
  useEffect(() => {
    const accountId = localStorage.getItem("loggedInAccountId");
    const role = localStorage.getItem("loggedInRole");

    //not logged in → redirect
    if (!accountId) {
      router.replace("/");
      return;
    }

    // not admin → redirect
    if (role !== "admin") {
      router.replace("/user");
      return;
    }

    setLoggedInAccountId(accountId);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInAccountId");
    localStorage.removeItem("loggedInRole");

    router.replace("/");
  };

  const actions = [
    { title: "Deposit", type: "deposit", icon: Banknote },
    { title: "Withdraw", type: "withdraw", icon: ArrowDownToLine },
    { title: "Transfer", type: "transfer", icon: Send },
    { title: "History", type: "history", icon: History },
    { title: "Logout", type: "logout", icon: LogOut },
  ];

  //prevents flashing UI before auth check finishes
  if (loading) return null;

  return (
    <main className="admin-container">
      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <h2 className="admin-text">Actions</h2>

        {actions.map((action) => {
          const isActive = activeComponent === action.type;
          const Icon = action.icon;

          return (
            <button
              key={action.type}
              onClick={
                action.type === "logout"
                  ? handleLogout
                  : () => setActiveComponent(action.type)
              }
              className={`admin-button ${
                isActive ? "active" : ""
              } ${action.type === "logout" ? "logout" : ""}`}
            >
              <span className="sidebar-icon">
                <Icon size={18} />
              </span>

              <span className="sidebar-text">
                {action.title}
              </span>
            </button>
          );
        })}

        <div className="total-money">
          <TotalMoney />
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <section className="admin-content">
        <h1 className="admin-text">Admin Dashboard</h1>

        <p>Welcome, {loggedInAccountId}</p>

        {!activeComponent && (
          <p>Select an action from the sidebar.</p>
        )}

        {activeComponent === "deposit" && (
          <TellerFunc type="deposit" />
        )}

        {activeComponent === "withdraw" && (
          <TellerFunc type="withdraw" />
        )}

        {activeComponent === "transfer" && (
          <TellerFunc type="transfer" />
        )}

        {activeComponent === "history" && (
          <TellerFunc type="history" />
        )}
      </section>
    </main>
  );
}