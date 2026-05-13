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

  // logged in account id
  const [loggedInAccountId, setLoggedInAccountId] =
    useState<string>("");

  // active sidebar component
  const [activeComponent, setActiveComponent] =
    useState<string | null>(null);

  // prevents ui flash before auth check
  const [loading, setLoading] =
    useState(true);

  // protect admin route
  useEffect(() => {
    const accountId =
      localStorage.getItem(
        "loggedInAccountId"
      ) || "";

    const role =
      localStorage.getItem(
        "loggedInRole"
      ) || "";

    // safely check admin
    const isAdmin =
      role.trim().toLowerCase() ===
      "admin";

    // not logged in
    if (!accountId) {
      router.replace("/");
      return;
    }

    // not admin
    if (!isAdmin) {
      router.replace("/user");
      return;
    }

    setLoggedInAccountId(accountId);

    // auth finished
    setLoading(false);
  }, [router]);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem(
      "loggedInAccountId"
    );

    localStorage.removeItem(
      "loggedInRole"
    );

    router.replace("/");
  };

  // sidebar actions
  const actions = [
    {
      title: "Deposit",
      type: "deposit",
      icon: Banknote,
    },

    {
      title: "Withdraw",
      type: "withdraw",
      icon: ArrowDownToLine,
    },

    {
      title: "Transfer",
      type: "transfer",
      icon: Send,
    },

    {
      title: "History",
      type: "history",
      icon: HistoryIcon,
    },

    {
      title: "Logout",
      type: "logout",
      icon: LogOut,
    },
  ];

  // prevents flashing page
  if (loading) return null;

  return (
    <main className="admin-container">
      {/* sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-text">
          Actions
        </h2>

        {actions.map((action) => {
          const isActive =
            activeComponent ===
            action.type;

          const Icon = action.icon;

          return (
            <button
              key={action.type}
              onClick={
                action.type === "logout"
                  ? handleLogout
                  : () =>
                      setActiveComponent(
                        action.type
                      )
              }
              className={`admin-button ${
                isActive
                  ? "active"
                  : ""
              } ${
                action.type ===
                "logout"
                  ? "logout"
                  : ""
              }`}
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

        {/* total money */}
        <div className="total-money">
          <TotalMoney />
        </div>
      </aside>

      {/* main content */}
      <section className="admin-content">
        <h1 className="admin-text">
          Admin Dashboard
        </h1>

        <p>
          Welcome,{" "}
          {loggedInAccountId}
        </p>

        {/* default message */}
        {!activeComponent && (
          <p>
            Select an action from the
            sidebar.
          </p>
        )}

        {/* deposit */}
        {activeComponent ===
          "deposit" && (
          <TellerFunc type="deposit" />
        )}

        {/* withdraw */}
        {activeComponent ===
          "withdraw" && (
          <TellerFunc type="withdraw" />
        )}

        {/* transfer */}
        {activeComponent ===
          "transfer" && (
          <TellerFunc type="transfer" />
        )}

        {/* FIXED HISTORY */}
        {activeComponent ===
          "history" && <History />}
      </section>
    </main>
  );
}