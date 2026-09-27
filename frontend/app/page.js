import GuestOnly from "../components/GuestOnly";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <GuestOnly>
      <main className="bg-white text-gray-950">

        {/* Hero Section */}
        <section className="border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-6">
            <div className="grid items-center gap-10 lg:grid-cols-2">

              <div>
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  A modern auction platform
                </p>

                <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                  Discover.
                  <br />
                  Bid.
                  <br />
                  <span className="text-emerald-600">Own.</span>
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
                  Discover unique items, place competitive bids, and sell
                  products through a simple and transparent online auction
                  experience.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="rounded-lg bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Start Bidding
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-lg border border-gray-300 px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-900"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="mt-10 flex gap-8 border-t border-gray-200 pt-7">
                  <div>
                    <p className="text-2xl font-bold">100+</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Listings
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">50+</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Active Bidders
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Online Access
                    </p>
                  </div>
                </div>
              </div>

              {/* Auction Preview Card */}
              <div className="relative">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">

                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      LIVE AUCTION
                    </span>

                    <span className="text-xs font-medium text-gray-500">
                      Ends in 02:14:32
                    </span>
                  </div>

                  <div className="relative h-72 overflow-hidden rounded-xl bg-gray-200">
                    <Image
                      src="/featured-watch.jpg"
                      alt="Luxury wristwatch featured in an online auction"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Collectibles
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Premium Collectible
                    </h2>

                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Current Bid
                        </p>
                        <p className="text-2xl font-bold">
                          ₹30,000
                        </p>
                      </div>

                      <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
                        View Auction
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Browse auction categories
            </h2>

            <p className="mt-3 max-w-xl text-gray-600">
              Find products across different categories and discover
              something worth bidding for.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              ["Collectibles", "Rare and interesting items"],
              ["Electronics", "Technology and gadgets"],
              ["Art & Decor", "Unique pieces and artwork"],
              ["Vehicles", "Cars, bikes and more"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                  ◇
                </div>

                <h3 className="font-semibold text-gray-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">

            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Simple process
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                How it works
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  01
                </div>

                <h3 className="mt-5 font-semibold">
                  Create an account
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Register as a buyer or seller and create your profile.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  02
                </div>

                <h3 className="mt-5 font-semibold">
                  Find an auction
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore active auctions and check the current bids.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  03
                </div>

                <h3 className="mt-5 font-semibold">
                  Place your bid
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Place a competitive bid and win the item when the auction
                  closes.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="rounded-2xl bg-gray-950 px-7 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-white">
              Ready to place your first bid?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Join the auction platform and discover products waiting for
              their next owner.
            </p>

            <Link
              href="/register"
              className="mt-7 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
            >
              Create Account
            </Link>
          </div>
        </section>

      </main>
    </GuestOnly>
  );
}