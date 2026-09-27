"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

const roleConfig = {
  BUYER: {
    roleLabel: "Buyer",
    subtitle: "Discover auctions and manage your bids.",
    primaryAction: {
      title: "Browse Auctions",
      description: "Explore active and upcoming auctions.",
      href: "/auctions",
    },
    actions: [
      {
        title: "My Bids",
        description: "Track your current and previous bids.",
        href: "/my-bids",
      },
      {
        title: "Browse Auctions",
        description: "Find items and place competitive bids.",
        href: "/auctions",
      },
    ],
  },

  SELLER: {
    roleLabel: "Seller",
    subtitle: "Manage your listings and monitor auction activity.",
    primaryAction: {
      title: "Seller Dashboard",
      description: "Create and manage your auction listings.",
      href: "/seller",
    },
    actions: [
      {
        title: "My Bids",
        description: "Track your current and previous bids.",
        href: "/my-bids",
      },
      {
        title: "My Auctions",
        description: "View and manage your auction listings.",
        href: "/seller",
      },
      {
        title: "Browse Auctions",
        description: "Explore the marketplace and current listings.",
        href: "/auctions",
      },
    ],
  },

  ADMIN: {
    roleLabel: "Administrator",
    subtitle: "Monitor and manage the auction platform.",
    primaryAction: {
      title: "Admin Dashboard",
      description: "Manage users, auctions and platform activity.",
      href: "/admin",
    },
    actions: [
      {
        title: "Manage Auctions",
        description: "Review and manage all auction listings.",
        href: "/admin",
      },
      {
        title: "Browse Platform",
        description: "View auctions across the marketplace.",
        href: "/auctions",
      },
    ],
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest("/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data);
      } catch (error) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const config = roleConfig[user?.role] || {
    roleLabel: "Member",
    subtitle: "Manage your auction account.",
    primaryAction: {
      title: "Browse Auctions",
      description: "Explore available auctions.",
      href: "/auctions",
    },
    actions: [],
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          <span className="text-sm text-slate-600">
            Loading dashboard...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {config.roleLabel}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, {user?.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {config.subtitle}
                </p>
              </div>
            </div>

            <Link
              href={config.primaryAction.href}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {config.primaryAction.title}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Account</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              Active
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Account status
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {config.roleLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Current access level
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Marketplace</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              Auctions
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Explore the platform
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 truncate text-base font-bold text-slate-900">
              {user?.email || "N/A"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Registered email
            </p>
          </div>

        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* PRIMARY CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Recommended next step
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {config.primaryAction.title}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  {config.primaryAction.description}
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl sm:flex">
                ↗
              </div>
            </div>

            <Link
              href={config.primaryAction.href}
              className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Open workspace
            </Link>
          </div>

          {/* ACCOUNT CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              Account information
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {user?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {user?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {config.roleLabel}
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Quick actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common tasks available for your account
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {config.actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <span className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-slate-900 group-hover:text-white">
                    →
                  </span>

                </div>
              </Link>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}