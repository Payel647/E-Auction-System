"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

export default function SellerPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAuctions() {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const data = await apiRequest("/auctions/?mine=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuctions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuctions();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Seller Dashboard
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your auction listings.
              </p>
            </div>

            <Link
              href="/seller/create"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Create Auction
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="mt-10 text-center text-gray-500">
              Loading your auctions...
            </div>
          ) : auctions.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold">
                No auctions yet
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first auction listing.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  {/* Category + Status */}
                  <div className="flex justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {auction.category}
                    </span>

                    <span className="text-xs font-semibold text-gray-500">
                      {auction.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-xl font-bold">
                    {auction.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {auction.description}
                  </p>

                  {/* Price Information */}
                  <div className="mt-5 space-y-2 text-sm">

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Starting Price
                      </span>

                      <span className="font-semibold">
                        ₹{auction.starting_price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Current Bid
                      </span>

                      <span className="font-semibold">
                        ₹{auction.current_highest_bid}
                      </span>
                    </div>

                  </div>

                  {/* Closed Auction */}
                  {auction.status === "CLOSED" && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3">

                      <p className="text-xs text-gray-500">
                        Winner
                      </p>

                      <p className="font-semibold text-green-700">
                        {auction.winner_name || "Unknown"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Final Price: ₹{auction.current_highest_bid}
                      </p>

                    </div>
                  )}

                  {/* Unsold Auction */}
                  {auction.status === "UNSOLD" && (
                    <div className="mt-4 rounded-lg bg-gray-100 p-3">

                      <p className="font-semibold text-gray-600">
                        Unsold
                      </p>

                      <p className="text-sm text-gray-500">
                        No bids were placed.
                      </p>

                    </div>
                  )}

                  {/* View */}
                  <Link
                    href={`/auctions/${auction.id}`}
                    className="mt-6 block rounded-lg border border-gray-300 py-2 text-center text-sm font-semibold hover:bg-gray-50"
                  >
                    View Auction
                  </Link>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>
  );
}