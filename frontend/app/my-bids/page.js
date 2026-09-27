"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function MyBidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBids() {
      const token = localStorage.getItem("access");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest("/auctions/my-bids/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBids(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadBids();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-950">
          ← Dashboard
        </Link>

        <div className="mt-5 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-950">My Bids</h1>
          <p className="mt-2 text-gray-600">Your bidding activity across auctions.</p>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading your bids...</p>
        ) : bids.length === 0 && !error ? (
          <div className="mt-8 rounded-lg bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">No bids yet</h2>
            <p className="mt-2 text-gray-600">Explore current listings and place your first bid.</p>
            <Link
              href="/auctions"
              className="mt-6 inline-flex rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse Auctions
            </Link>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-gray-200 rounded-lg bg-white px-5 shadow-sm sm:px-7">
            {bids.map((bid) => (
              <article key={bid.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {bid.auction_code} · {bid.auction_status}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-950">
                    {bid.auction_title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Bid placed {new Date(bid.created_at).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500">Your bid</p>
                    <p className="font-semibold text-gray-950">{currency.format(Number(bid.amount))}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Current: {currency.format(Number(bid.current_highest_bid))}
                    </p>
                  </div>
                  <Link
                    href={`/auctions/${bid.auction}`}
                    className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-950"
                  >
                    View auction
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}