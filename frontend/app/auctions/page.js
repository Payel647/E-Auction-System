"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuctions() {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const data = await apiRequest("/auctions/", {
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

    loadAuctions();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading auctions...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Auctions
          </h1>

          <p className="mt-2 text-gray-500">
            Browse available auction items
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {auctions.length === 0 && !error && (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="text-gray-500">
              No auctions available.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {auctions.map((auction) => (

            <div
              key={auction.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {auction.category}
                </span>

                <span className="text-xs text-gray-500">
                  {auction.status}
                </span>

              </div>

              <h2 className="mt-5 text-xl font-bold">
                {auction.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {auction.description}
              </p>

              <div className="mt-5 space-y-2">

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Starting Price
                  </span>

                  <span className="font-semibold">
                    ₹{auction.starting_price}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Current Bid
                  </span>

                  <span className="font-semibold">
                    ₹{auction.current_highest_bid}
                  </span>
                </div>

              </div>

              <Link
                href={`/auctions/${auction.id}`}
                className="mt-6 block rounded-lg bg-gray-900 py-3 text-center font-semibold text-white hover:bg-gray-800"
              >
                View Auction
              </Link>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}