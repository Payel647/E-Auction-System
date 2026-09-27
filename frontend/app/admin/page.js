"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function AdminPage() {
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  async function loadData() {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        throw new Error("Please login first.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [auctionData, statisticsData,userData] = await Promise.all([
        apiRequest("/auctions/", { headers }),
        apiRequest("/auctions/admin/statistics/", { headers }),
        apiRequest("/auctions/admin/users/", { headers }),
      ]);

      setAuctions(auctionData);
      setStats(statisticsData);
      setUsers(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this auction?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access");

      await apiRequest(`/auctions/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuctions((current) =>
        current.filter((auction) => auction.id !== id)
      );

      // Refresh statistics
      const updatedStats = await apiRequest(
        "/auctions/admin/statistics/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(updatedStats);
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleDeleteUser(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("access");

    await apiRequest(
      `/auctions/admin/users/${id}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers((current) =>
      current.filter((user) => user.id !== id)
    );
  } catch (error) {
    alert(error.message);
  }
}
  return (
    <>
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Monitor and manage the e-auction platform.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* Users */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Total Users
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {stats.total_users}
                </p>
              </div>

              {/* Auctions */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Total Auctions
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {stats.total_auctions}
                </p>
              </div>

              {/* Active */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Active Auctions
                </p>

                <p className="mt-3 text-3xl font-bold text-green-600">
                  {stats.active_auctions}
                </p>
              </div>

              {/* Bids */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Total Bids
                </p>

                <p className="mt-3 text-3xl font-bold text-blue-600">
                  {stats.total_bids}
                </p>
              </div>

            </div>
          )}

          {/* Auction Management */}
          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Auction Management
              </h2>

              <p className="text-sm text-gray-500">
                Review and manage all auction listings.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
                Loading auctions...
              </div>
            ) : auctions.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center">
                <h2 className="text-xl font-semibold">
                  No auctions found
                </h2>

                <p className="mt-2 text-gray-500">
                  There are currently no auction listings.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="overflow-x-auto">
                  <table className="w-full text-left">

                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold">
                          Auction
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Seller
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Category
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Starting
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Current Bid
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Status
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {auctions.map((auction) => (
                        <tr
                          key={auction.id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">
                              {auction.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {auction.auction_code}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {auction.seller_name}
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                              {auction.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm font-medium">
                            ₹{auction.starting_price}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium">
                            ₹{auction.current_highest_bid}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                auction.status === "ACTIVE"
                                  ? "bg-green-50 text-green-700"
                                  : auction.status === "CLOSED"
                                  ? "bg-gray-100 text-gray-700"
                                  : auction.status === "UNSOLD"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-yellow-50 text-yellow-700"
                              }`}
                            >
                              {auction.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleDelete(auction.id)
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="mt-10">
  <div className="mb-4">
    <h2 className="text-xl font-bold text-gray-900">
      User Management
    </h2>

    <p className="text-sm text-gray-500">
      Review registered buyers, sellers and administrators.
    </p>
  </div>

  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Email
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Role
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Joined
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >

              <td className="px-6 py-4">
                <p className="font-semibold text-gray-900">
                  {user.name}
                </p>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {user.email}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700"
                      : user.role === "SELLER"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(
                  user.date_joined
                ).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                {user.id !== stats?.current_admin_id && (
                  <button
                    onClick={() =>
                      handleDeleteUser(user.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
</div>
        </div>
      </main>
    </>
  );
}