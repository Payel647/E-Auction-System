"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";

export default function CreateAuctionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "GENERAL",
    starting_price: "",
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access");

      if (!token) {
        throw new Error("Please login first.");
      }

      await apiRequest("/auctions/", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          starting_price: form.starting_price,
          start_time: new Date(form.start_time).toISOString(),
          end_time: new Date(form.end_time).toISOString(),
        }),
      });

      router.push("/seller");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/seller"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Seller Dashboard
          </Link>

          <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

            <h1 className="text-3xl font-bold">
              Create New Auction
            </h1>

            <p className="mt-2 text-gray-500">
              Add an item and start your auction.
            </p>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Item Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the item..."
                  rows="5"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="ELECTRONICS">
                    Electronics
                  </option>

                  <option value="COLLECTIBLES">
                    Collectibles
                  </option>

                  <option value="BOOKS">
                    Books
                  </option>

                  <option value="ART">
                    Art
                  </option>

                  <option value="GENERAL">
                    General
                  </option>
                </select>
              </div>

              {/* Starting Price */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Starting Price (₹)
                </label>

                <input
                  type="number"
                  name="starting_price"
                  value={form.starting_price}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  placeholder="1000"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Start + End */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start Time
                  </label>

                  <input
                    type="datetime-local"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End Time
                  </label>

                  <input
                    type="datetime-local"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    required
                  />
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Creating Auction..."
                  : "Create Auction"}
              </button>

            </form>
          </div>
        </div>
      </main>
  );
}