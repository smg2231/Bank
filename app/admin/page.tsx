"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TotalMoney from "@/components/TotalMoney";
import TellerFunc from "@/components/TellerFunc";
import History from "@/components/History";

import "../../styles/admin.css";

import {
  Banknote,
  ArrowDownToLine,
  Send,
  History as HistoryIcon,
  LogOut,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const userId = localStorage.getItem("loggedInUserId");
    const role = localStorage.getItem("loggedInRole");

    const isAdmin = role?.trim().toLowerCase() === "admin";

    if (!userId) {
      router.replace("/");
      return;
    }

    if (!isAdmin) {
      router.replace("/user");
      return;
    }

    setLoggedInUserId(userId);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  const actions = [
    { title: "Deposit", type: "deposit", icon: Banknote },
    { title: "Withdraw", type: "withdraw", icon: ArrowDownToLine },
    { title: "Transfer", type: "transfer", icon: Send },
    { title: "History", type: "history", icon: HistoryIcon },
    { title: "Logout", type: "logout", icon: LogOut },
  ];

  if (loading) return null;

  return (
    <main className="admin-container">
      <aside className="admin-sidebar">
        <h2>Actions</h2>

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.type}
              onClick={
                action.type === "logout"
                  ? handleLogout
                  : () => setActiveComponent(action.type)
              }
              className="admin-button"
            >
              <Icon size={18} />
              {action.title}
            </button>
          );
        })}

        {/* TOTAL MONEY FIXED */}
        <div className="total-money">
          <TotalMoney />
        </div>
      </aside>

      <section className="admin-content">
        <h1>Admin Dashboard</h1>

        {!activeComponent && <p>Select an action</p>}

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
          <History />
        )}
      </section>
    </main>
  );
}