"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your e-auction activities.
          </p>

          {/* Buyer Dashboard */}
          {user?.role === "BUYER" && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <Link
                href="/auctions"
                className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md"
              >
                <h2 className="text-xl font-bold">
                  Browse Auctions
                </h2>

                <p className="mt-2 text-gray-500">
                  Explore active auctions and place bids.
                </p>
              </Link>

              <Link
                href="/my-bids"
                className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <h2 className="text-xl font-bold">
                  My Bids
                </h2>

                <p className="mt-2 text-gray-500">
                  Track your bidding activity.
                </p>
              </Link>

            </div>
          )}

          {/* Seller Dashboard */}
          {user?.role === "SELLER" && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <Link
                href="/seller"
                className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md"
              >
                <h2 className="text-xl font-bold">
                  Seller Dashboard
                </h2>

                <p className="mt-2 text-gray-500">
                  Create and manage your auctions.
                </p>
              </Link>

              <Link
                href="/auctions"
                className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md"
              >
                <h2 className="text-xl font-bold">
                  Browse Auctions
                </h2>

                <p className="mt-2 text-gray-500">
                  View available auction listings.
                </p>
              </Link>

            </div>
          )}

          {/* Admin Dashboard */}
          {user?.role === "ADMIN" && (
            <div className="mt-8">

              <Link
                href="/admin"
                className="block rounded-2xl bg-white p-8 shadow-sm hover:shadow-md"
              >
                <h2 className="text-xl font-bold">
                  Admin Dashboard
                </h2>

                <p className="mt-2 text-gray-500">
                  Manage users, auctions and platform activity.
                </p>
              </Link>

            </div>
          )}

        </div>
      </main>
  );
}