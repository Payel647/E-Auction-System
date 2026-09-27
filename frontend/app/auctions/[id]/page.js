"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";

export default function AuctionDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);

  async function loadAuction() {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const auctionData = await apiRequest(
        `/auctions/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bidData = await apiRequest(
        `/auctions/${id}/bids/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAuction(auctionData);
      setBids(bidData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadAuction();

  const interval = setInterval(() => {
    loadAuction();
  }, 10000); // every 10 seconds

  return () => clearInterval(interval);
}, [id]);

  async function handleBid(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!amount) {
      setError("Please enter a bid amount.");
      return;
    }

    try {
      setBidding(true);

      const token = localStorage.getItem("access");

      await apiRequest(
        `/auctions/${id}/bid/`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: amount,
          }),
        }
      );

      setSuccess("Bid placed successfully!");
      setAmount("");

      await loadAuction();

    } catch (error) {
      setError(error.message);
    } finally {
      setBidding(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading auction...
        </p>
      </main>
    );
  }

  if (!auction) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Auction not found.
        </p>
      </main>
    );
  }

  const minimumBid =
    Math.max(
      Number(auction.starting_price),
      Number(auction.current_highest_bid)
    ) + 1;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <Link
          href="/auctions"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Auctions
        </Link>

        {/* Auction Information */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-8 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {auction.category}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                {auction.status}
              </span>

            </div>

            <h1 className="mt-6 text-3xl font-bold">
              {auction.title}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {auction.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Starting Price
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹{auction.starting_price}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Current Highest Bid
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-600">
                  ₹{auction.current_highest_bid}
                </p>
              </div>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Seller
                </p>

                <p className="mt-1 font-medium">
                  {auction.seller_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Auction Code
                </p>

                <p className="mt-1 font-medium">
                  {auction.auction_code}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Starts
                </p>

                <p className="mt-1 text-sm">
                  {new Date(
                    auction.start_time
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Ends
                </p>

                <p className="mt-1 text-sm">
                  {new Date(
                    auction.end_time
                  ).toLocaleString()}
                </p>
              </div>

            </div>
            {(auction.status === "CLOSED" || auction.status === "UNSOLD") && (
            <div className="mt-8">
            <Link href={`/auctions/${id}/result`} className="inline-block rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800">
             View Auction Result →
             </Link>
            </div>
)}
          </div>

          {/* Bid Box */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Place Your Bid
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Minimum bid: ₹{minimumBid}
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <form
              onSubmit={handleBid}
              className="mt-6"
            >

              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder={`Minimum ₹${minimumBid}`}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={
                  bidding ||
                  auction.status !== "ACTIVE"
                }
                className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bidding
                  ? "Placing Bid..."
                  : "Place Bid"}
              </button>

            </form>

            {auction.status !== "ACTIVE" && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Bidding is currently unavailable.
              </p>
            )}

          </div>

        </div>

        {/* Bid History */}

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          <h2 className="text-xl font-bold">
            Bid History
          </h2>

          {bids.length === 0 ? (

            <p className="mt-5 text-gray-500">
              No bids yet.
            </p>

          ) : (

            <div className="mt-5 overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="pb-3">
                      Bidder
                    </th>

                    <th className="pb-3">
                      Amount
                    </th>

                    <th className="pb-3">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {bids.map((bid) => (

                    <tr
                      key={bid.id}
                      className="border-b last:border-0"
                    >

                      <td className="py-4">
                        {bid.bidder_name}
                      </td>

                      <td className="py-4 font-semibold">
                        ₹{bid.amount}
                      </td>

                      <td className="py-4 text-sm text-gray-500">
                        {new Date(
                          bid.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}