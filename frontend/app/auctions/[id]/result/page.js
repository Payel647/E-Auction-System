"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "../../../../lib/api";

export default function AuctionResultPage() {
  const params = useParams();
  const { id } = params;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const token = localStorage.getItem("access");

        const data = await apiRequest(
          `/auctions/${id}/result/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResult(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-gray-500">
            Loading auction result...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-600">
            Unable to load result
          </h1>

          <p className="mt-2 text-gray-600">
            {error}
          </p>

          <Link
            href="/auctions"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white"
          >
            Back to Auctions
          </Link>
        </div>
      </main>
    );
  }

  const isClosed = result.status === "CLOSED";
  const isUnsold = result.status === "UNSOLD";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href={`/auctions/${id}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Auction
        </Link>

        {/* Main Card */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* Header */}
          <div className="border-b px-8 py-6">
            <p className="text-sm font-medium text-gray-500">
              {result.auction_code}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {result.title}
            </h1>
          </div>

          {/* Result */}
          <div className="px-8 py-8">

            {isClosed && result.winner && (
              <div className="rounded-xl bg-green-50 p-6 text-center">
                <div className="text-4xl">
                  🏆
                </div>

                <p className="mt-3 text-sm font-medium text-green-700">
                  Auction Winner
                </p>

                <h2 className="mt-1 text-2xl font-bold text-green-900">
                  {result.winner}
                </h2>

                <p className="mt-2 text-sm text-green-700">
                  Congratulations to the highest bidder!
                </p>
              </div>
            )}

            {isUnsold && (
              <div className="rounded-xl bg-gray-100 p-6 text-center">
                <div className="text-4xl">
                  📦
                </div>

                <h2 className="mt-3 text-xl font-bold text-gray-800">
                  Auction Unsold
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  No bids were placed on this auction.
                </p>
              </div>
            )}

            {/* Price Information */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                  Starting Price
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{Number(result.starting_price).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                  Final Price
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{Number(result.final_price).toLocaleString("en-IN")}
                </p>
              </div>

            </div>

            {/* Status & End Time */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                  Final Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    isClosed
                      ? "bg-green-100 text-green-700"
                      : isUnsold
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {result.status}
                </span>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                  Auction Ended
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(result.end_time).toLocaleString("en-IN")}
                </p>
              </div>

            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Link
                href="/auctions"
                className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Browse Auctions
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}